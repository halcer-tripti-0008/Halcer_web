import { useEffect, type ReactNode } from 'react';

import { initSmoothScroll } from './smoothScroll';

/** Mount once at the app root. Owns the lifecycle of the single Lenis instance. */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  // Synchronizing with an external system (Lenis + GSAP ticker) is a legitimate effect.
  useEffect(() => initSmoothScroll(), []);

  return children;
}
