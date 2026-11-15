import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

type OverlayName = 'command' | 'backup';

interface OverlayContextProps {
  active: OverlayName | null;
  open: (name: OverlayName) => void;
  close: () => void;
  toggleCommand: () => void;
}

const OverlayContext = createContext<OverlayContextProps | undefined>(undefined);

export const OverlayProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [active, setActive] = useState<OverlayName | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const open = useCallback((name: OverlayName) => {
    if (document.activeElement instanceof HTMLElement)
      lastFocused.current = document.activeElement;
    setActive(name);
  }, []);

  const close = useCallback(() => {
    setActive(null);
    lastFocused.current?.focus();
  }, []);

  const toggleCommand = useCallback(() => {
    if (active === 'command') close();
    else open('command');
  }, [active, close, open]);

  const value = useMemo(
    () => ({ active, open, close, toggleCommand }),
    [active, open, close, toggleCommand],
  );

  return <OverlayContext.Provider value={value}>{children}</OverlayContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useOverlay = () => {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error('useOverlay must be used within an OverlayProvider');
  }
  return context;
};
