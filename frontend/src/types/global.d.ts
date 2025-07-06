// types/global.d.ts or at the top of a relevant file
export {};

declare global {
    interface Window {
        navigateToLogin?: Promise<void>;
    }
}
