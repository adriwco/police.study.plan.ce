import type Lenis from 'lenis';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  getActiveLenis,
  scrollToElement,
  scrollToTopInstantly,
  setActiveLenis,
} from '@/utils/smoothScroll';

describe('smoothScroll', () => {
  afterEach(() => setActiveLenis(null));

  it('usa a rolagem nativa suave quando o Lenis está desligado', () => {
    const element = document.createElement('section');
    element.scrollIntoView = vi.fn();
    scrollToElement(element);
    expect(element.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('usa o Lenis com desconto do cabeçalho quando ativo', () => {
    const lenis = { scrollTo: vi.fn() } as unknown as Lenis;
    setActiveLenis(lenis);
    const element = document.createElement('section');
    scrollToElement(element);
    expect(lenis.scrollTo).toHaveBeenCalledWith(element, { offset: -80 });
    expect(getActiveLenis()).toBe(lenis);
  });

  it('ignora elemento inexistente', () => {
    expect(() => scrollToElement(null)).not.toThrow();
  });

  it('volta ao topo imediatamente nos dois mecanismos', () => {
    const lenis = { scrollTo: vi.fn() } as unknown as Lenis;
    setActiveLenis(lenis);
    scrollToTopInstantly();
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
    expect(lenis.scrollTo).toHaveBeenCalledWith(0, { immediate: true, force: true });
  });
});
