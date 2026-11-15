import {
  KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useOverlay } from '@/contexts/OverlayContext';
import { usePreferences } from '@/contexts/PreferencesContext';
import { useStudy } from '@/contexts/StudyContext';
import { useCinematicNavigate } from '@/hooks/useCinematicNavigate';
import {
  buildCommandItems,
  CommandItem,
} from '@/modules/study/components/CommandPalette/commandItems';
import { catalog } from '@/service/catalogService';

const CommandPalette = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const { active, open, close } = useOverlay();
  const { toggleTheme, toggleCinema, toggleSound } = usePreferences();
  const { feitas, notas } = useStudy();
  const go = useCinematicNavigate();
  const isOpen = active === 'command';

  const items = useMemo(
    () =>
      buildCommandItems({
        query,
        lista: catalog.lista,
        feitas,
        notas,
        toggleTheme: () => toggleTheme(),
        openBackup: () => open('backup'),
        toggleCinema,
        toggleSound,
      }),
    [feitas, notas, open, query, toggleCinema, toggleSound, toggleTheme],
  );

  useEffect(() => {
    if (!isOpen) return undefined;
    setQuery('');
    setSelected(0);
    const timerId = setTimeout(() => inputRef.current?.focus(), 10);
    return () => clearTimeout(timerId);
  }, [isOpen]);

  useEffect(() => {
    resultsRef.current
      ?.querySelector('.cmd-item.selected')
      ?.scrollIntoView?.({ block: 'nearest' });
  }, [selected]);

  const execute = (item: CommandItem) => {
    close();
    if (item.run) item.run();
    else if (item.path) go(item.path);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' && items.length) {
      event.preventDefault();
      setSelected((index) => (index + 1) % items.length);
    } else if (event.key === 'ArrowUp' && items.length) {
      event.preventDefault();
      setSelected((index) => (index - 1 + items.length) % items.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (items[selected]) execute(items[selected]);
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <div
      id="cmd-modal"
      className={`modal-backdrop ${isOpen ? 'open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cmd-dialog-title"
      aria-hidden={!isOpen}
      data-lenis-prevent=""
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="cmd-dialog">
        <div className="cmd-input-row">
          <svg className="svg-ic" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <label id="cmd-dialog-title" htmlFor="cmd-input" className="sr-only">
            Pesquisar aulas, módulos e notas
          </label>
          <input
            ref={inputRef}
            type="search"
            id="cmd-input"
            className="cmd-input"
            placeholder="Buscar por aula, disciplina, artigo ou anotação..."
            autoComplete="off"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelected(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <button type="button" className="btn sm" onClick={close}>
            ESC
          </button>
        </div>
        <div
          ref={resultsRef}
          id="cmd-results"
          className="cmd-results"
          role="listbox"
          aria-label="Resultados da pesquisa"
        >
          {items.length === 0 ? (
            <div className="p-5 text-center text-[0.82rem] text-ink-muted">
              Sem resultados para &quot;{query}&quot;.
            </div>
          ) : (
            items.map((item, index) => (
              <a
                key={item.key}
                href={item.path ? `#${item.path}` : '#'}
                data-native-link=""
                role="option"
                aria-selected={index === selected}
                className={`cmd-item ${index === selected ? 'selected' : ''}`}
                onClick={(event) => {
                  event.preventDefault();
                  execute(item);
                }}
              >
                <div>
                  <strong>{item.title}</strong>
                  <span className="cmd-item-sub">{item.sub}</span>
                </div>
                <span className="search-kbd">↵</span>
              </a>
            ))
          )}
        </div>
        <div className="cmd-foot">
          <span>SETAS ↑↓ PARA NAVEGAR · ENTER PARA ABRIR</span>
          <span>{catalog.lista.length} AULAS INDEXADAS</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
