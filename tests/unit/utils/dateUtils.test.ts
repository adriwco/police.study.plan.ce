import { describe, expect, it, vi } from 'vitest';

import {
  addDaysIso,
  formatBrDate,
  formatClock,
  formatSeconds,
  todayIso,
} from '@/utils/dateUtils';

describe('dateUtils', () => {
  it('gera a data local de hoje no formato ISO', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 5, 23, 30));
    expect(todayIso()).toBe('2026-11-05');
    vi.useRealTimers();
  });

  it('soma e subtrai dias atravessando meses e anos', () => {
    expect(addDaysIso('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDaysIso('2026-03-01', -1)).toBe('2026-02-28');
  });

  it('cai para hoje quando a data base é inválida', () => {
    expect(addDaysIso('data-ruim', 3)).toBe(todayIso());
  });

  it('formata data no padrão brasileiro com pontos', () => {
    expect(formatBrDate('2026-11-15T10:00:00Z')).toBe('15.11.2026');
    expect(formatBrDate('')).toBe('');
    expect(formatBrDate(null)).toBe('');
  });

  it('formata relógio e cronômetro com dois dígitos', () => {
    expect(formatClock(new Date(2026, 0, 1, 7, 5))).toBe('07:05');
    expect(formatSeconds(25 * 60)).toBe('25:00');
    expect(formatSeconds(61)).toBe('01:01');
  });
});
