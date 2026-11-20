import { Router } from 'express';

import { healthRouter } from '../modules/health/health.routes.js';
import { inquiryRouter } from '../modules/inquiries/inquiry.routes.js';

/** Aggregates every v1 module router. Register new modules here. */
export const v1Router = Router();

v1Router.use('/health', healthRouter);
v1Router.use('/inquiries', inquiryRouter);
