import type Lenis from 'lenis';

const HEADER_OFFSET = -80;

let activeLenis: Lenis | null = null;

export const setActiveLenis = (lenis: Lenis | null) => {
  activeLenis = lenis;
};

export const getActiveLenis = () => activeLenis;

export const scrollToElement = (element: HTMLElement | null) => {
  if (!element) return;
  if (activeLenis) {
    activeLenis.scrollTo(element, { offset: HEADER_OFFSET });
    return;
  }
  element.scrollIntoView({ behavior: 'smooth' });
};

export const scrollToTopInstantly = () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  activeLenis?.scrollTo(0, { immediate: true, force: true });
};
