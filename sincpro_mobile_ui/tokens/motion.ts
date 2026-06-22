/**
 * Motion tokens — durations and curves for consistent animations (reanimated, LayoutAnimation).
 * Single source of the DS "rhythm": enter/exit, press, theme transitions, sheets, skeletons.
 */

export const duration = {
  instant: 0,
  fast: 120,
  normal: 200,
  slow: 320,
  slower: 480,
} as const;

export type DurationToken = keyof typeof duration;

/** Bezier curves (x1,y1,x2,y2) for Easing.bezier / CSS-like. */
export const easing = {
  standard: [0.2, 0, 0, 1],
  decelerate: [0, 0, 0, 1],
  accelerate: [0.3, 0, 1, 1],
  emphasized: [0.2, 0, 0, 1],
} as const;

export type EasingToken = keyof typeof easing;

/** Config for reanimated withSpring (spring presets). */
export const spring = {
  default: { damping: 20, stiffness: 200, mass: 1 },
  gentle: { damping: 24, stiffness: 120, mass: 1 },
  snappy: { damping: 18, stiffness: 300, mass: 1 },
} as const;

export type SpringToken = keyof typeof spring;

export const motion = { duration, easing, spring } as const;
