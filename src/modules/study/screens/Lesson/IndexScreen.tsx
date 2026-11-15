import { useEffect } from 'react';

import { Link, Navigate, useParams } from 'react-router-dom';

import { ROUTES } from '@/constants/navigation';
import { useStudy } from '@/contexts/StudyContext';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useLessonDocument } from '@/hooks/useLessonDocument';
import LessonArticle from '@/modules/study/components/LessonArticle/LessonArticle';
import LessonNotepad from '@/modules/study/components/LessonNotepad/LessonNotepad';
import LessonPager from '@/modules/study/components/LessonPager/LessonPager';
import LessonSkeleton from '@/modules/study/components/LessonSkeleton/LessonSkeleton';
import LessonToc from '@/modules/study/components/LessonToc/LessonToc';
import { findLesson, findNeighbourLessons } from '@/service/catalogService';
import { prefetchDocument } from '@/service/markdownService';
import { Lesson } from '@/types/study';
import { formatBrDate, padIndex } from '@/utils/dateUtils';

const LessonView = ({ lesson }: { lesson: Lesson }) => {
  const { modulo } = lesson;
  const lessonDocument = useLessonDocument(lesson.arquivo);
  const { feitas, favoritos, toggleCompleted, toggleFavorite, visitLesson } = useStudy();
  const { previous, next } = findNeighbourLessons(lesson.id);
  const isDone = !!feitas[lesson.id];
  const isFavorite = !!favoritos[lesson.id];

  useDocumentTitle(
    `${lesson.id} ${lesson.titulo} · Mód. ${modulo.id} (${modulo.titulo})`,
  );

  useEffect(() => {
    visitLesson(lesson);
  }, [lesson, visitLesson]);

  useEffect(() => {
    prefetchDocument(next?.arquivo);
  }, [next]);

  if (!lessonDocument) return <LessonSkeleton />;

  return (
    <div className="lesson-workspace">
      <div className="lesson-primary-col">
        <div className="lesson-topbar">
          <nav className="breadcrumbs" aria-label="Trilha de navegação">
            <Link to={ROUTES.dashboard}>Painel</Link>
            <span aria-hidden="true">/</span>
            <Link to={ROUTES.edital}>
              Mód. {modulo.id} · {modulo.titulo}
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">
              Aula {padIndex(lesson.ordemNoModulo)} de {padIndex(modulo.aulas.length)}
            </span>
          </nav>
          <div className="lesson-quick-tools">
            <button
              type="button"
              id="fav-btn"
              className={`icon-btn ${isFavorite ? 'active' : ''}`}
              onClick={() => toggleFavorite(lesson.id)}
              aria-pressed={isFavorite}
            >
              <span>{isFavorite ? '★ Marcada' : '☆ Marcar'}</span>
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={() =>
                document
                  .getElementById('lesson-notepad')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              <span>Caderno</span>
            </button>
            <button
              type="button"
              id="top-done-btn"
              className={`btn sm ${isDone ? 'done' : 'primary'}`}
              onClick={() => toggleCompleted(lesson.id)}
            >
              {isDone ? '✓ Concluída' : 'Concluir aula'}
            </button>
          </div>
        </div>

        <article id="lesson-article" className="lesson-article">
          <div id="lesson-meta-strip" className="lesson-meta-strip">
            <span className="meta-pill">
              MÓDULO {modulo.id} · {modulo.titulo}
            </span>
            <span className="meta-pill">{modulo.meta.weight}</span>
            {isDone ? (
              <span className="meta-pill text-ok">
                CONCLUÍDA EM {formatBrDate(feitas[lesson.id])}
              </span>
            ) : null}
            {lessonDocument.metaPills.map((pill) => (
              <span key={pill} className="meta-pill">
                {pill}
              </span>
            ))}
          </div>
          <LessonArticle
            document={lessonDocument}
            lessonId={lesson.id}
            bodyId="lesson-body-content"
          />
        </article>

        <section className="lesson-completion-card" aria-label="Registro de conclusão">
          <div>
            <b className="block text-[0.94rem]">
              Critério de domínio: explicar em voz alta sem consultar o texto
            </b>
            <span className="text-[0.8rem] text-ink-secondary">
              Ao marcar como concluída, a aula entra na fila de revisão de 24h, 7 dias e
              30 dias.
            </span>
          </div>
          <button
            type="button"
            id="done-btn"
            className={`btn ${isDone ? 'done' : 'primary'}`}
            onClick={() => toggleCompleted(lesson.id)}
          >
            {isDone ? '✓ Aula concluída (desmarcar)' : 'Marcar aula como concluída'}
          </button>
        </section>

        <LessonNotepad lesson={lesson} />

        <LessonPager previous={previous} next={next} />
      </div>

      <aside className="lesson-toc-aside" aria-label="Sumário da aula">
        <div className="toc-card">
          <h2 className="toc-title">Sumário da Aula</h2>
          <LessonToc items={lessonDocument.toc} />
        </div>
        <div className="toc-card">
          <h2 className="toc-title">Navegação</h2>
          <div className="grid gap-1.5 font-mono text-[0.7rem] text-ink-secondary">
            <div>
              <kbd className="search-kbd">Ctrl+K</kbd> Busca global
            </div>
            <div>
              <kbd className="search-kbd">F</kbd> Modo foco
            </div>
            <div>
              <Link to={ROUTES.edital}>Edital verticalizado →</Link>
            </div>
            <div>
              <Link to={ROUTES.revisions}>Fila de revisões →</Link>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

const LessonScreen = () => {
  const { lessonId = '' } = useParams();
  const lesson = findLesson(lessonId);
  if (!lesson) return <Navigate to={ROUTES.dashboard} replace />;
  return <LessonView key={lesson.id} lesson={lesson} />;
};

export default LessonScreen;
