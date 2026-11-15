import { REVISION_CYCLES } from '@/constants/revisionCycles';
import {
  CompletedMap,
  Lesson,
  QuestionMap,
  RevisionEntry,
  RevisionMap,
  StreakSummary,
  StudyDaysMap,
  StudyModule,
} from '@/types/study';
import { addDaysIso, todayIso } from '@/utils/dateUtils';

export const percentOf = (done: number, total: number) =>
  total ? Math.round((done * 100) / total) : 0;

export const readyLessons = (modulo: StudyModule) =>
  modulo.aulas.filter((aula) => aula.arquivo);

export const moduleProgress = (modulo: StudyModule, feitas: CompletedMap) => {
  const prontas = readyLessons(modulo);
  const done = prontas.filter((aula) => feitas[aula.id]).length;
  return { done, total: prontas.length, pct: percentOf(done, prontas.length) };
};

export const overallProgress = (lista: Lesson[], feitas: CompletedMap) => {
  const prontas = lista.filter((aula) => aula.arquivo);
  const done = prontas.filter((aula) => feitas[aula.id]).length;
  return { done, total: prontas.length, pct: percentOf(done, prontas.length) };
};

export const mergeStudyDaysFromCompleted = (feitas: CompletedMap, dias: StudyDaysMap) => {
  const merged = { ...dias };
  Object.values(feitas).forEach((value) => {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      merged[value.slice(0, 10)] = true;
    }
  });
  return merged;
};

export const calculateStreak = (
  dias: StudyDaysMap,
  today = todayIso(),
): StreakSummary => {
  let streak = 0;
  let cursor = dias[today] ? today : addDaysIso(today, -1);
  while (dias[cursor]) {
    streak++;
    cursor = addDaysIso(cursor, -1);
  }
  const last28 = Array.from({ length: 28 }, (_, index) => {
    const date = addDaysIso(today, index - 27);
    return { date, active: !!dias[date], isToday: date === today };
  });
  return { streak, totalDays: Object.keys(dias).length, last28 };
};

export const getSpacedRevisions = (
  lista: Lesson[],
  feitas: CompletedMap,
  revisoes: RevisionMap,
  today = todayIso(),
) => {
  const due: RevisionEntry[] = [];
  const upcoming: RevisionEntry[] = [];

  lista.forEach((aula) => {
    const completedDate = feitas[aula.id];
    if (!completedDate) return;
    const record = revisoes[aula.id] ?? {};
    const pendingCycle = REVISION_CYCLES.find((cycle) => !record[cycle.key]);
    if (!pendingCycle) return;
    const entry: RevisionEntry = {
      aula,
      cycleKey: pendingCycle.key,
      cycleLabel: pendingCycle.label,
      targetDate: addDaysIso(completedDate.slice(0, 10), pendingCycle.days),
      completedDate: completedDate.slice(0, 10),
    };
    (entry.targetDate <= today ? due : upcoming).push(entry);
  });

  const byDate = (a: RevisionEntry, b: RevisionEntry) =>
    a.targetDate.localeCompare(b.targetDate);
  return { due: due.sort(byDate), upcoming: upcoming.sort(byDate) };
};

export const getMissedQuestions = (lista: Lesson[], questoes: QuestionMap) =>
  Object.entries(questoes)
    .filter(([, status]) => status === 'miss')
    .flatMap(([key]) => {
      const [lessonId, qNum] = key.split('#');
      const aula = lista.find((item) => item.id === lessonId);
      return aula ? [{ aula, qNum: Number(qNum) }] : [];
    });

export const quizScore = (
  lessonId: string,
  totalQuestions: number,
  questoes: QuestionMap,
) => {
  let hits = 0;
  let misses = 0;
  for (let index = 1; index <= totalQuestions; index++) {
    const status = questoes[`${lessonId}#${index}`];
    if (status === 'hit') hits++;
    else if (status === 'miss') misses++;
  }
  const answered = hits + misses;
  return { hits, misses, answered, pct: percentOf(hits, answered) };
};
