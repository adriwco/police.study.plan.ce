import { QuestionResult } from '@/types/study';
import { padIndex } from '@/utils/dateUtils';

interface QuizEvalBarProps {
  qNum: number;
  status?: QuestionResult;
  onEvaluate: (result: QuestionResult) => void;
}

export const QuizEvalBar = ({ qNum, status, onEvaluate }: QuizEvalBarProps) => (
  <>
    <span>QUESTÃO {padIndex(qNum)} — AUTOAVALIAÇÃO</span>
    <div className="quiz-eval-btns">
      <button
        type="button"
        className={`quiz-eval-btn hit ${status === 'hit' ? 'active' : ''}`}
        aria-pressed={status === 'hit'}
        onClick={() => onEvaluate('hit')}
      >
        Acertei
      </button>
      <button
        type="button"
        className={`quiz-eval-btn miss ${status === 'miss' ? 'active' : ''}`}
        aria-pressed={status === 'miss'}
        onClick={() => onEvaluate('miss')}
      >
        Revisar depois
      </button>
    </div>
  </>
);

interface QuizScoreBannerProps {
  hits: number;
  misses: number;
  answered: number;
  pct: number;
  total: number;
}

export const QuizScoreBanner = ({
  hits,
  misses,
  answered,
  pct,
  total,
}: QuizScoreBannerProps) => (
  <>
    <span>
      CADERNO DE QUESTÕES · <b>{hits} ACERTOS</b> / <b>{misses} REVISAR</b> (TOTAL:{' '}
      {total})
    </span>
    <span>
      {answered ? `${pct}% DE APROVEITAMENTO` : 'RESPONDA ANTES DE REVELAR O GABARITO'}
    </span>
  </>
);
