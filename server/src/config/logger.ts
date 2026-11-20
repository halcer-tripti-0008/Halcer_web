import { pino } from 'pino';

import { env, isDevelopment } from './env.js';

/**
 * Structured JSON logger. In development, output is piped through pino-pretty
 * for readability; in production, raw JSON goes to stdout for the log collector.
 */
export const logger = pino({
  level: env.LOG_LEVEL,
  base: { service: 'halcer-api', env: env.NODE_ENV },
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'res.headers["set-cookie"]'],
    censor: '[REDACTED]',
  },
  ...(isDevelopment && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:HH:MM:ss',
        ignore: 'pid,hostname,service,env',
      },
    },
  }),
});
