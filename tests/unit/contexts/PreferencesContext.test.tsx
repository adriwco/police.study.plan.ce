import React from 'react';

import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PreferencesProvider, usePreferences } from '@/contexts/PreferencesContext';
import { ToastProvider } from '@/contexts/ToastContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>
    <PreferencesProvider>{children}</PreferencesProvider>
  </ToastProvider>
);

describe('PreferencesContext', () => {
  it('liga o modo cinema por padrão e marca o documento', () => {
    const { result } = renderHook(() => usePreferences(), { wrapper });
    expect(result.current.cinemaMode).toBe(true);
    expect(document.documentElement.dataset.cinema).toBe('on');
  });

  it('desliga o modo cinema e guarda a escolha', () => {
    const { result } = renderHook(() => usePreferences(), { wrapper });
    act(() => result.current.toggleCinema());
    expect(result.current.cinemaMode).toBe(false);
    expect(document.documentElement.dataset.cinema).toBe('off');
    expect(localStorage.getItem('pcce.cinema')).toBe('false');
  });

  it('mantém o som desligado por padrão e guarda quando ligado', () => {
    const { result } = renderHook(() => usePreferences(), { wrapper });
    expect(result.current.soundOn).toBe(false);
    act(() => result.current.toggleSound());
    expect(result.current.soundOn).toBe(true);
    expect(localStorage.getItem('pcce.somCinema')).toBe('true');
  });

  it('respeita a escolha salva anteriormente', () => {
    localStorage.setItem('pcce.cinema', 'false');
    const { result } = renderHook(() => usePreferences(), { wrapper });
    expect(result.current.cinemaMode).toBe(false);
  });
});
