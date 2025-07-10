// Data structure for successful responses
export interface SuccessResponse<T> {
    success: true;
    data: T;
}

// Data structure for error responses
export interface ErrorResponse {
    success: false;
    error: string;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// user info returned by /info route
export interface TokenUserInfo {
    id: number;
    name: string;
    email: string;
}

// -------- Templates --------
export interface Template {
    id: number;
    user_id: number;
    name: string;
    template: string;
    created_at: string;
}
