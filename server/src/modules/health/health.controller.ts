import type { RequestHandler } from 'express';

import { HTTP_STATUS } from '../../constants/http.js';
import { isDatabaseConnected } from '../../database/connection.js';
import { ApiError } from '../../utils/ApiError.js';
import { sendSuccess } from '../../utils/apiResponse.js';

interface HealthStatus {
  status: 'ok';
  uptime: number;
  timestamp: string;
}

/**
 * Readiness probe for load balancers and uptime monitors:
 * 200 when the API and its database are usable, 503 otherwise.
 */
export const getHealth: RequestHandler = (_req, res) => {
  if (!isDatabaseConnected()) {
    throw new ApiError(
      HTTP_STATUS.SERVICE_UNAVAILABLE,
      'Database unavailable',
      'SERVICE_UNAVAILABLE',
    );
  }

  sendSuccess<HealthStatus>(res, {
    message: 'Service healthy',
    data: {
      status: 'ok',
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    },
  });
};
