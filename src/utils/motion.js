// Shared reduced-motion check for the auto-cycling review components.
export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default prefersReducedMotion;
