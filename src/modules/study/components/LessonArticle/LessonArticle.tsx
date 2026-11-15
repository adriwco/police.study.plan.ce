import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { createPortal } from 'react-dom';

import { useStudy } from '@/contexts/StudyContext';
import {
  QuizEvalBar,
  QuizScoreBanner,
} from '@/modules/study/components/LessonArticle/QuizControls';
import { LessonDocument } from '@/utils/lessonDocument';
import { quizScore } from '@/utils/studyMetrics';

interface LessonArticleProps {
  document: LessonDocument;
  lessonId: string;
  bodyId: string;
}

interface QuizSlots {
  banner: HTMLElement | null;
  evalBars: { qNum: number; element: HTMLElement }[];
}

const EMPTY_SLOTS: QuizSlots = { banner: null, evalBars: [] };

const scrollToAnchor = (event: MouseEvent) => {
  const target = event.target instanceof Element ? event.target : null;
  const anchor = target?.closest('a[href^="#"]');
  const href = anchor?.getAttribute('href') ?? '';
  if (href.length <= 1 || href.startsWith('#/')) return;
  event.preventDefault();
  document
    .getElementById(decodeURIComponent(href.slice(1)))
    ?.scrollIntoView({ behavior: 'smooth' });
};

const LessonArticle = ({
  document: lessonDocument,
  lessonId,
  bodyId,
}: LessonArticleProps) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [slots, setSlots] = useState<QuizSlots>(EMPTY_SLOTS);
  const { questoes, evaluateQuestion } = useStudy();

  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    setSlots({
      banner: body.querySelector<HTMLElement>('[data-quiz-banner]'),
      evalBars: Array.from(body.querySelectorAll<HTMLElement>('[data-quiz-eval]')).map(
        (element) => ({ qNum: Number(element.dataset.quizEval), element }),
      ),
    });
  }, [lessonDocument.html]);

  useEffect(() => {
    bodyRef.current?.querySelectorAll<HTMLElement>('[data-quiz-card]').forEach((card) => {
      const status = questoes[`${lessonId}#${card.dataset.quizCard}`];
      card.classList.toggle('status-hit', status === 'hit');
      card.classList.toggle('status-miss', status === 'miss');
    });
  }, [lessonDocument.html, lessonId, questoes, slots]);

  useEffect(() => {
    const body = bodyRef.current;
    body?.addEventListener('click', scrollToAnchor);
    return () => body?.removeEventListener('click', scrollToAnchor);
  }, []);

  const score = quizScore(lessonId, lessonDocument.quizCount, questoes);

  return (
    <>
      <div
        ref={bodyRef}
        id={bodyId}
        dangerouslySetInnerHTML={{ __html: lessonDocument.html }}
      />
      {slots.banner
        ? createPortal(
            <QuizScoreBanner {...score} total={lessonDocument.quizCount} />,
            slots.banner,
          )
        : null}
      {slots.evalBars.map(({ qNum, element }) =>
        createPortal(
          <QuizEvalBar
            qNum={qNum}
            status={questoes[`${lessonId}#${qNum}`]}
            onEvaluate={(result) => evaluateQuestion(lessonId, qNum, result)}
          />,
          element,
          `quiz-${qNum}`,
        ),
      )}
    </>
  );
};

export default LessonArticle;
