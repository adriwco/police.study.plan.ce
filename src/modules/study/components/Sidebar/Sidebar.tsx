import { useState } from 'react';

import { NavLink } from 'react-router-dom';

import { ROUTES, SIDEBAR_SECTIONS } from '@/constants/navigation';
import { usePreferences } from '@/contexts/PreferencesContext';
import { useStudy } from '@/contexts/StudyContext';
import { SidebarChip } from '@/modules/study/components/Sidebar/sidebarFilter';
import SidebarTree from '@/modules/study/components/Sidebar/SidebarTree';
import { catalog } from '@/service/catalogService';
import { getSpacedRevisions } from '@/utils/studyMetrics';

const STATE_CHIPS: { id: SidebarChip; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'pending', label: 'Pendentes' },
  { id: 'done', label: 'Feitas' },
  { id: 'fav', label: '★' },
];

const Sidebar = () => {
  const [query, setQuery] = useState('');
  const [chip, setChip] = useState<SidebarChip>('all');
  const { menuOpen } = usePreferences();
  const { feitas, revisoes, notesList, setAllModulesOpen } = useStudy();
  const dueCount = getSpacedRevisions(catalog.lista, feitas, revisoes).due.length;

  const counters = {
    revisions: { value: dueCount, warn: dueCount > 0 },
    notes: { value: notesList.length, warn: false },
  };

  return (
    <aside
      id="side"
      className={`app-sidebar ${menuOpen ? 'show' : ''}`}
      aria-label="Navegação e trilha de estudos"
    >
      <nav className="sidebar-nav-section" aria-label="Seções principais">
        {SIDEBAR_SECTIONS.map((section) => {
          const counter = section.counter ? counters[section.counter] : null;
          return (
            <NavLink
              key={section.to}
              to={section.to}
              end={section.to === ROUTES.dashboard}
              className="sidebar-nav-link"
            >
              <span className="sidebar-nav-left">
                <span className="font-mono text-[0.68rem] opacity-60">
                  {section.index}
                </span>
                <span>{section.label}</span>
              </span>
              {counter ? (
                <span className={`nav-pill-count ${counter.warn ? 'warn' : ''}`}>
                  {counter.value}
                </span>
              ) : null}
            </NavLink>
          );
        })}
      </nav>

      <div
        className="sidebar-filter-box"
        role="search"
        aria-label="Filtrar trilha lateral"
      >
        <div className="sidebar-filter-input-wrap">
          <input
            type="search"
            id="sidebar-filter-input"
            className="sidebar-filter-input"
            placeholder="Filtrar módulo ou aula..."
            aria-label="Filtrar módulo ou aula"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button
            type="button"
            className={`sidebar-filter-clear ${query.trim() ? 'show' : ''}`}
            onClick={() => setQuery('')}
            aria-label="Limpar filtro"
          >
            ✕
          </button>
        </div>
        <div className="sidebar-chips" role="group" aria-label="Filtro por estado">
          {STATE_CHIPS.map((stateChip) => (
            <button
              key={stateChip.id}
              type="button"
              className={`filter-chip ${chip === stateChip.id ? 'active' : ''}`}
              aria-pressed={chip === stateChip.id}
              onClick={() => setChip(stateChip.id)}
            >
              {stateChip.label}
            </button>
          ))}
          <button
            type="button"
            className="filter-chip"
            onClick={() => setAllModulesOpen(true)}
            title="Expandir todos"
            aria-label="Expandir todos os módulos"
          >
            +
          </button>
          <button
            type="button"
            className="filter-chip"
            onClick={() => setAllModulesOpen(false)}
            title="Recolher todos"
            aria-label="Recolher todos os módulos"
          >
            −
          </button>
        </div>
      </div>

      <SidebarTree query={query} chip={chip} />
    </aside>
  );
};

export default Sidebar;
