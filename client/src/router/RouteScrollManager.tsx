import { useEffect } from 'react';
import { useLocation } from 'react-router';

import { scrollToTarget } from '@/animations/lenis';
import { HEADER_HEIGHT } from '@/constants/navigation';

/**
 * Resets scroll on navigation, or scrolls to `#hash` targets (clearing the fixed header),
 * through Lenis so its internal position never drifts from the real one. Keyed on
 * location.key so clicking the same anchor link twice still scrolls.
 * Replaces <ScrollRestoration />, which calls window.scrollTo and bypasses Lenis.
 */
export function RouteScrollManager() {
  const { hash, key } = useLocation();

  useEffect(() => {
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    if (target) {
      // The header scales with the root font size on short screens, so measure it.
      const headerHeight = document.querySelector('header')?.offsetHeight ?? HEADER_HEIGHT;
      scrollToTarget(target, { offset: -headerHeight });
    } else {
      scrollToTarget(0, { immediate: true });
    }
  }, [hash, key]);

  return null;
}
