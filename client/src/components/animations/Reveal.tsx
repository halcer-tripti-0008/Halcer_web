import { useRef, type ReactNode } from 'react';

import { revealBlock, useGSAP } from '@/animations/gsap';

interface RevealProps {
  children: ReactNode;
  className?: string;
}

/**
 * Reveals its direct children (fade up out of a soft blur) the first time it scrolls into
 * view. Inside it, mark headings `data-reveal="lines"` for masked line reveals and image
 * frames `data-reveal="media"` for clip-path wipes. See animations/gsap/reveal.ts.
 */
export function Reveal({ children, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (ref.current) revealBlock(ref.current, 'block');
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Container whose <RevealItem> children (cards) rise in sequence, with a slight 3D tip. */
export function RevealGroup({ children, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (ref.current) revealBlock(ref.current, 'stagger');
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Child of <RevealGroup>: a layout wrapper the group animates as one unit. */
export function RevealItem({ children, className }: RevealProps) {
  return <div className={className}>{children}</div>;
}
