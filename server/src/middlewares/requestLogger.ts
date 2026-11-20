import { randomUUID } from 'node:crypto';

import { pinoHttp } from 'pino-http';

import { logger } from '../config/logger.js';

const REQUEST_ID_HEADER = 'x-request-id';
const MAX_INCOMING_ID_LENGTH = 128;

/**
 * Structured per-request logging with a correlation id.
 * An incoming X-Request-Id (e.g. from a load balancer) is reused; otherwise one is generated.
 */
export const requestLogger = pinoHttp({
  logger,
  genReqId(req, res) {
    const incoming = req.headers[REQUEST_ID_HEADER];
    const id =
      typeof incoming === 'string' &&
      incoming.length > 0 &&
      incoming.length <= MAX_INCOMING_ID_LENGTH
        ? incoming
        : randomUUID();
    res.setHeader('X-Request-Id', id);
    return id;
  },
  customLogLevel(_req, res, err) {
    if (err || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  serializers: {
    req: (req: { id: unknown; method: string; url: string }) => ({
      id: req.id,
      method: req.method,
      url: req.url,
    }),
    res: (res: { statusCode: number }) => ({ statusCode: res.statusCode }),
  },
});
