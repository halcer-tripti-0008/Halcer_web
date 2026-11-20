import { m } from 'motion/react';
import type { ReactNode } from 'react';

import { slideUp, staggerContainer } from '@/animations/motion';
import { DISTANCE, STAGGER } from '@/animations/tokens';

const VIEWPORT = { once: true, amount: 0.2 } as const;
const itemVariants = slideUp(DISTANCE.md);

interface RevealProps {
  children: ReactNode;
  className?: string;
}

/** Fades + slides its content up once, the first time it scrolls into view. */
export function Reveal({ children, className }: RevealProps) {
  return (
    <m.div
      className={className}
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {children}
    </m.div>
  );
}

interface RevealGroupProps extends RevealProps {
  stagger?: number;
}

/** Container that reveals its <RevealItem> children in sequence. */
export function RevealGroup({ children, className, stagger = STAGGER.base }: RevealGroupProps) {
  return (
    <m.div
      className={className}
      variants={staggerContainer(stagger)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {children}
    </m.div>
  );
}

/** Child of <RevealGroup>; inherits the group's timing. */
export function RevealItem({ children, className }: RevealProps) {
  return (
    <m.div className={className} variants={itemVariants}>
      {children}
    </m.div>
  );
}
