import type { RequestHandler } from 'express';

import { HTTP_STATUS } from '../constants/http.js';
import { ApiError } from '../utils/ApiError.js';

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(
    new ApiError(HTTP_STATUS.NOT_FOUND, `Route ${req.method} ${req.path} not found`, 'NOT_FOUND'),
  );
};
