import { cn } from '@/utils/cn';

const tones = {
  /** Electric cyan with a strong halo (hero kicker, CTA badges). */
  glow: 'bg-glow-400 shadow-[0_0_8px_#00E5FF,0_0_14px_rgba(0,229,255,0.8)]',
  bright: 'bg-glow-bright shadow-[0_0_8px_#00F0FF]',
  cyan: 'bg-glow-500 shadow-[0_0_8px_#00D2FF]',
  signal: 'bg-signal shadow-[0_0_6px_#00FF9D]',
  accent: 'bg-accent',
  emerald: 'bg-emerald-500',
} as const;

interface StatusDotProps {
  tone: keyof typeof tones;
  /** Tailwind size classes, e.g. "size-2". */
  size?: string;
  pulse?: boolean;
  className?: string;
}

export function StatusDot({ tone, size = 'size-2', pulse = false, className }: StatusDotProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-block shrink-0 rounded-full',
        size,
        tones[tone],
        pulse && 'animate-pulse',
        className,
      )}
    />
  );
}
