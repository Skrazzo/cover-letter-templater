import { API_BASE } from "@/consts";
import { normalizeLink } from "./utils";
import type { ApiResponse } from "@/types/api";
import toast from "react-hot-toast";
import { tryCatch } from "./tryCatch";

interface RequestProps<T> {
    error?: (err: Error) => void;
    success?: (data: T) => void;
    before?: () => void;
    finally?: () => void;
}

interface PostProps<T> extends RequestProps<T> {
    data: Record<string, any>;
}

class Requests {
    constructor() {}

    async post<T>(url: string, props: PostProps<T>): Promise<T | void> {
        props.before?.();

        // Normalize url
        const finalUrl = normalizeLink(`${API_BASE}/${url}`);

        try {
            // Do request
            const res = await fetch(finalUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(props.data),
            });

            // Get response data
            const { data, error } = await tryCatch<ApiResponse<T>>(res.json());
            if (error) {
                throw new Error(`Parsing error: ${res.statusText} - ${res.status}`);
            }

            // Check if data is ok
            if ("success" in data && !data.success) {
                throw new Error(data.error);
            }

            // Another check for unexpected error
            if (!res.ok) {
                throw new Error("Unexpected API ERROR with code: " + res.status);
            }

            // Otherwise return response data
            props.success?.(data.data);
            return data.data;
        } catch (error) {
            const err = error as Error;
            // Show notification, and call error callback
            toast.error(err.message);
            props.error?.(err);
        } finally {
            props.finally?.();
        }
    }
}

export default new Requests();
