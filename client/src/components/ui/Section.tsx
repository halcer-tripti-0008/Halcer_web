import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/utils/cn';

interface SectionProps extends ComponentProps<'section'> {
  /** Classes for the inner max-width container. */
  innerClassName?: string;
  /** On desktop, size the section to exactly one screen (see `screen-fit`). Default true. */
  fitScreen?: boolean;
  children: ReactNode;
}

/**
 * Full-bleed page section with the design's responsive side padding
 * (16 → 64px) and a centered 1440px content column.
 */
export function Section({
  className,
  innerClassName,
  fitScreen = true,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        'w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16',
        fitScreen && 'screen-fit',
        className,
      )}
      {...props}
    >
      <div className={cn('mx-auto w-full max-w-[1440px]', innerClassName)}>{children}</div>
    </section>
  );
}
