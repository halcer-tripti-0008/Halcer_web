import type { Response } from 'express';

import { HTTP_STATUS, type HttpStatus } from '../constants/http.js';
import type { ApiSuccessResponse } from '../types/api.js';

interface SendSuccessOptions<TData> {
  data: TData;
  message?: string;
  statusCode?: HttpStatus;
  meta?: Record<string, unknown>;
}

export function sendSuccess<TData>(
  res: Response,
  { data, message = 'OK', statusCode = HTTP_STATUS.OK, meta }: SendSuccessOptions<TData>,
): void {
  const body: ApiSuccessResponse<TData> = { success: true, message, data, ...(meta && { meta }) };
  res.status(statusCode).json(body);
}
