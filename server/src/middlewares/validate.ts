import type { RequestHandler } from 'express';
import type { z } from 'zod';

interface RequestSchemas {
  body?: z.ZodType;
  query?: z.ZodType;
  params?: z.ZodType;
}

/**
 * Validates req.body / req.query / req.params and replaces them with the parsed
 * (coerced, unknown-keys-stripped) values. A ZodError is forwarded to the error
 * middleware, which responds with 400 and per-field details.
 *
 * @example router.post('/', validate({ body: createInquirySchema }), inquiryController.create)
 */
export function validate(schemas: RequestSchemas): RequestHandler {
  return (req, _res, next) => {
    if (schemas.params) req.params = schemas.params.parse(req.params) as typeof req.params;
    if (schemas.body) req.body = schemas.body.parse(req.body);
    if (schemas.query) {
      // Express 5 exposes req.query as a getter, so it is redefined rather than assigned.
      Object.defineProperty(req, 'query', {
        value: schemas.query.parse(req.query),
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }
    next();
  };
}
