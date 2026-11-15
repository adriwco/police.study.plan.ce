import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const HEADER_START = 'top top+=56';

export const buildDashboardScene = (scope: HTMLElement) => {
  const board = scope.querySelector('.swiss-board');
  if (board) {
    const leave = { trigger: board, start: HEADER_START, end: 'bottom top', scrub: true };
    gsap.to(board, {
      scale: 0.965,
      opacity: 0.55,
      transformOrigin: '50% 0%',
      ease: 'none',
      scrollTrigger: leave,
    });
    gsap.to('.editorial-headline', { yPercent: -22, ease: 'none', scrollTrigger: leave });
    gsap.to('.swiss-metrics-grid', { y: -36, ease: 'none', scrollTrigger: leave });
    gsap.fromTo(
      '.cine-shader-wrap',
      { opacity: 1 },
      { opacity: 0, ease: 'none', scrollTrigger: leave },
    );
  }

  gsap.fromTo(
    '.section-bar .section-title',
    { clipPath: 'inset(0 100% 0 0)' },
    {
      clipPath: 'inset(0 0% 0 0)',
      duration: 1.2,
      ease: 'expo.inOut',
      scrollTrigger: { trigger: '.section-bar', start: 'top 85%', once: true },
    },
  );

  gsap.set('.module-cell', {
    opacity: 0,
    y: 56,
    rotateX: -10,
    transformPerspective: 900,
  });
  ScrollTrigger.batch('.module-cell', {
    start: 'top 92%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.08,
        overwrite: true,
      }),
  });
};
