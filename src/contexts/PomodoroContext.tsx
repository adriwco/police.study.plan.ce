import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { STORAGE_KEYS } from '@/constants/storageKeys';
import { useStudy } from '@/contexts/StudyContext';
import { useToast } from '@/contexts/ToastContext';
import { usePersistentState } from '@/hooks/usePersistentState';
import { PomodoroMode } from '@/types/study';
import { todayIso } from '@/utils/dateUtils';
import { playSoftChime } from '@/utils/softChime';

interface PomodoroStats {
  date: string;
  cycles: number;
  minutes: number;
}

interface PomodoroContextProps {
  mode: PomodoroMode;
  secondsLeft: number;
  running: boolean;
  cycles: number;
  setMode: (mode: PomodoroMode) => void;
  toggle: () => void;
  reset: () => void;
}

const PomodoroContext = createContext<PomodoroContextProps | undefined>(undefined);

const BREAK_MODE: PomodoroMode = '5';

const secondsFor = (mode: PomodoroMode) => Number(mode) * 60;

const emptyStats = (): PomodoroStats => ({ date: todayIso(), cycles: 0, minutes: 0 });

export const PomodoroProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const toast = useToast();
  const { recordActivity } = useStudy();
  const [mode, setModeState] = useState<PomodoroMode>('25');
  const [secondsLeft, setSecondsLeft] = useState(secondsFor('25'));
  const [running, setRunning] = useState(false);
  const [stats, setStats] = usePersistentState<PomodoroStats>(
    STORAGE_KEYS.pomodoroStats,
    emptyStats,
    (stored) => (stored.date === todayIso() ? stored : emptyStats()),
  );

  useEffect(() => {
    if (!running) return undefined;
    const timerId = setInterval(() => {
      setSecondsLeft((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => clearInterval(timerId);
  }, [running]);

  useEffect(() => {
    if (!running || secondsLeft > 0) return;
    setRunning(false);
    if (mode !== BREAK_MODE) {
      setStats((previous) => ({
        ...previous,
        cycles: previous.cycles + 1,
        minutes: previous.minutes + Number(mode),
      }));
      recordActivity();
    }
    setSecondsLeft(secondsFor(mode));
    playSoftChime();
    toast(mode === BREAK_MODE ? 'Intervalo concluído' : 'Sessão concluída');
  }, [mode, recordActivity, running, secondsLeft, setStats, toast]);

  const setMode = useCallback((nextMode: PomodoroMode) => {
    setRunning(false);
    setModeState(nextMode);
    setSecondsLeft(secondsFor(nextMode));
  }, []);

  const toggle = useCallback(() => setRunning((isRunning) => !isRunning), []);

  const reset = useCallback(() => {
    setRunning(false);
    setSecondsLeft(secondsFor(mode));
  }, [mode]);

  const value = useMemo(
    () => ({ mode, secondsLeft, running, cycles: stats.cycles, setMode, toggle, reset }),
    [mode, secondsLeft, running, stats.cycles, setMode, toggle, reset],
  );

  return <PomodoroContext.Provider value={value}>{children}</PomodoroContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePomodoro = () => {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error('usePomodoro must be used within a PomodoroProvider');
  }
  return context;
};
