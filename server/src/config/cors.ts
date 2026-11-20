import type { CorsOptions } from 'cors';

import { HTTP_STATUS } from '../constants/http.js';
import { ApiError } from '../utils/ApiError.js';
import { env } from './env.js';

const allowedOrigins = new Set(env.CORS_ORIGINS);

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // Requests without an Origin header (curl, server-to-server, same-origin) are allowed;
    // CORS only governs browser cross-origin access.
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }
    callback(new ApiError(HTTP_STATUS.FORBIDDEN, 'Origin not allowed by CORS', 'CORS_FORBIDDEN'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  exposedHeaders: ['X-Request-Id', 'RateLimit', 'RateLimit-Policy', 'Retry-After'],
  credentials: true,
  maxAge: 600,
};
