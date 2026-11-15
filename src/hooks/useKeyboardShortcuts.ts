import { useEffect } from 'react';

import { useOverlay } from '@/contexts/OverlayContext';
import { usePreferences } from '@/contexts/PreferencesContext';

const TYPING_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

export const useKeyboardShortcuts = () => {
  const { active, open, close, toggleCommand } = useOverlay();
  const { toggleFocusMode, setMenuOpen } = usePreferences();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if ((event.ctrlKey || event.metaKey) && key === 'k') {
        event.preventDefault();
        toggleCommand();
        return;
      }
      if (event.key === 'Escape') {
        if (active) {
          event.preventDefault();
          close();
          return;
        }
        setMenuOpen(false);
      }
      const isTyping = TYPING_TAGS.has(document.activeElement?.tagName ?? '');
      if (isTyping || active) return;
      if (event.key === '/') {
        event.preventDefault();
        open('command');
      } else if (key === 'f' && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        toggleFocusMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, close, open, setMenuOpen, toggleCommand, toggleFocusMode]);
};
