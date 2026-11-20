import { model, Schema, type InferSchemaType } from 'mongoose';

export const INQUIRY_STATUSES = ['new', 'contacted', 'closed'] as const;

const inquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    status: { type: String, enum: INQUIRY_STATUSES, default: 'new', index: true },
  },
  { timestamps: true, versionKey: false },
);

inquirySchema.index({ createdAt: -1 });

export type Inquiry = InferSchemaType<typeof inquirySchema>;

export const InquiryModel = model('Inquiry', inquirySchema);
