/** Mirrors Tailwind's default breakpoints (px) so JS (GSAP matchMedia) and CSS agree. */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const MEDIA_QUERIES = {
  mobile: `(max-width: ${BREAKPOINTS.md - 0.02}px)`,
  tablet: `(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 0.02}px)`,
  desktop: `(min-width: ${BREAKPOINTS.lg}px)`,
  reducedMotion: '(prefers-reduced-motion: reduce)',
  /** Mouse/trackpad devices: cursor-driven effects run only here. */
  finePointer: '(hover: hover) and (pointer: fine)',
} as const;
