import { useCallback } from 'react';

import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';

import { GUIDE_FILE, ROUTES } from '@/constants/navigation';
import { usePreferences } from '@/contexts/PreferencesContext';
import { findLesson } from '@/service/catalogService';
import { loadDocument } from '@/service/markdownService';
import { playWhoosh } from '@/utils/cinemaSound';
import { canUseViewTransition } from '@/utils/motion';

const MATCH_CUT_NAME = 'lesson-title';
const LESSON_PATH = /^\/aula\/(.+)$/;

const preloadRoute = async (path: string) => {
  try {
    if (path === ROUTES.guide) {
      await loadDocument(GUIDE_FILE);
      return;
    }
    const lessonId = path.match(LESSON_PATH)?.[1];
    const lesson = lessonId ? findLesson(decodeURIComponent(lessonId)) : undefined;
    if (lesson?.arquivo) await loadDocument(lesson.arquivo);
  } catch {
    return;
  }
};

const setTransitionName = (element: HTMLElement | null | undefined, name: string) => {
  if (element) element.style.viewTransitionName = name;
};

export const useCinematicNavigate = () => {
  const navigate = useNavigate();
  const { cinemaMode, soundOn } = usePreferences();

  return useCallback(
    (path: string, matchCutSource?: HTMLElement | null) => {
      if (cinemaMode && soundOn) playWhoosh();
      if (!canUseViewTransition()) {
        navigate(path);
        return;
      }

      let matchCutTarget: HTMLElement | null = null;
      setTransitionName(matchCutSource, MATCH_CUT_NAME);

      const transition = document.startViewTransition(async () => {
        await preloadRoute(path);
        flushSync(() => navigate(path));
        if (matchCutSource) {
          matchCutTarget = document.querySelector<HTMLElement>('#lesson-body-content h1');
          setTransitionName(matchCutTarget, MATCH_CUT_NAME);
        }
      });

      transition.finished.finally(() => {
        setTransitionName(matchCutSource, '');
        setTransitionName(matchCutTarget, '');
      });
    },
    [cinemaMode, navigate, soundOn],
  );
};
