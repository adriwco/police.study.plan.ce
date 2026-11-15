import React from 'react';

import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { StudyProvider, useStudy } from '@/contexts/StudyContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { catalog } from '@/service/catalogService';
import { todayIso } from '@/utils/dateUtils';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>
    <StudyProvider>{children}</StudyProvider>
  </ToastProvider>
);

const renderStudy = () => renderHook(() => useStudy(), { wrapper });

describe('StudyContext', () => {
  it('conclui e reabre aula persistindo e registrando o dia de estudo', () => {
    const { result } = renderStudy();
    act(() => result.current.toggleCompleted('01-01'));
    expect(result.current.feitas['01-01']).toBe(todayIso());
    expect(result.current.dias[todayIso()]).toBe(true);
    expect(JSON.parse(localStorage.getItem('pcce.feitas')!)).toEqual({
      '01-01': todayIso(),
    });

    act(() => result.current.toggleCompleted('01-01'));
    expect(result.current.feitas).toEqual({});
  });

  it('marca e desmarca ciclo de revisão', () => {
    const { result } = renderStudy();
    act(() => result.current.toggleRevision('01-01', 'r7'));
    expect(result.current.revisoes['01-01']).toEqual({ r7: todayIso() });
    act(() => result.current.toggleRevision('01-01', 'r7'));
    expect(result.current.revisoes['01-01']).toEqual({});
  });

  it('alterna a autoavaliação da questão', () => {
    const { result } = renderStudy();
    act(() => result.current.evaluateQuestion('01-01', 2, 'miss'));
    expect(result.current.questoes).toEqual({ '01-01#2': 'miss' });
    act(() => result.current.evaluateQuestion('01-01', 2, 'miss'));
    expect(result.current.questoes).toEqual({});
  });

  it('salva nota com a mesma chave do site antigo e lista no caderno', () => {
    const { result } = renderStudy();
    act(() => result.current.setNote('01-01', 'Resumo da aula'));
    expect(localStorage.getItem('pcce.nota.01-01')).toBe('"Resumo da aula"');
    expect(result.current.notesList.map((entry) => entry.aula.id)).toEqual(['01-01']);
  });

  it('lê os dados já salvos pelo site antigo ao iniciar', () => {
    localStorage.setItem('pcce.feitas', JSON.stringify({ '01-01': '2026-10-01' }));
    localStorage.setItem('pcce.nota.01-02', JSON.stringify('nota antiga'));
    const { result } = renderStudy();
    expect(result.current.feitas).toEqual({ '01-01': '2026-10-01' });
    expect(result.current.dias['2026-10-01']).toBe(true);
    expect(result.current.notas['01-02']).toBe('nota antiga');
  });

  it('gera backup e restaura em outro navegador', () => {
    const first = renderStudy();
    act(() => {
      first.result.current.toggleCompleted('01-01');
      first.result.current.toggleFavorite('01-02');
      first.result.current.setNote('01-01', 'nota');
    });
    const backup = first.result.current.buildBackup();
    expect(backup.version).toBe(2);
    expect(backup.notas).toEqual({ '01-01': 'nota' });
    first.unmount();
    localStorage.clear();

    const second = renderStudy();
    act(() => second.result.current.restoreBackup(JSON.parse(JSON.stringify(backup))));
    expect(second.result.current.feitas['01-01']).toBe(todayIso());
    expect(second.result.current.favoritos).toEqual({ '01-02': true });
    expect(second.result.current.notas['01-01']).toBe('nota');
  });

  it('recusa backup que não é objeto', () => {
    const { result } = renderStudy();
    expect(() => result.current.restoreBackup('texto')).toThrow('Formato inválido');
  });

  it('expande e recolhe todos os módulos', () => {
    const { result } = renderStudy();
    act(() => result.current.setAllModulesOpen(true));
    expect(Object.keys(result.current.abertos)).toHaveLength(catalog.modulos.length);
    act(() => result.current.toggleModule('00'));
    expect(result.current.abertos['00']).toBe(false);
  });
});
