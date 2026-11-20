import { rateLimit } from 'express-rate-limit';

import { env } from '../config/env.js';
import { HTTP_STATUS } from '../constants/http.js';
import type { ApiErrorResponse } from '../types/api.js';

const rateLimitResponse: ApiErrorResponse = {
  success: false,
  error: { code: 'RATE_LIMITED', message: 'Too many requests, please try again later.' },
};

/**
 * Factory for rate limiters. Use it for stricter per-route limits
 * (e.g. a contact form) on top of the global API limiter.
 */
export function createRateLimiter(options: { windowMs: number; limit: number }) {
  return rateLimit({
    ...options,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    message: rateLimitResponse,
  });
}

export const apiRateLimiter = createRateLimiter({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX,
});
