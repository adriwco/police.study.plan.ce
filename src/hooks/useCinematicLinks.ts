import { useEffect } from 'react';

import { useCinematicNavigate } from '@/hooks/useCinematicNavigate';

const findMatchCutSource = (link: Element) => {
  if (link.classList.contains('lesson-link')) {
    return link.querySelector<HTMLElement>('.lesson-title-text');
  }
  return (
    link.closest('.resume-strip')?.querySelector<HTMLElement>('.resume-lesson-name') ??
    null
  );
};

const isPlainClick = (event: MouseEvent) =>
  event.button === 0 &&
  !event.metaKey &&
  !event.ctrlKey &&
  !event.shiftKey &&
  !event.altKey;

export const useCinematicLinks = () => {
  const go = useCinematicNavigate();

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || !isPlainClick(event)) return;
      const target = event.target instanceof Element ? event.target : null;
      const link = target?.closest('a[href^="#/"]:not([data-native-link])');
      if (!link || link.hasAttribute('target')) return;
      event.preventDefault();
      go(link.getAttribute('href')!.slice(1), findMatchCutSource(link));
    };
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [go]);
};
