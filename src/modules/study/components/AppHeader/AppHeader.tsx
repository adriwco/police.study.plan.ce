import { useRef } from 'react';

import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/navigation';
import { useOverlay } from '@/contexts/OverlayContext';
import { usePomodoro } from '@/contexts/PomodoroContext';
import { usePreferences } from '@/contexts/PreferencesContext';
import { useStudy } from '@/contexts/StudyContext';
import ProgressTrack from '@/modules/study/components/ProgressTrack/ProgressTrack';
import { catalog } from '@/service/catalogService';
import { formatSeconds } from '@/utils/dateUtils';
import { calculateStreak, overallProgress } from '@/utils/studyMetrics';

const AppHeader = () => {
  const themeButtonRef = useRef<HTMLButtonElement>(null);
  const {
    menuOpen,
    toggleMenu,
    focusMode,
    toggleFocusMode,
    cycleFontScale,
    theme,
    toggleTheme,
    cinemaMode,
    toggleCinema,
    soundOn,
    toggleSound,
  } = usePreferences();
  const { open } = useOverlay();
  const { feitas, dias } = useStudy();
  const pomodoro = usePomodoro();

  const progress = overallProgress(catalog.lista, feitas);
  const { streak } = calculateStreak(dias);
  const isDark = theme === 'dark';
  const timeLabel = formatSeconds(pomodoro.secondsLeft);

  return (
    <header className="app-header">
      <div className="brand-group">
        <button
          type="button"
          id="menu-btn"
          className="icon-btn"
          onClick={toggleMenu}
          aria-label="Abrir navegação lateral"
          aria-expanded={menuOpen}
          aria-controls="side"
        >
          <svg className="svg-ic" viewBox="0 0 24 24" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <Link
          to={ROUTES.dashboard}
          className="brand-link"
          aria-label="Ir para o painel inicial"
        >
          <span className="brand-mark" aria-hidden="true">
            PC
          </span>
          <div className="brand-titles">
            <span className="brand-title">PCCE.ESTUDO</span>
            <span className="brand-subtitle">
              CEV/UECE · {catalog.lista.length} Aulas
            </span>
          </div>
        </Link>
      </div>

      <button
        type="button"
        className="search-trigger"
        onClick={() => open('command')}
        aria-label="Abrir busca global (Control K)"
      >
        <span className="search-trigger-left">
          <svg className="svg-ic" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span>Buscar aula, lei ou nota...</span>
        </span>
        <kbd className="search-kbd">Ctrl+K</kbd>
      </button>

      <div className="header-right">
        <button
          type="button"
          id="header-pomo-btn"
          className={`header-pomo-pill ${pomodoro.running ? 'running' : ''}`}
          onClick={pomodoro.toggle}
          title="Iniciar ou pausar sessão"
          aria-label={`Cronômetro ${timeLabel} (${pomodoro.running ? 'ativo' : 'pausado'})`}
        >
          <span className="pomo-dot" aria-hidden="true" />
          <span id="header-pomo-time">{timeLabel}</span>
        </button>

        <div
          id="header-streak"
          className={`header-streak-badge ${streak > 0 ? 'active' : ''}`}
          title="Constância de estudo"
        >
          <span>RITMO</span>
          <b>{streak}d</b>
        </div>

        <div
          id="g-progress-wrap"
          className="header-progress"
          role="progressbar"
          aria-label="Progresso geral do curso"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress.pct}
        >
          <div className="header-progress-top">
            <span id="g-text">
              {progress.done}/{progress.total}
            </span>
            <span id="g-pct">{progress.pct}%</span>
          </div>
          <ProgressTrack pct={progress.pct} fillId="g-bar" />
        </div>

        <button
          type="button"
          id="focus-btn"
          className={`icon-btn ${focusMode ? 'active' : ''}`}
          onClick={toggleFocusMode}
          aria-pressed={focusMode}
          title="Modo foco de leitura (tecla F)"
        >
          <span>Foco</span>
        </button>

        <button
          type="button"
          id="cinema-btn"
          className={`icon-btn ${cinemaMode ? 'active' : ''}`}
          onClick={toggleCinema}
          aria-pressed={cinemaMode}
          title="Rolagem suave, cenas na rolagem e luz animada"
        >
          <span>Cinema</span>
        </button>

        {cinemaMode ? (
          <button
            type="button"
            id="sound-btn"
            className={`icon-btn ${soundOn ? 'active' : ''}`}
            onClick={toggleSound}
            aria-pressed={soundOn}
            aria-label={
              soundOn ? 'Desligar som cinematográfico' : 'Ligar som cinematográfico'
            }
            title="Som cinematográfico"
          >
            <span aria-hidden="true">Som</span>
          </button>
        ) : null}

        <button
          type="button"
          id="font-btn"
          className="icon-btn"
          onClick={cycleFontScale}
          aria-label="Ajustar tamanho da fonte"
          title="Escala tipográfica"
        >
          <span>Aa</span>
        </button>

        <button
          ref={themeButtonRef}
          type="button"
          id="theme-btn"
          className="icon-btn"
          onClick={() => toggleTheme(themeButtonRef.current)}
          aria-label={isDark ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
        >
          {isDark ? 'Luz' : 'Escuro'}
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
