import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

const variants = {
  /** Dark sections: cyan-tinted glass with a soft glow (hero kicker). */
  glow: 'border border-glow-400/35 bg-glow-500/8 text-white/90 shadow-[0_0_15px_rgba(0,210,255,0.15)]',
  /** Dark sections: quieter cyan tint (section eyebrows). */
  glowSoft: 'border border-glow-500/25 bg-glow-500/6 text-white',
  /** Dark sections: neutral glass. */
  subtle: 'border border-white/10 bg-white/5 text-white/80',
  /** Light sections: slate with accent text. */
  light: 'border border-slate-300 bg-slate-100 font-semibold text-accent',
  /** Light sections: sky tint (section eyebrows). */
  lightAccent: 'border border-sky-200 bg-sky-100 font-semibold text-accent',
  /** On grey cards: white chip. */
  white: 'border border-slate-200/80 bg-white font-semibold',
} as const;

interface PillProps {
  variant: keyof typeof variants;
  children: ReactNode;
  className?: string;
}

/** Rounded label/badge used for eyebrows, tags and status chips. */
export function Pill({ variant, children, className }: PillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-pill px-3 py-1 text-xs',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
