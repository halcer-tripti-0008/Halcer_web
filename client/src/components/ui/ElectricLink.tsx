import type { ReactNode } from 'react';

import { SmartLink } from '@/components/common/SmartLink';
import { cn } from '@/utils/cn';

const sizes = {
  /** Header: compact, uppercase, fully rounded. */
  compact:
    'rounded-full px-5 py-2.5 text-label-caps font-bold tracking-[0.05em] uppercase shadow-[0_0_20px_rgba(0,229,255,0.35)]',
  /** Hero: larger, sentence case. */
  large: 'rounded-pill px-6 py-3 text-base font-bold shadow-[0_0_25px_rgba(0,229,255,0.4)]',
} as const;

interface ElectricLinkProps {
  href: string;
  size: keyof typeof sizes;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

/** Primary call-to-action: electric gradient fill on dark backgrounds. */
export function ElectricLink({ href, size, children, className, onClick }: ElectricLinkProps) {
  return (
    <SmartLink
      href={href}
      onClick={onClick}
      data-magnetic="0.35"
      className={cn(
        'shine inline-flex min-h-11 items-center justify-center text-ink-950 transition-[filter,box-shadow] duration-300 bg-electric hover:shadow-[0_0_32px_rgba(0,229,255,0.55)] hover:brightness-110',
        sizes[size],
        className,
      )}
    >
      {children}
    </SmartLink>
  );
}
