/**
 * Motion feature bundle, loaded lazily by MotionProvider so animation code stays
 * out of the critical path. Switch to `domMax` only if layout animations or drag
 * gestures are needed (it is larger).
 */
export { domAnimation as default } from 'motion/react';
