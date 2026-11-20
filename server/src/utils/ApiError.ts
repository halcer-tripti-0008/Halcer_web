import type { HttpStatus } from '../constants/http.js';

/**
 * Operational error with an HTTP status and a stable machine-readable code.
 * Throw this from services/controllers; the error middleware serializes it.
 * Anything that is not an ApiError is treated as an unexpected 500.
 */
export class ApiError extends Error {
  readonly statusCode: HttpStatus;
  readonly code: string;
  readonly details: unknown;

  constructor(statusCode: HttpStatus, message: string, code = 'ERROR', details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}
