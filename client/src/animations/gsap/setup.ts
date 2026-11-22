import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

import { DURATION, EASE, type EaseName } from '../tokens';

/**
 * The only place GSAP plugins are registered. Every GSAP import in the app must come
 * from '@/animations/gsap' so registration and defaults are guaranteed to have run.
 * ES module evaluation runs this exactly once, regardless of React Strict Mode.
 */
gsap.registerPlugin(useGSAP, ScrollTrigger, CustomEase, SplitText);

for (const [name, [x1, y1, x2, y2]] of Object.entries(EASE)) {
  CustomEase.create(`halcer.${name}`, `M0,0 C${x1},${y1} ${x2},${y2} 1,1`);
}

/** GSAP ease names matching the shared EASE tokens. */
export const GSAP_EASE = Object.fromEntries(
  Object.keys(EASE).map((name) => [name, `halcer.${name}`]),
) as Record<EaseName, string>;

gsap.defaults({ duration: DURATION.base, ease: GSAP_EASE.out });

// Avoid a full refresh when mobile browser toolbars show/hide (resizes viewport height only).
ScrollTrigger.config({ ignoreMobileResize: true });

// Web fonts change text metrics after first layout; recompute trigger positions once loaded.
if (typeof document !== 'undefined') {
  void document.fonts.ready.then(() => {
    ScrollTrigger.refresh();
  });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
