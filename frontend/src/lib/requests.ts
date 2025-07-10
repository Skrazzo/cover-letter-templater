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

interface GetProps<T> extends RequestProps<T> {
    params?: Record<string, any>;
}

class Requests {
    constructor() {}

    async verifyData<T>(res: Response): Promise<T> {
        // Get response data
        const { data, error } = await tryCatch<ApiResponse<T>>(res.json());
        if (error) {
            throw new Error(`Parsing error: ${res.statusText} - ${res.status}`);
        }

        // Check if authentication is required
        if ("needsAuthentication" in data && data.needsAuthentication) {
            window.location.replace("/login");
            throw new Error("Authentication is required");
        }

        // Check if data is ok
        if ("success" in data && !data.success) {
            throw new Error(data.error);
        }

        // Another check for unexpected error
        if (!res.ok) {
            throw new Error("Unexpected API ERROR with code: " + res.status);
        }

        // Return response data
        return data.data;
    }

    async get<T>(url: string, props: GetProps<T>): Promise<T | null> {
        // Call before
        props.before?.();

        // Get url parameters
        const urlParams = props.params ? new URLSearchParams(props.params).toString() : "";
        // Normalize url
        const finalUrl = normalizeLink(`${API_BASE}/${url}${urlParams}`);

        try {
            // Do request
            const res = await fetch(finalUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // Verify data
            const responseData = await this.verifyData<T>(res);

            // Otherwise return response data
            props.success?.(responseData);
            return responseData;
        } catch (error) {
            const err = error as Error;
            // Show notification, and call error callback
            toast.error(err.message);
            props.error?.(err);
            return null;
        } finally {
            props.finally?.();
        }
    }

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

            // Verify data
            const responseData = await this.verifyData<T>(res);

            // Otherwise return response data
            props.success?.(responseData);
            return responseData;
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
