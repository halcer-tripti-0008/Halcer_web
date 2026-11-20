import { randomUUID } from 'node:crypto';

import { logger } from '../../config/logger.js';
import { InquiryModel } from './inquiry.model.js';
import type { CreateInquiryInput } from './inquiry.schema.js';

const log = logger.child({ module: 'inquiries' });

export interface InquiryReceipt {
  id: string;
}

/**
 * Stores a consultation request. Submissions that filled the honeypot are
 * acknowledged exactly like real ones (so bots learn nothing) but never stored.
 */
export async function createInquiry({
  website,
  ...input
}: CreateInquiryInput): Promise<InquiryReceipt> {
  if (website) {
    log.info('Discarded inquiry caught by honeypot');
    return { id: randomUUID() };
  }

  const inquiry = await InquiryModel.create(input);
  log.info({ inquiryId: inquiry.id }, 'Inquiry received');
  return { id: inquiry.id };
}
