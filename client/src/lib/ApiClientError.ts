/**
 * Normalized error thrown by every API call, whatever went wrong (HTTP, network, timeout).
 * Kept free of axios imports so consumers (e.g. the query client) don't pull axios
 * into the entry bundle.
 */
export class ApiClientError extends Error {
  /** HTTP status, or null when no response was received (network error, timeout). */
  readonly status: number | null;
  readonly code: string;
  readonly details: unknown;
  readonly requestId: string | undefined;

  constructor(options: {
    message: string;
    status: number | null;
    code: string;
    details?: unknown;
    requestId?: string | undefined;
  }) {
    super(options.message);
    this.name = 'ApiClientError';
    this.status = options.status;
    this.code = options.code;
    this.details = options.details;
    this.requestId = options.requestId;
  }
}
