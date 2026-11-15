import { useEffect, useRef } from 'react';

import { Link, useLocation } from 'react-router-dom';

import { ROUTES } from '@/constants/navigation';
import { useStudy } from '@/contexts/StudyContext';
import {
  filterModuleLessons,
  SidebarChip,
} from '@/modules/study/components/Sidebar/sidebarFilter';
import { catalog } from '@/service/catalogService';
import { moduleProgress } from '@/utils/studyMetrics';

interface SidebarTreeProps {
  query: string;
  chip: SidebarChip;
}

const LESSON_PATH = /^\/aula\/(.+)$/;

const SidebarTree = ({ query, chip }: SidebarTreeProps) => {
  const treeRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  const { feitas, favoritos, notas, abertos, toggleModule } = useStudy();
  const activeLessonId = pathname.match(LESSON_PATH)?.[1];
  const isFiltering = query.trim().length > 0 || chip !== 'all';

  useEffect(() => {
    treeRef.current
      ?.querySelector('.lesson-link.active')
      ?.scrollIntoView?.({ block: 'nearest' });
  }, [activeLessonId]);

  const groups = catalog.modulos
    .map((modulo) => ({
      modulo,
      lessons: filterModuleLessons(modulo, { query, chip, feitas, favoritos }),
    }))
    .filter((group) => !isFiltering || group.lessons.length > 0);

  return (
    <nav
      ref={treeRef}
      id="tree"
      className="sidebar-tree"
      aria-label="Índice de módulos e aulas"
    >
      {groups.length === 0 ? (
        <div className="px-4 py-6 text-center text-[0.78rem] text-ink-muted">
          Nenhum registro para este filtro.
        </div>
      ) : (
        groups.map(({ modulo, lessons }) => {
          const progress = moduleProgress(modulo, feitas);
          const isOpen = isFiltering || !!abertos[modulo.id];
          return (
            <div key={modulo.id} className={`mod-group ${isOpen ? 'open' : ''}`}>
              <button
                type="button"
                className="mod-header-btn"
                onClick={() => toggleModule(modulo.id)}
                aria-expanded={isOpen}
              >
                <span className="mod-badge">{modulo.id}</span>
                <span className="mod-info">
                  <span className="mod-title-row">
                    <span className="mod-name">{modulo.titulo}</span>
                    <span className="mod-count">
                      {progress.done}/{progress.total}
                    </span>
                  </span>
                  <span className="mod-mini-bar">
                    <span style={{ width: `${progress.pct}%` }} />
                  </span>
                </span>
                <span className="mod-chevron" aria-hidden="true">
                  ›
                </span>
              </button>
              <ul className="mod-lessons">
                {lessons.map((aula) => {
                  const isDone = !!feitas[aula.id];
                  const isActive = aula.id === activeLessonId;
                  return (
                    <li key={aula.id}>
                      <Link
                        to={ROUTES.lesson(aula.id)}
                        className={`lesson-link ${isDone ? 'ok' : ''} ${isActive ? 'active' : ''}`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <span className="lesson-status-dot" aria-hidden="true">
                          {isDone ? '✓' : ''}
                        </span>
                        <span className="lesson-title-text">{aula.titulo}</span>
                        <span className="lesson-meta-icons">
                          {favoritos[aula.id] ? <span title="Marcada">★</span> : null}
                          {notas[aula.id]?.trim() ? (
                            <span title="Anotação salva">N</span>
                          ) : null}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })
      )}
    </nav>
  );
};

export default SidebarTree;
