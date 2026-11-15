import { useEffect, useState } from 'react';

import { prefersMotion } from '@/utils/motion';

let introPlayed = false;

export const resetDashboardIntro = () => {
  introPlayed = false;
};

export const useDashboardIntro = () => {
  const [playIntro] = useState(() => !introPlayed && prefersMotion());

  useEffect(() => {
    introPlayed = true;
  }, []);

  return playIntro;
};
