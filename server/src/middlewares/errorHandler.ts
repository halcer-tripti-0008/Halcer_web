import type { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';

import { isProduction } from '../config/env.js';
import { HTTP_STATUS, type HttpStatus } from '../constants/http.js';
import type { ApiErrorResponse } from '../types/api.js';
import { ApiError } from '../utils/ApiError.js';

interface NormalizedError {
  statusCode: HttpStatus;
  code: string;
  message: string;
  details?: unknown;
}

/** Errors raised by Express's body parser carry `type` (malformed JSON, payload too large). */
function isBodyParserError(error: unknown): error is Error & { type: string } {
  return error instanceof Error && 'type' in error && typeof error.type === 'string';
}

function normalizeError(error: unknown): NormalizedError {
  if (error instanceof ApiError) {
    return {
      statusCode: error.statusCode,
      code: error.code,
      message: error.message,
      details: error.details,
    };
  }

  if (error instanceof ZodError) {
    return {
      statusCode: HTTP_STATUS.BAD_REQUEST,
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      details: error.issues.map(({ path, message }) => ({ path: path.join('.'), message })),
    };
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return {
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      code: 'VALIDATION_ERROR',
      message: 'Data validation failed',
      details: Object.values(error.errors).map(({ path, message }) => ({ path, message })),
    };
  }

  if (error instanceof mongoose.Error.CastError) {
    return {
      statusCode: HTTP_STATUS.BAD_REQUEST,
      code: 'INVALID_VALUE',
      message: `Invalid value for ${error.path}`,
    };
  }

  if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) {
    return {
      statusCode: HTTP_STATUS.CONFLICT,
      code: 'DUPLICATE_RESOURCE',
      message: 'Resource already exists',
    };
  }

  if (isBodyParserError(error)) {
    return error.type === 'entity.too.large'
      ? {
          statusCode: HTTP_STATUS.PAYLOAD_TOO_LARGE,
          code: 'PAYLOAD_TOO_LARGE',
          message: 'Request body too large',
        }
      : {
          statusCode: HTTP_STATUS.BAD_REQUEST,
          code: 'MALFORMED_REQUEST',
          message: 'Malformed request body',
        };
  }

  return {
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code: 'INTERNAL_ERROR',
    message: 'Something went wrong',
  };
}

/**
 * The single place where errors become HTTP responses.
 * Express 5 forwards rejected promises from async handlers here automatically,
 * so controllers need neither try/catch nor an asyncHandler wrapper.
 */
export const errorHandler: ErrorRequestHandler = (error: unknown, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  const normalized = normalizeError(error);
  const isServerError = normalized.statusCode >= 500;

  if (isServerError) {
    req.log.error({ err: error }, 'Unhandled request error');
  }

  // Stack traces are exposed only outside production, and only for unexpected errors.
  const details =
    !isProduction && isServerError && error instanceof Error ? error.stack : normalized.details;

  const body: ApiErrorResponse = {
    success: false,
    error: {
      code: normalized.code,
      message: normalized.message,
      ...(typeof req.id === 'string' && { requestId: req.id }),
      ...(details !== undefined && { details }),
    },
  };

  res.status(normalized.statusCode).json(body);
};
