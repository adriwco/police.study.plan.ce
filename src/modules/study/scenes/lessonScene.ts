import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const buildLessonScene = (scope: HTMLElement) => {
  gsap.from('.lesson-meta-strip .meta-pill', {
    opacity: 0,
    y: 10,
    duration: 0.7,
    delay: 0.3,
    stagger: 0.06,
    ease: 'expo.out',
  });

  scope.querySelectorAll<HTMLElement>('.lesson-article blockquote').forEach((quote) => {
    gsap.fromTo(
      quote,
      { x: -18, opacity: 0.25 },
      {
        x: 0,
        opacity: 1,
        ease: 'none',
        scrollTrigger: { trigger: quote, start: 'top 88%', end: 'top 62%', scrub: true },
      },
    );
  });

  gsap.set('.table-scroll-wrap, .quiz-card', { opacity: 0, y: 28 });
  ScrollTrigger.batch('.table-scroll-wrap, .quiz-card', {
    start: 'top bottom',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1 }),
  });

  gsap.from('.lesson-completion-card, .notepad-card, .lesson-pager', {
    opacity: 0,
    y: 40,
    duration: 1,
    ease: 'expo.out',
    stagger: 0.12,
    scrollTrigger: { trigger: '.lesson-completion-card', start: 'top 92%', once: true },
  });
};
