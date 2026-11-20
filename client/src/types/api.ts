/**
 * Standard response envelope returned by every /api/v1 endpoint.
 * Mirrors server/src/types/api.ts — keep both in sync.
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
