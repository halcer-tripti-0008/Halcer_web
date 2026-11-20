/**
 * Standard response envelope for every /api/v1 endpoint.
 * Mirrored in client/src/types/api.ts — keep both in sync.
 */
export interface ApiSuccessResponse<TData> {
  success: true;
  message: string;
  data: TData;
  meta?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
    requestId?: string;
  };
}

export type ApiResponse<TData> = ApiSuccessResponse<TData> | ApiErrorResponse;
