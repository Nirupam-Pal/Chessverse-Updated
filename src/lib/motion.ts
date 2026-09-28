/**
 * Shared easing for entrance animations: a soft expo-out — quick to start moving,
 * with a long, gentle settle. Framer's default for duration-based tweens is
 * `easeInOut`, whose slow start reads as sluggish/stiff on reveals.
 */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const
