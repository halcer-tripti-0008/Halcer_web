import { MEDIA_QUERIES } from '@/constants/breakpoints';

import { gsap } from './setup';

export interface MotionConditions {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  reduceMotion: boolean;
}

/**
 * Responsive + reduced-motion aware GSAP setup built on gsap.matchMedia().
 * The callback re-runs whenever a condition changes; animations created inside are
 * reverted automatically before each re-run. Call it inside useGSAP so the whole
 * matchMedia instance is reverted on unmount.
 *
 * @example
 * useGSAP(() => {
 *   createResponsiveAnimation(({ isDesktop, reduceMotion }) => {
 *     if (reduceMotion) return;
 *     gsap.from('.item', { y: isDesktop ? 64 : 24, autoAlpha: 0, scrollTrigger: { trigger: '.item' } });
 *   });
 * }, { scope: containerRef });
 */
/** May return a cleanup function, called whenever the conditions change or on revert. */
export type ResponsiveAnimationSetup = (conditions: MotionConditions) => (() => void) | undefined;

export function createResponsiveAnimation(setup: ResponsiveAnimationSetup): gsap.MatchMedia {
  const mm = gsap.matchMedia();

  mm.add(
    {
      isMobile: MEDIA_QUERIES.mobile,
      isTablet: MEDIA_QUERIES.tablet,
      isDesktop: MEDIA_QUERIES.desktop,
      reduceMotion: MEDIA_QUERIES.reducedMotion,
    },
    (context) => setup(context.conditions as unknown as MotionConditions),
  );

  return mm;
}
