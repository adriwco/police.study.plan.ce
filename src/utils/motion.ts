export const prefersMotion = () =>
  typeof window.matchMedia !== 'function' ||
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const canUseViewTransition = () =>
  typeof document.startViewTransition === 'function' && prefersMotion();
