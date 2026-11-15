import { CSSProperties, useState } from 'react';

import { Link } from 'react-router-dom';

import { EDITAL_BLOCK_TABS } from '@/constants/moduleMeta';
import { ROUTES } from '@/constants/navigation';
import { REVISION_CHIPS } from '@/constants/revisionCycles';
import { useStudy } from '@/contexts/StudyContext';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import BlockTabs from '@/modules/study/components/BlockTabs/BlockTabs';
import SectionBar from '@/modules/study/components/SectionBar/SectionBar';
import { catalog } from '@/service/catalogService';
import { BlockFilter } from '@/types/study';
import { moduleProgress } from '@/utils/studyMetrics';

const doneDotStyle = (isDone: boolean): CSSProperties => ({
  background: isDone ? 'var(--ok)' : 'transparent',
  borderColor: isDone ? 'var(--ok)' : 'var(--border)',
  color: isDone ? '#fff' : 'transparent',
});

const EditalScreen = () => {
  useDocumentTitle('Edital Verticalizado PCCE · Controle de Tópicos e Revisões');
  const [blockFilter, setBlockFilter] = useState<BlockFilter>('all');
  const [search, setSearch] = useState('');
  const { feitas, revisoes, notas, toggleCompleted, toggleRevision } = useStudy();
  const query = search.toLowerCase();

  const filteredModules = catalog.modulos.filter((modulo) => {
    if (blockFilter !== 'all' && modulo.meta.block !== blockFilter) return false;
    if (!query) return true;
    return (
      modulo.titulo.toLowerCase().includes(query) ||
      modulo.aulas.some((aula) => aula.titulo.toLowerCase().includes(query))
    );
  });

  return (
    <div className="page-container">
      <SectionBar
        className="mt-0"
        kicker="MATRIZ PROGRAMÁTICA"
        title="Edital Verticalizado e Ciclos de Revisão (R1 · R2 · R3)"
      >
        <input
          type="search"
          id="edital-search-input"
          className="sidebar-filter-input h-[34px] max-w-[260px]"
          placeholder="Filtrar matéria ou tópico..."
          aria-label="Filtrar matéria ou tópico"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </SectionBar>

      <BlockTabs
        tabs={EDITAL_BLOCK_TABS}
        value={blockFilter}
        onChange={setBlockFilter}
        label="Filtrar edital por bloco"
      />

      <div>
        {filteredModules.map((modulo) => {
          const progress = moduleProgress(modulo, feitas);
          const lessons = modulo.aulas.filter(
            (aula) =>
              !query ||
              aula.titulo.toLowerCase().includes(query) ||
              modulo.titulo.toLowerCase().includes(query),
          );
          return (
            <section key={modulo.id} className="edital-module-block">
              <div className="edital-mod-top">
                <div className="flex flex-wrap items-baseline gap-2.5">
                  <span className="module-index">MÓD. {modulo.id}</span>
                  <strong className="text-base">{modulo.titulo}</strong>
                  <span className="module-weight-tag">{modulo.meta.weight}</span>
                </div>
                <div className="font-mono text-[0.74rem] tabular-nums">
                  {progress.done}/{progress.total} ({progress.pct}%)
                </div>
              </div>
              <div>
                {lessons.map((aula) => {
                  const isDone = !!feitas[aula.id];
                  const revision = revisoes[aula.id] ?? {};
                  return (
                    <div key={aula.id} className="edital-lesson-row">
                      <div className="flex min-w-0 flex-1 items-center gap-2.5">
                        <button
                          type="button"
                          className="lesson-status-dot cursor-pointer"
                          style={doneDotStyle(isDone)}
                          onClick={() => toggleCompleted(aula.id)}
                          aria-label={
                            isDone ? 'Desmarcar aula' : 'Marcar aula como concluída'
                          }
                        >
                          ✓
                        </button>
                        <Link
                          to={ROUTES.lesson(aula.id)}
                          className={`no-underline ${isDone ? 'font-semibold' : 'font-normal'}`}
                        >
                          <span className="mr-1.5 font-mono text-[0.74rem] text-ink-muted">
                            {aula.id}
                          </span>
                          {aula.titulo}
                        </Link>
                        {notas[aula.id]?.trim() ? (
                          <span className="font-mono text-[0.64rem] text-ink-muted">
                            [NOTA]
                          </span>
                        ) : null}
                      </div>
                      <div
                        className="rev-chips-group"
                        role="group"
                        aria-label="Ciclos de revisão"
                      >
                        {REVISION_CHIPS.map((chip) => (
                          <button
                            key={chip.key}
                            type="button"
                            className={`rev-chip-btn ${revision[chip.key] ? 'done' : ''}`}
                            aria-pressed={!!revision[chip.key]}
                            onClick={() => toggleRevision(aula.id, chip.key)}
                          >
                            {chip.label} {revision[chip.key] ? '✓' : ''}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default EditalScreen;
