import React, {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';

import { flushSync } from 'react-dom';

import { FONT_SCALE_LABELS, FONT_SCALE_ORDER } from '@/constants/navigation';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { useToast } from '@/contexts/ToastContext';
import { usePersistentState } from '@/hooks/usePersistentState';
import { FontScale, Theme } from '@/types/study';
import { canUseViewTransition } from '@/utils/motion';

interface PreferencesContextProps {
  theme: Theme;
  fontScale: FontScale;
  focusMode: boolean;
  menuOpen: boolean;
  toggleTheme: (origin?: HTMLElement | null) => void;
  cycleFontScale: () => void;
  toggleFocusMode: () => void;
  setMenuOpen: (open: boolean) => void;
  toggleMenu: () => void;
}

const PreferencesContext = createContext<PreferencesContextProps | undefined>(undefined);

const setIrisOrigin = (origin?: HTMLElement | null) => {
  const root = document.documentElement;
  const rect = origin?.getBoundingClientRect();
  const x = rect ? rect.left + rect.width / 2 : window.innerWidth;
  const y = rect ? rect.top + rect.height / 2 : 0;
  root.style.setProperty('--iris-x', `${x}px`);
  root.style.setProperty('--iris-y', `${y}px`);
};

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const toast = useToast();
  const [theme, setTheme] = usePersistentState<Theme>(STORAGE_KEYS.theme, 'light');
  const [fontScale, setFontScale] = usePersistentState<FontScale>(
    STORAGE_KEYS.fontScale,
    'md',
  );
  const [focusMode, setFocusMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useLayoutEffect(() => {
    document.documentElement.dataset.fontScale = fontScale;
  }, [fontScale]);

  useLayoutEffect(() => {
    document.body.classList.toggle('focus-mode', focusMode);
  }, [focusMode]);

  const toggleTheme = useCallback(
    (origin?: HTMLElement | null) => {
      const next: Theme = theme === 'dark' ? 'light' : 'dark';
      const applyTheme = () => flushSync(() => setTheme(next));
      if (canUseViewTransition()) {
        const root = document.documentElement;
        setIrisOrigin(origin);
        root.classList.add('cine-iris');
        document
          .startViewTransition(applyTheme)
          .finished.finally(() => root.classList.remove('cine-iris'));
      } else {
        applyTheme();
      }
      toast(next === 'dark' ? 'Tema Escuro (Carbon)' : 'Tema Claro (Editorial Paper)');
    },
    [setTheme, theme, toast],
  );

  const cycleFontScale = useCallback(() => {
    const next =
      FONT_SCALE_ORDER[
        (FONT_SCALE_ORDER.indexOf(fontScale) + 1) % FONT_SCALE_ORDER.length
      ];
    setFontScale(next);
    toast(FONT_SCALE_LABELS[next]);
  }, [fontScale, setFontScale, toast]);

  const toggleFocusMode = useCallback(() => {
    const enabled = !focusMode;
    setFocusMode(enabled);
    toast(enabled ? 'Modo Foco ativo (F para sair)' : 'Modo Foco desativado');
  }, [focusMode, toast]);

  const toggleMenu = useCallback(() => setMenuOpen((open) => !open), []);

  const value = useMemo(
    () => ({
      theme,
      fontScale,
      focusMode,
      menuOpen,
      toggleTheme,
      cycleFontScale,
      toggleFocusMode,
      setMenuOpen,
      toggleMenu,
    }),
    [
      theme,
      fontScale,
      focusMode,
      menuOpen,
      toggleTheme,
      cycleFontScale,
      toggleFocusMode,
      toggleMenu,
    ],
  );

  return (
    <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};
