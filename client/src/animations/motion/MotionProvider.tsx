import { LazyMotion, MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

import { transitions } from './transitions';

const loadFeatures = () => import('./features').then((module) => module.default);

/**
 * App-wide Motion configuration.
 * - LazyMotion + `strict`: components must use `m.*` (from 'motion/react') instead of `motion.*`,
 *   keeping the animation runtime out of the initial bundle.
 * - reducedMotion="user": transform/layout animations are disabled for reduced-motion users;
 *   opacity and color still animate.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user" transition={transitions.base}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
