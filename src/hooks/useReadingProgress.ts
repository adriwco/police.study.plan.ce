import { RefObject, useEffect } from 'react';

const MIN_SCROLLABLE_HEIGHT = 60;

export const useReadingProgress = (barRef: RefObject<HTMLElement>, resetKey: string) => {
  useEffect(() => {
    const update = () => {
      const bar = barRef.current;
      if (!bar) return;
      const root = document.documentElement;
      const scrollTop = root.scrollTop || document.body.scrollTop;
      const scrollable = root.scrollHeight - root.clientHeight;
      const pct =
        scrollable > MIN_SCROLLABLE_HEIGHT
          ? Math.min(100, Math.max(0, (scrollTop * 100) / scrollable))
          : 0;
      bar.style.width = `${pct.toFixed(1)}%`;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [barRef, resetKey]);
};
