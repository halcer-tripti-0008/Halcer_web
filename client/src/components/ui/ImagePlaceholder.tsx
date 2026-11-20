import { cn } from '@/utils/cn';

/**
 * Neutral stand-in for imagery the design references but whose source asset is
 * unavailable. Replace with a real <img> once the photo is supplied.
 */
export function ImagePlaceholder({ label, className }: { label: string; className?: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        // Soft slate gradient with a faint engineering grid on top.
        '[background-image:linear-gradient(rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(160deg,#e2e8f0_0%,#cbd5e1_55%,#94a3b8_100%)]',
        '[background-size:24px_24px,24px_24px,100%_100%]',
        className,
      )}
    />
  );
}
