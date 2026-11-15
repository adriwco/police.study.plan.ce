import { MouseEvent, useLayoutEffect } from 'react';

import { Outlet, useLocation } from 'react-router-dom';

import { usePreferences } from '@/contexts/PreferencesContext';
import { useCinematicLinks } from '@/hooks/useCinematicLinks';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import AppHeader from '@/modules/study/components/AppHeader/AppHeader';
import BackupModal from '@/modules/study/components/BackupModal/BackupModal';
import CinematicLayers from '@/modules/study/components/CinematicLayers/CinematicLayers';
import CommandPalette from '@/modules/study/components/CommandPalette/CommandPalette';
import Sidebar from '@/modules/study/components/Sidebar/Sidebar';
import { scrollToTopInstantly } from '@/utils/smoothScroll';

const MAIN_CONTENT_ID = 'main-content';

const skipToContent = (event: MouseEvent<HTMLAnchorElement>) => {
  event.preventDefault();
  document.getElementById(MAIN_CONTENT_ID)?.focus();
};

const AppLayout = () => {
  const { pathname } = useLocation();
  const { menuOpen, setMenuOpen } = usePreferences();
  useCinematicLinks();
  useKeyboardShortcuts();
  useSmoothScroll();

  useLayoutEffect(() => {
    setMenuOpen(false);
    scrollToTopInstantly();
  }, [pathname, setMenuOpen]);

  return (
    <>
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className="skip-link"
        data-native-link=""
        onClick={skipToContent}
      >
        Pular para o conteúdo principal
      </a>
      <CinematicLayers />
      <AppHeader />
      <div
        id="sidebar-backdrop"
        className={`sidebar-backdrop ${menuOpen ? 'show' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <div className="workspace-layout">
        <Sidebar />
        <main id={MAIN_CONTENT_ID} className="app-main" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
      <CommandPalette />
      <BackupModal />
    </>
  );
};

export default AppLayout;
