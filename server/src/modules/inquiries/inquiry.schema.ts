import { z } from 'zod';

/** Consultation request submitted from the website contact form. */
export const createInquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  message: z.string().trim().min(10).max(2000),
  /** Honeypot field: real users never fill it in. */
  website: z.string().max(500).optional(),
});

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;
