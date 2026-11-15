import { describe, expect, it } from 'vitest';

import { buildCatalog } from '@/service/catalogService';
import {
  calculateStreak,
  getMissedQuestions,
  getSpacedRevisions,
  mergeStudyDaysFromCompleted,
  moduleProgress,
  overallProgress,
  percentOf,
  quizScore,
} from '@/utils/studyMetrics';

const { modulos, lista } = buildCatalog({
  modulos: [
    {
      id: '01',
      titulo: 'Direito',
      descricao: 'Base',
      aulas: [
        { id: '01-01', titulo: 'Norma', arquivo: 'aulas/01/01.md' },
        { id: '01-02', titulo: 'Lei', arquivo: 'aulas/01/02.md' },
        { id: '01-03', titulo: 'Em breve', arquivo: null },
      ],
    },
  ],
});

describe('studyMetrics', () => {
  it('calcula percentuais arredondados e zero sem total', () => {
    expect(percentOf(1, 3)).toBe(33);
    expect(percentOf(0, 0)).toBe(0);
  });

  it('conta só aulas prontas no progresso do módulo e geral', () => {
    const feitas = { '01-01': '2026-11-10' };
    expect(moduleProgress(modulos[0], feitas)).toEqual({ done: 1, total: 2, pct: 50 });
    expect(overallProgress(lista, feitas)).toEqual({ done: 1, total: 2, pct: 50 });
  });

  it('registra como dia de estudo cada data de aula concluída', () => {
    expect(
      mergeStudyDaysFromCompleted({ '01-01': '2026-11-10T08:00:00Z', '01-02': 'x' }, {}),
    ).toEqual({ '2026-11-10': true });
  });

  it('conta a sequência a partir de ontem quando hoje ainda não teve estudo', () => {
    const dias = { '2026-11-13': true, '2026-11-14': true, '2026-11-11': true };
    const summary = calculateStreak(dias, '2026-11-15');
    expect(summary.streak).toBe(2);
    expect(summary.totalDays).toBe(3);
    expect(summary.last28).toHaveLength(28);
    expect(summary.last28[27]).toEqual({
      date: '2026-11-15',
      active: false,
      isToday: true,
    });
  });

  it('agenda só o próximo ciclo pendente e separa vencidas de futuras', () => {
    const feitas = { '01-01': '2026-11-10', '01-02': '2026-11-14' };
    const revisoes = { '01-01': { r1: '2026-11-11' } };
    const { due, upcoming } = getSpacedRevisions(lista, feitas, revisoes, '2026-11-15');
    expect(due.map((entry) => [entry.aula.id, entry.cycleKey])).toEqual([
      ['01-02', 'r1'],
    ]);
    expect(
      upcoming.map((entry) => [entry.aula.id, entry.cycleKey, entry.targetDate]),
    ).toEqual([['01-01', 'r7', '2026-11-17']]);
  });

  it('não agenda nada quando os três ciclos já foram feitos', () => {
    const revisoes = { '01-01': { r1: 'a', r7: 'b', r30: 'c' } };
    const result = getSpacedRevisions(
      lista,
      { '01-01': '2026-01-01' },
      revisoes,
      '2026-11-15',
    );
    expect(result).toEqual({ due: [], upcoming: [] });
  });

  it('lista questões erradas de aulas existentes', () => {
    const missed = getMissedQuestions(lista, {
      '01-01#2': 'miss',
      '01-01#1': 'hit',
      '99-01#1': 'miss',
    });
    expect(missed).toEqual([{ aula: lista[0], qNum: 2 }]);
  });

  it('calcula aproveitamento só sobre as questões respondidas', () => {
    expect(quizScore('01-01', 4, { '01-01#1': 'hit', '01-01#3': 'miss' })).toEqual({
      hits: 1,
      misses: 1,
      answered: 2,
      pct: 50,
    });
  });
});
