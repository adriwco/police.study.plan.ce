import React from 'react';

import { OverlayProvider } from '@/contexts/OverlayContext';
import { PomodoroProvider } from '@/contexts/PomodoroContext';
import { PreferencesProvider } from '@/contexts/PreferencesContext';
import { StudyProvider } from '@/contexts/StudyContext';
import { ToastProvider } from '@/contexts/ToastContext';

const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ToastProvider>
    <PreferencesProvider>
      <StudyProvider>
        <PomodoroProvider>
          <OverlayProvider>{children}</OverlayProvider>
        </PomodoroProvider>
      </StudyProvider>
    </PreferencesProvider>
  </ToastProvider>
);

export default AppProviders;
