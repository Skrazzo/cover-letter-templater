import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function normalizeLink(link: string) {
    let tmp = link;

    // Remove double slashes
    while (tmp.includes("//")) {
        tmp = tmp.replaceAll("//", "/");
    }

    return tmp;
}
