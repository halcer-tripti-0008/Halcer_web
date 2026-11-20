import { useMutation } from '@tanstack/react-query';

import { apiRequest } from '@/lib/apiClient';

import type { InquiryInput } from './inquiry.schema';

interface InquiryReceipt {
  id: string;
}

export function submitInquiry(input: InquiryInput): Promise<InquiryReceipt> {
  return apiRequest<InquiryReceipt>({ method: 'POST', url: '/inquiries', data: input });
}

export function useSubmitInquiry() {
  return useMutation({ mutationFn: submitInquiry });
}
