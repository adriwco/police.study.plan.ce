import React from 'react';

import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PomodoroProvider, usePomodoro } from '@/contexts/PomodoroContext';
import { StudyProvider } from '@/contexts/StudyContext';
import { ToastProvider } from '@/contexts/ToastContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>
    <StudyProvider>
      <PomodoroProvider>{children}</PomodoroProvider>
    </StudyProvider>
  </ToastProvider>
);

describe('PomodoroContext', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('conta o tempo e conclui o ciclo somando estatística do dia', () => {
    const { result } = renderHook(() => usePomodoro(), { wrapper });
    act(() => result.current.setMode('5'));
    act(() => result.current.setMode('25'));
    act(() => result.current.toggle());
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.secondsLeft).toBe(25 * 60 - 3);

    act(() => {
      vi.advanceTimersByTime(25 * 60 * 1000);
    });
    expect(result.current.running).toBe(false);
    expect(result.current.cycles).toBe(1);
    expect(result.current.secondsLeft).toBe(25 * 60);
  });

  it('intervalo de 5 minutos não conta como ciclo', () => {
    const { result } = renderHook(() => usePomodoro(), { wrapper });
    act(() => result.current.setMode('5'));
    act(() => result.current.toggle());
    act(() => {
      vi.advanceTimersByTime(5 * 60 * 1000 + 1000);
    });
    expect(result.current.cycles).toBe(0);
  });

  it('zera o tempo ao reiniciar', () => {
    const { result } = renderHook(() => usePomodoro(), { wrapper });
    act(() => result.current.toggle());
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    act(() => result.current.reset());
    expect(result.current.running).toBe(false);
    expect(result.current.secondsLeft).toBe(25 * 60);
  });
});
