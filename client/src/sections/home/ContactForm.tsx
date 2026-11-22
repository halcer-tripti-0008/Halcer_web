import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Check, LoaderCircle } from 'lucide-react';
import { useId } from 'react';
import { useForm, type UseFormRegisterReturn } from 'react-hook-form';

import { contactContent } from '@/content/home';
import { ApiClientError } from '@/lib/ApiClientError';
import { inquirySchema, type InquiryInput } from '@/services/inquiry.schema';
import { useSubmitInquiry } from '@/services/inquiry.service';
import { cn } from '@/utils/cn';

const fieldClass =
  'w-full min-h-11 rounded-lg border border-white/12 bg-white/[0.03] px-4 py-3 text-sm text-white shadow-sm transition-all placeholder:text-white/30 focus:border-white/40 focus:bg-ink-600 focus:outline-none aria-invalid:border-red-400/70';

function errorMessageFor(error: unknown): string {
  if (error instanceof ApiClientError && error.status === 429) {
    return 'Too many requests. Please try again in a little while.';
  }
  if (error instanceof ApiClientError && error.code === 'VALIDATION_ERROR') {
    return 'Please check the highlighted fields and try again.';
  }
  return 'Something went wrong. Please try again or email us directly.';
}

interface FieldProps {
  label: string;
  error: string | undefined;
  children: (props: { id: string; describedBy: string | undefined }) => React.ReactNode;
}

function Field({ label, error, children }: FieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-medium text-haze/70">
        {label}
      </label>
      {children({ id, describedBy: error ? errorId : undefined })}
      {error && (
        <p id={errorId} className="text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

function fieldProps(
  registration: UseFormRegisterReturn,
  { id, describedBy }: { id: string; describedBy: string | undefined },
) {
  return {
    ...registration,
    id,
    'aria-invalid': describedBy ? true : undefined,
    'aria-describedby': describedBy,
  };
}

export function ContactForm() {
  const mutation = useSubmitInquiry();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', message: '', website: '' },
  });

  const onSubmit = handleSubmit((values) => {
    mutation.mutate(values, {
      onSuccess: () => {
        reset();
      },
    });
  });

  return (
    <form noValidate onSubmit={(event) => void onSubmit(event)} className="w-full space-y-4">
      <Field label="Full Name" error={errors.name?.message}>
        {(ids) => (
          <input
            type="text"
            autoComplete="name"
            placeholder="Your name"
            className={fieldClass}
            {...fieldProps(register('name'), ids)}
          />
        )}
      </Field>
      <Field label="Work Email" error={errors.email?.message}>
        {(ids) => (
          <input
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="your.email@company.com"
            className={fieldClass}
            {...fieldProps(register('email'), ids)}
          />
        )}
      </Field>
      <Field label="Short Inquiry" error={errors.message?.message}>
        {(ids) => (
          <textarea
            rows={3}
            placeholder="Tell us briefly about your project or timeline..."
            className={cn(fieldClass, 'min-h-[88px] resize-none')}
            {...fieldProps(register('message'), ids)}
          />
        )}
      </Field>

      {/* Honeypot: visually hidden and skipped by keyboard / assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label>
          Website
          <input type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
        </label>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          data-magnetic="0.25"
          disabled={mutation.isPending}
          className="group shine inline-flex min-h-11 w-full cursor-pointer items-center justify-between rounded-pill bg-white px-6 py-3.5 text-sm font-medium tracking-tight text-black shadow-[0_4px_20px_rgba(255,255,255,0.15)] transition-[background-color,box-shadow] duration-200 hover:bg-white/90 hover:shadow-xl disabled:cursor-wait disabled:opacity-80"
        >
          <span>{mutation.isPending ? 'Sending…' : contactContent.submit}</span>
          <span className="ml-2 flex size-7 shrink-0 items-center justify-center rounded-pill bg-black/10 transition-transform group-hover:translate-x-0.5">
            {mutation.isPending ? (
              <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
            ) : (
              <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2.5} />
            )}
          </span>
        </button>
      </div>

      <div role="status" aria-live="polite" className="min-h-5 text-xs">
        {mutation.isSuccess && (
          <p className="flex items-center gap-2 text-emerald-400">
            <Check aria-hidden="true" className="size-4" />
            Thank you — a principal architect will reply within 24 hours.
          </p>
        )}
        {mutation.isError && <p className="text-red-300">{errorMessageFor(mutation.error)}</p>}
      </div>
    </form>
  );
}
