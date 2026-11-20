import Lenis, { type LenisOptions } from 'lenis';

import { gsap, ScrollTrigger } from '../gsap';

/**
 * Module-level singleton: there is never more than one Lenis instance, no matter how
 * many times React mounts the provider (Strict Mode mounts twice in development).
 *
 * One animation loop for everything: Lenis is driven by GSAP's ticker (autoRaf: false),
 * and every Lenis scroll notifies ScrollTrigger. Lenis scrolls the native window, so
 * ScrollTrigger and Motion's useScroll keep using the default scroller — no scrollerProxy.
 */
const LENIS_OPTIONS = {
  autoRaf: false,
  lerp: 0.1,
  wheelMultiplier: 1,
  // Native touch scrolling feels better on mobile and avoids fighting OS momentum.
  syncTouch: false,
  // Lenis disables smoothing and makes scrollTo instant for prefers-reduced-motion users.
  respectReducedMotion: true,
  stopInertiaOnNavigate: true,
} as const satisfies LenisOptions;

type Listener = () => void;

let lenis: Lenis | null = null;
const listeners = new Set<Listener>();

function notify(): void {
  for (const listener of listeners) listener();
}

function raf(time: number): void {
  // GSAP's ticker reports seconds; Lenis expects milliseconds.
  lenis?.raf(time * 1000);
}

/** Starts smooth scrolling. Returns a teardown function. Safe to call repeatedly. */
export function initSmoothScroll(): () => void {
  if (lenis) return destroySmoothScroll;

  lenis = new Lenis(LENIS_OPTIONS);
  lenis.on('scroll', () => {
    ScrollTrigger.update();
  });

  gsap.ticker.add(raf);
  // Lag smoothing would make Lenis jump after a dropped frame; Lenis handles timing itself.
  gsap.ticker.lagSmoothing(0);

  notify();
  return destroySmoothScroll;
}

function destroySmoothScroll(): void {
  if (!lenis) return;

  gsap.ticker.remove(raf);
  gsap.ticker.lagSmoothing(500, 33);
  lenis.destroy();
  lenis = null;

  notify();
}

export function getLenis(): Lenis | null {
  return lenis;
}

export function subscribeToLenis(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Scrolls to a position/element through Lenis when active, falling back to native scrolling.
 * Use this instead of window.scrollTo so programmatic scrolls stay in sync with Lenis.
 */
export function scrollToTarget(
  target: number | string | HTMLElement,
  options: { immediate?: boolean; offset?: number } = {},
): void {
  if (lenis) {
    lenis.scrollTo(target, { ...options, force: true });
    return;
  }

  const behavior: ScrollBehavior = options.immediate ? 'instant' : 'smooth';
  if (typeof target === 'number') {
    window.scrollTo({ top: target + (options.offset ?? 0), behavior });
    return;
  }
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  element?.scrollIntoView({ behavior });
}
