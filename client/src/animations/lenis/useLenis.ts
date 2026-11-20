import type Lenis from 'lenis';
import { useSyncExternalStore } from 'react';

import { getLenis, subscribeToLenis } from './smoothScroll';

/**
 * The active Lenis instance, or null before init / after teardown.
 * Use for scroll-locking (lenis.stop()/start()) or listening to scroll velocity.
 * For simple programmatic scrolling prefer `scrollToTarget`.
 */
export function useLenis(): Lenis | null {
  return useSyncExternalStore(subscribeToLenis, getLenis, () => null);
}
