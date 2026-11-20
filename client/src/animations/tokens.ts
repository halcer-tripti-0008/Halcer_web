/**
 * Motion design tokens shared by GSAP and Motion so both libraries feel identical.
 * Durations are in seconds (the unit both libraries use).
 * Easings are cubic-bezier control points: Motion takes them directly,
 * GSAP gets the same curves registered as CustomEase `halcer.<name>` (see gsap/setup.ts).
 * Replace values with the motion spec from the Figma file when available.
 */
export const DURATION = {
  instant: 0.15,
  fast: 0.3,
  base: 0.6,
  slow: 0.9,
  slower: 1.2,
} as const;

export type CubicBezier = readonly [number, number, number, number];

export const EASE = {
  /** Default for entrances: fast start, long soft settle. */
  out: [0.22, 1, 0.36, 1],
  /** Symmetric, for elements moving between two on-screen states. */
  inOut: [0.65, 0, 0.35, 1],
  /** For exits. */
  in: [0.55, 0, 1, 0.45],
} as const satisfies Record<string, CubicBezier>;

export type EaseName = keyof typeof EASE;

export const STAGGER = {
  tight: 0.04,
  base: 0.08,
  loose: 0.14,
} as const;

/** Default travel distance (px) for reveal-style entrances. */
export const DISTANCE = {
  sm: 16,
  md: 32,
  lg: 64,
} as const;
