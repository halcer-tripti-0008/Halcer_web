import axios, { isAxiosError, type AxiosRequestConfig } from 'axios';

import { env } from '@/config/env';
import type { ApiErrorResponse, ApiSuccessResponse } from '@/types/api';

import { ApiClientError } from './ApiClientError';

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return (
    typeof value === 'object' && value !== null && 'success' in value && value.success === false
  );
}

function toApiClientError(error: unknown): ApiClientError {
  if (!isAxiosError(error)) {
    return new ApiClientError({ message: 'Unexpected error', status: null, code: 'UNKNOWN' });
  }

  const payload: unknown = error.response?.data;
  if (isApiErrorResponse(payload)) {
    return new ApiClientError({
      message: payload.error.message,
      status: error.response?.status ?? null,
      code: payload.error.code,
      details: payload.error.details,
      requestId: payload.error.requestId,
    });
  }

  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return new ApiClientError({ message: 'Request timed out', status: null, code: 'TIMEOUT' });
  }

  if (!error.response) {
    return new ApiClientError({ message: 'Network error', status: null, code: 'NETWORK_ERROR' });
  }

  return new ApiClientError({
    message: error.message,
    status: error.response.status,
    code: 'HTTP_ERROR',
  });
}

const http = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15_000,
  headers: { Accept: 'application/json' },
});

http.interceptors.response.use(undefined, (error: unknown) =>
  Promise.reject(toApiClientError(error)),
);

/**
 * Typed request helper that unwraps the `{ success, data }` envelope.
 * Services call this; components never call axios directly.
 *
 * @example const health = await apiRequest<HealthStatus>({ url: '/health' });
 */
export async function apiRequest<TData>(config: AxiosRequestConfig): Promise<TData> {
  const response = await http.request<ApiSuccessResponse<TData>>(config);
  return response.data.data;
}
