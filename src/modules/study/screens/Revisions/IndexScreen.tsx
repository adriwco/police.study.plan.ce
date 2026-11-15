import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/navigation';
import { useStudy } from '@/contexts/StudyContext';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import RevisionItem from '@/modules/study/components/RevisionItem/RevisionItem';
import SectionBar from '@/modules/study/components/SectionBar/SectionBar';
import RevisionPanel from '@/modules/study/screens/Revisions/RevisionPanel';
import { catalog } from '@/service/catalogService';
import { RevisionEntry } from '@/types/study';
import { formatBrDate, padIndex } from '@/utils/dateUtils';
import { getMissedQuestions, getSpacedRevisions } from '@/utils/studyMetrics';

const MAX_UPCOMING = 8;
const PANEL_GRID = 'modules-swiss-grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))]';

const RevisionsScreen = () => {
  useDocumentTitle('Fila de Retenção e Revisões Espaçadas · PCCE');
  const { feitas, revisoes, favoritos, questoes, toggleRevision } = useStudy();
  const { lista } = catalog;
  const { due, upcoming } = getSpacedRevisions(lista, feitas, revisoes);
  const favoriteLessons = lista.filter((aula) => favoritos[aula.id]);
  const missedQuestions = getMissedQuestions(lista, questoes);

  const renderRevision = (
    item: RevisionEntry,
    label: string,
    actionLabel: string,
    primary: boolean,
  ) => (
    <RevisionItem
      key={`${item.aula.id}-${item.cycleKey}`}
      to={ROUTES.lesson(item.aula.id)}
      title={`${item.aula.id} · ${item.aula.titulo}`}
      action={
        <button
          type="button"
          className={`btn sm ${primary ? 'primary' : ''}`}
          onClick={() => toggleRevision(item.aula.id, item.cycleKey)}
        >
          {actionLabel}
        </button>
      }
    >
      <span className="rev-cycle-tag">CICLO {item.cycleLabel}</span>
      <span>
        {label}: {formatBrDate(item.targetDate)}
      </span>
    </RevisionItem>
  );

  return (
    <div className="page-container">
      <SectionBar
        className="mt-0"
        kicker="REPETIÇÃO ESPAÇADA · CURVA DE RETENÇÃO"
        title="Agenda de Revisões (24h · 7d · 30d) e Caderno de Erros"
      >
        <Link to={ROUTES.edital} className="btn sm">
          Abrir matriz do edital →
        </Link>
      </SectionBar>

      <div className={`${PANEL_GRID} mb-6`}>
        <RevisionPanel
          index="01 / PENDENTES HOJE"
          tag={`${due.length} ITENS`}
          emptyMessage="Nenhuma revisão pendente para hoje."
        >
          {due.map((item) => renderRevision(item, 'VENCIMENTO', 'Concluir', true))}
        </RevisionPanel>
        <RevisionPanel
          index="02 / PRÓXIMOS AGENDAMENTOS"
          tag={`${upcoming.length} ITENS`}
          emptyMessage="Ao concluir aulas, os ciclos de 24h, 7d e 30d são programados automaticamente."
        >
          {upcoming
            .slice(0, MAX_UPCOMING)
            .map((item) => renderRevision(item, 'DATA', 'Antecipar', false))}
        </RevisionPanel>
      </div>

      <div className={PANEL_GRID}>
        <RevisionPanel
          index="03 / CADERNO DE ERROS (QUESTÕES)"
          tag={`${missedQuestions.length} QUESTÕES`}
          emptyMessage='Questões marcadas como "Revisar depois" durante as aulas são listadas aqui.'
        >
          {missedQuestions.map((item) => (
            <RevisionItem
              key={`${item.aula.id}-${item.qNum}`}
              to={ROUTES.lesson(item.aula.id)}
              title={`Questão ${padIndex(item.qNum)} · ${item.aula.titulo}`}
              action={
                <Link to={ROUTES.lesson(item.aula.id)} className="btn sm">
                  Refazer →
                </Link>
              }
            >
              <span>
                MÓD. {item.aula.modulo.id} · {item.aula.modulo.titulo}
              </span>
            </RevisionItem>
          ))}
        </RevisionPanel>
        <RevisionPanel
          index="04 / AULAS MARCADAS (★)"
          tag={`${favoriteLessons.length} AULAS`}
          emptyMessage='Use "☆ Marcar" no topo de uma aula para fixá-la neste quadro.'
        >
          {favoriteLessons.map((aula) => (
            <RevisionItem
              key={aula.id}
              to={ROUTES.lesson(aula.id)}
              title={`${aula.id} · ${aula.titulo}`}
              action={
                <Link to={ROUTES.lesson(aula.id)} className="btn sm">
                  Abrir →
                </Link>
              }
            >
              <span>
                MÓD. {aula.modulo.id} · {aula.modulo.titulo}
              </span>
            </RevisionItem>
          ))}
        </RevisionPanel>
      </div>
    </div>
  );
};

export default RevisionsScreen;
