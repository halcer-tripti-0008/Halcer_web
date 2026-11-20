import type { TargetAndTransition, Variants } from 'motion/react';

import { DISTANCE, STAGGER } from '../tokens';
import { transitions } from './transitions';

/**
 * Reusable Motion variants. All use the `hidden` / `visible` / `exit` keys so they compose:
 * a parent with `staggerContainer()` orchestrates children using any of the item variants.
 */
export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitions.base },
  exit: { opacity: 0, transition: transitions.exit },
};

export function slideUp(distance: number = DISTANCE.md): Variants {
  return {
    hidden: { opacity: 0, y: distance },
    visible: { opacity: 1, y: 0, transition: transitions.base },
    exit: { opacity: 0, y: -distance / 2, transition: transitions.exit },
  };
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: transitions.base },
  exit: { opacity: 0, scale: 0.98, transition: transitions.exit },
};

export function staggerContainer(stagger: number = STAGGER.base, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren } },
    exit: { transition: { staggerChildren: stagger / 2, staggerDirection: -1 } },
  };
}

/** Route-level enter/exit. Opacity only, so it never shifts layout or fights scroll. */
export const pageTransition: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitions.base },
  exit: { opacity: 0, transition: transitions.exit },
};

/** Interaction presets for `whileHover` / `whileTap`. */
export const interactions = {
  hoverLift: { y: -4, transition: transitions.spring },
  hoverScale: { scale: 1.03, transition: transitions.spring },
  press: { scale: 0.97, transition: transitions.spring },
} as const satisfies Record<string, TargetAndTransition>;
