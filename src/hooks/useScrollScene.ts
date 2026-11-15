import { RefObject, useLayoutEffect } from 'react';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useCinemaActive } from '@/hooks/useCinemaActive';

export type SceneBuilder = (scope: HTMLElement) => void;

export const useScrollScene = (
  scopeRef: RefObject<HTMLElement>,
  build: SceneBuilder,
  sceneKey: string,
) => {
  const active = useCinemaActive();

  useLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!active || !scope) return undefined;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => build(scope), scope);
    ScrollTrigger.refresh();
    return () => context.revert();
  }, [active, build, scopeRef, sceneKey]);
};
