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
export interface TemplatePreview {
    id: number;
    name: string;
    user_id: number;
    created_at: string;
}

export interface Template extends TemplatePreview {
    template: string;
}

// -------- Cover letters --------
export interface CoverLetterPreview {
    id: number;
    name: string;
}

export interface CoverLetter extends CoverLetterPreview {
    user_id: number;
    letter: string;
    created_at: string;
}
