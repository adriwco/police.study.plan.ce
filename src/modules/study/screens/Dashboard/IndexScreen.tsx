import { CSSProperties, useState } from 'react';

import { Link } from 'react-router-dom';

import { BLOCK_METRICS, HOME_BLOCK_TABS } from '@/constants/moduleMeta';
import { ROUTES } from '@/constants/navigation';
import { useOverlay } from '@/contexts/OverlayContext';
import { usePomodoro } from '@/contexts/PomodoroContext';
import { useStudy } from '@/contexts/StudyContext';
import { useDashboardIntro } from '@/hooks/useDashboardIntro';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import BlockTabs from '@/modules/study/components/BlockTabs/BlockTabs';
import ProgressTrack from '@/modules/study/components/ProgressTrack/ProgressTrack';
import RevealWords from '@/modules/study/components/RevealWords/RevealWords';
import RevisionItem from '@/modules/study/components/RevisionItem/RevisionItem';
import SectionBar from '@/modules/study/components/SectionBar/SectionBar';
import MetricNumber from '@/modules/study/screens/Dashboard/MetricNumber';
import { catalog } from '@/service/catalogService';
import { BlockFilter, PomodoroMode } from '@/types/study';
import { formatBrDate, formatSeconds } from '@/utils/dateUtils';
import {
  calculateStreak,
  getSpacedRevisions,
  moduleProgress,
  overallProgress,
  percentOf,
} from '@/utils/studyMetrics';

const POMODORO_MODES: { mode: PomodoroMode; label: string }[] = [
  { mode: '25', label: '25M' },
  { mode: '50', label: '50M' },
  { mode: '5', label: '05M' },
];

const DashboardScreen = () => {
  useDocumentTitle('PCCE · Plano de Estudos — Oficial Investigador');
  const [blockFilter, setBlockFilter] = useState<BlockFilter>('all');
  const playIntro = useDashboardIntro();
  const { feitas, dias, revisoes, ultimaAula, toggleRevision } = useStudy();
  const { open } = useOverlay();
  const pomodoro = usePomodoro();
  const { lista, modulos } = catalog;

  const progress = overallProgress(lista, feitas);
  const nextUnfinished =
    lista.find((aula) => aula.arquivo && !feitas[aula.id]) ?? lista[0];
  const resumeTarget =
    (ultimaAula && lista.find((aula) => aula.id === ultimaAula && !feitas[aula.id])) ||
    nextUnfinished;
  const { streak, totalDays, last28 } = calculateStreak(dias);
  const { due } = getSpacedRevisions(lista, feitas, revisoes);

  const blockMetrics = BLOCK_METRICS.map((block) => {
    const lessons = lista.filter(
      (aula) => aula.arquivo && aula.modulo.meta.block === block.id,
    );
    const done = lessons.filter((aula) => feitas[aula.id]).length;
    return { ...block, pct: percentOf(done, lessons.length) };
  });

  const filteredModules = modulos.filter(
    (modulo) => blockFilter === 'all' || modulo.meta.block === blockFilter,
  );

  return (
    <div className="page-container">
      <section
        className={`swiss-board ${playIntro ? 'cine-intro' : ''}`}
        aria-labelledby="hero-title"
      >
        <div className="swiss-hero-cell">
          <div>
            <div className="eyebrow-mono">
              POLÍCIA CIVIL DO CEARÁ · OFICIAL INVESTIGADOR · {lista.length} AULAS
            </div>
            <h1 id="hero-title" className="editorial-headline">
              <RevealWords text="Formação jurídica e exata" />{' '}
              <em>
                <RevealWords text="do zero absoluto." startIndex={4} />
              </em>
            </h1>
            <p className="editorial-lead">
              Estrutura progressiva de {modulos.length} módulos desenhada para quem nunca
              estudou Direito, Matemática ou Raciocínio Lógico. Cada tópico avança da
              intuição prática até a letra da lei e o padrão da banca CEV/UECE.
            </p>
          </div>
          <div className="resume-strip">
            <div>
              <span className="resume-meta-label">
                PRÓXIMA LEITURA · MÓDULO {resumeTarget?.modulo.id ?? '00'} (
                {resumeTarget?.modulo.meta.weight ?? ''})
              </span>
              <div className="resume-lesson-name">
                {resumeTarget
                  ? `${resumeTarget.id} — ${resumeTarget.titulo}`
                  : 'Curso concluído'}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {resumeTarget ? (
                <Link className="btn primary" to={ROUTES.lesson(resumeTarget.id)}>
                  Continuar leitura →
                </Link>
              ) : null}
              <Link className="btn" to={ROUTES.edital}>
                Edital verticalizado
              </Link>
            </div>
          </div>
        </div>

        <div className="swiss-metrics-grid" aria-label="Quadro de operação e progresso">
          <div className="metric-cell">
            <div className="metric-head">
              <span className="metric-label">01 / Cobertura</span>
              <span className="metric-tag">
                {progress.done} de {progress.total} aulas
              </span>
            </div>
            <div className="metric-big-num">
              <MetricNumber value={progress.pct} animate={playIntro} />%
            </div>
            <div className="blocks-compact">
              {blockMetrics.map((block) => (
                <div key={block.id} className="block-row-line">
                  <span className="block-row-name">{block.name}</span>
                  <ProgressTrack pct={block.pct} />
                  <span className="block-row-val">{block.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="metric-cell">
            <div className="metric-head">
              <span className="metric-label">02 / Constância</span>
              <span className="metric-tag">{totalDays}d registrados</span>
            </div>
            <div className="metric-big-num">
              <MetricNumber value={streak} animate={playIntro} />d{' '}
              <span className="text-[0.75rem] font-normal text-ink-muted">seguidos</span>
            </div>
            <div
              className="streak-matrix"
              title="Registro dos últimos 28 dias"
              role="img"
              aria-label="Matriz de constância dos últimos 28 dias"
            >
              {last28.map((day, index) => (
                <span
                  key={day.date}
                  style={{ '--i': index } as CSSProperties}
                  className={`streak-cell ${day.active ? 'on' : ''} ${day.isToday ? 'today' : ''}`}
                  title={`${formatBrDate(day.date)}${day.active ? ' · Ativo' : ''}`}
                />
              ))}
            </div>
          </div>

          <div className="metric-cell">
            <div className="metric-head">
              <span className="metric-label">03 / Sessão</span>
              <span className="metric-tag" id="bento-pomo-cycles">
                {pomodoro.cycles} ciclos hoje
              </span>
            </div>
            <div className="pomo-inline">
              <div id="bento-pomo-time" className="metric-big-num">
                {formatSeconds(pomodoro.secondsLeft)}
              </div>
              <div className="pomo-mode-row" role="group" aria-label="Duração da sessão">
                {POMODORO_MODES.map((option) => (
                  <button
                    key={option.mode}
                    type="button"
                    className={`pomo-chip ${pomodoro.mode === option.mode ? 'active' : ''}`}
                    aria-pressed={pomodoro.mode === option.mode}
                    onClick={() => pomodoro.setMode(option.mode)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                className="btn sm primary"
                id="bento-pomo-toggle"
                onClick={pomodoro.toggle}
              >
                {pomodoro.running ? 'Pausar' : 'Iniciar'}
              </button>
              <button type="button" className="btn sm" onClick={pomodoro.reset}>
                Zerar
              </button>
            </div>
          </div>

          <div className="metric-cell">
            <div className="metric-head">
              <span className="metric-label">04 / Retenção</span>
              <Link to={ROUTES.revisions} className="metric-tag">
                {due.length} pendentes →
              </Link>
            </div>
            <div>
              {due.length ? (
                due.slice(0, 2).map((item) => (
                  <RevisionItem
                    key={`${item.aula.id}-${item.cycleKey}`}
                    className="mb-1"
                    to={ROUTES.lesson(item.aula.id)}
                    title={`${item.aula.id} · ${item.aula.titulo}`}
                    action={
                      <button
                        type="button"
                        className="btn sm primary"
                        onClick={() => toggleRevision(item.aula.id, item.cycleKey)}
                      >
                        OK
                      </button>
                    }
                  >
                    <span className="rev-cycle-tag">CICLO {item.cycleLabel}</span>
                  </RevisionItem>
                ))
              ) : (
                <div className="text-[0.76rem] leading-[1.45] text-ink-muted">
                  Sem revisões vencidas hoje. Ciclos de 24h, 7d e 30d entram após cada
                  aula concluída.
                </div>
              )}
            </div>
            <div className="flex items-center justify-between gap-2">
              <button type="button" className="btn sm" onClick={() => open('backup')}>
                Backup JSON
              </button>
              <Link
                to={ROUTES.notebook}
                className="whitespace-nowrap font-mono text-[0.68rem]"
              >
                Caderno →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SectionBar
        kicker="ÍNDICE GERAL DO CURSO"
        title="Sequência de Módulos e Pesos do Edital"
        as="h2"
      >
        <BlockTabs
          tabs={HOME_BLOCK_TABS}
          value={blockFilter}
          onChange={setBlockFilter}
          label="Filtrar módulos por bloco"
          className="mb-0"
        />
      </SectionBar>

      <section className="modules-swiss-grid" aria-label="Módulos do curso">
        {filteredModules.map((modulo) => {
          const moduleStats = moduleProgress(modulo, feitas);
          const nextLesson =
            modulo.aulas.find((aula) => aula.arquivo && !feitas[aula.id]) ??
            modulo.aulas[0];
          return (
            <Link
              key={modulo.id}
              className="module-cell"
              to={ROUTES.lesson(nextLesson.id)}
            >
              <div>
                <div className="module-cell-top">
                  <span className="module-index">MÓD. {modulo.id}</span>
                  <span className="module-weight-tag">{modulo.meta.weight}</span>
                </div>
                <h3 className="module-cell-title">{modulo.titulo}</h3>
                <p className="module-cell-desc">{modulo.descricao}</p>
              </div>
              <div className="module-cell-foot">
                <div className="module-cell-stats">
                  <span>
                    {moduleStats.done}/{moduleStats.total} AULAS
                  </span>
                  <span>{moduleStats.pct}%</span>
                </div>
                <ProgressTrack pct={moduleStats.pct} accent={moduleStats.pct > 0} />
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
};

export default DashboardScreen;
