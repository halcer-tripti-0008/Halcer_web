import { Router } from 'express';

import { createRateLimiter } from '../../middlewares/rateLimiter.js';
import { validate } from '../../middlewares/validate.js';
import { postInquiry } from './inquiry.controller.js';
import { createInquirySchema } from './inquiry.schema.js';

/** Stricter than the global API limit: 5 submissions per IP per hour. */
const inquiryLimiter = createRateLimiter({ windowMs: 60 * 60 * 1000, limit: 5 });

export const inquiryRouter = Router();

inquiryRouter.post('/', inquiryLimiter, validate({ body: createInquirySchema }), postInquiry);
