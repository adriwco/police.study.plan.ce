import { useState } from 'react';

import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/navigation';
import { useStudy } from '@/contexts/StudyContext';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useExportNotebook } from '@/hooks/useExportNotebook';
import SectionBar from '@/modules/study/components/SectionBar/SectionBar';

const NotebookScreen = () => {
  useDocumentTitle('Caderno de Anotações · Curso PCCE');
  const [search, setSearch] = useState('');
  const { notesList } = useStudy();
  const exportNotebook = useExportNotebook();
  const query = search.toLowerCase();

  const filtered = notesList.filter(
    (entry) =>
      !query ||
      entry.aula.titulo.toLowerCase().includes(query) ||
      entry.aula.modulo.titulo.toLowerCase().includes(query) ||
      entry.text.toLowerCase().includes(query),
  );

  return (
    <div className="page-container">
      <SectionBar
        className="mt-0"
        kicker="REPOSITÓRIO PESSOAL"
        title={`Caderno de Anotações (${notesList.length})`}
      >
        <div className="flex flex-wrap gap-2">
          <input
            type="search"
            id="caderno-search-input"
            className="sidebar-filter-input h-[34px] w-60"
            placeholder="Pesquisar nas notas..."
            aria-label="Pesquisar nas notas"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button type="button" className="btn sm primary" onClick={exportNotebook}>
            Exportar Caderno (.md)
          </button>
        </div>
      </SectionBar>

      {filtered.length ? (
        <div className="grid gap-4">
          {filtered.map((entry) => (
            <article key={entry.aula.id} className="notepad-card mt-0">
              <div className="notepad-header">
                <div>
                  <span className="section-kicker">
                    MÓDULO {entry.aula.modulo.id} · {entry.aula.modulo.titulo}
                  </span>
                  <h2 className="mb-0 mt-0.5 text-[1.05rem]">
                    <Link to={ROUTES.lesson(entry.aula.id)} className="no-underline">
                      {entry.aula.id} — {entry.aula.titulo}
                    </Link>
                  </h2>
                </div>
                <Link to={ROUTES.lesson(entry.aula.id)} className="btn sm">
                  Abrir aula →
                </Link>
              </div>
              <pre className="m-0 whitespace-pre-wrap border border-solid border-line bg-paper-subtle p-3.5 font-sans text-[0.9rem]">
                {entry.text}
              </pre>
            </article>
          ))}
        </div>
      ) : (
        <div className="lesson-article px-5 py-12 text-center">
          <h2 className="!mt-0 justify-center !border-0">Nenhuma anotação registrada</h2>
          <p className="text-ink-muted">
            As anotações escritas no final de cada aula são indexadas automaticamente
            aqui.
          </p>
        </div>
      )}
    </div>
  );
};

export default NotebookScreen;
