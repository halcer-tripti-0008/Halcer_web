import { z } from 'zod';

/**
 * Consultation request form. Mirrors server/src/modules/inquiries/inquiry.schema.ts
 * (the server remains the source of truth and re-validates everything).
 */
export const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(120, 'Name is too long.'),
  email: z
    .string()
    .trim()
    .min(1, 'Please enter your work email.')
    .max(254, 'Email is too long.')
    .pipe(z.email('Please enter a valid email address.')),
  message: z
    .string()
    .trim()
    .min(10, 'Please tell us a little more (at least 10 characters).')
    .max(2000, 'Please keep it under 2,000 characters.'),
  /** Honeypot: hidden from people, filled in by naive bots. */
  website: z.string().optional(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
