import { QueryClient } from '@tanstack/react-query';

import { ApiClientError } from './ApiClientError';

const MAX_RETRIES = 2;

/** Retry only transient failures: network errors, timeouts and 5xx — never 4xx. */
function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= MAX_RETRIES) return false;
  if (error instanceof ApiClientError) return error.status === null || error.status >= 500;
  return false;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Marketing-site content changes rarely; avoid refetch storms.
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: shouldRetry,
    },
    mutations: {
      retry: false,
    },
  },
});
