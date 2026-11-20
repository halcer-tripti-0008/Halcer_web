import type { RequestHandler } from 'express';

import { HTTP_STATUS } from '../../constants/http.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import type { CreateInquiryInput } from './inquiry.schema.js';
import { createInquiry, type InquiryReceipt } from './inquiry.service.js';

/** POST /api/v1/inquiries — body already validated by `validate({ body })`. */
export const postInquiry: RequestHandler = async (req, res) => {
  const receipt = await createInquiry(req.body as CreateInquiryInput);
  sendSuccess<InquiryReceipt>(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: 'Inquiry received',
    data: receipt,
  });
};
