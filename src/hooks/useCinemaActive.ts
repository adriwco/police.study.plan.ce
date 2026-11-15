import { usePreferences } from '@/contexts/PreferencesContext';
import { prefersMotion } from '@/utils/motion';

export const useCinemaActive = () => {
  const { cinemaMode } = usePreferences();
  return cinemaMode && prefersMotion();
};
