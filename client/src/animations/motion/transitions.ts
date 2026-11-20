import type { Transition } from 'motion/react';

import { DURATION, EASE } from '../tokens';

/** Shared Motion transitions built from the same tokens GSAP uses. */
export const transitions = {
  fast: { duration: DURATION.fast, ease: EASE.out },
  base: { duration: DURATION.base, ease: EASE.out },
  slow: { duration: DURATION.slow, ease: EASE.out },
  exit: { duration: DURATION.fast, ease: EASE.in },
  /** Physical feel for interactive elements (hover, press, drag). */
  spring: { type: 'spring', stiffness: 400, damping: 30, mass: 0.8 },
  gentleSpring: { type: 'spring', stiffness: 160, damping: 24 },
} as const satisfies Record<string, Transition>;
