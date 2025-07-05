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
