import { Link } from 'react-router-dom';

import { GUIDE_FILE, ROUTES } from '@/constants/navigation';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useLessonDocument } from '@/hooks/useLessonDocument';
import LessonArticle from '@/modules/study/components/LessonArticle/LessonArticle';
import LessonSkeleton from '@/modules/study/components/LessonSkeleton/LessonSkeleton';
import LessonToc from '@/modules/study/components/LessonToc/LessonToc';

const GuideScreen = () => {
  useDocumentTitle('Guia Diretor PCCE · Estratégia, Ciclos e Edital');
  const guideDocument = useLessonDocument(GUIDE_FILE);

  if (!guideDocument) return <LessonSkeleton />;

  return (
    <div className="lesson-workspace">
      <div className="lesson-primary-col">
        <div className="lesson-topbar">
          <nav className="breadcrumbs" aria-label="Trilha de navegação">
            <Link to={ROUTES.dashboard}>Painel</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Guia Completo PCCE</span>
          </nav>
          <Link to={ROUTES.dashboard} className="btn sm">
            ← Painel
          </Link>
        </div>
        <article className="lesson-article">
          <LessonArticle document={guideDocument} lessonId="guia" bodyId="guide-body" />
        </article>
      </div>
      <aside className="lesson-toc-aside" aria-label="Sumário do guia">
        <div className="toc-card">
          <h2 className="toc-title">Capítulos do Guia</h2>
          <LessonToc items={guideDocument.toc} />
        </div>
      </aside>
    </div>
  );
};

export default GuideScreen;
