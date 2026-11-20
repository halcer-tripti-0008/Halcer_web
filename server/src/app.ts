import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { corsOptions } from './config/cors.js';
import { env } from './config/env.js';
import { API_PREFIX } from './constants/http.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFound.js';
import { apiRateLimiter } from './middlewares/rateLimiter.js';
import { requestLogger } from './middlewares/requestLogger.js';
import { v1Router } from './routes/v1.js';

/** Builds the Express application without binding a port (keeps it testable). */
export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  // Number of proxy hops to trust; required for correct client IPs behind a load balancer.
  app.set('trust proxy', env.TRUST_PROXY);

  app.use(requestLogger);
  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: false, limit: '100kb' }));

  app.use(API_PREFIX, apiRateLimiter, v1Router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
