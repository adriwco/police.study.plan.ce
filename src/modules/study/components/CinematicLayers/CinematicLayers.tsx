import { useRef } from 'react';

import { useLocation } from 'react-router-dom';

import { useReadingProgress } from '@/hooks/useReadingProgress';

const CinematicLayers = () => {
  const barRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  useReadingProgress(barRef, pathname);

  return (
    <>
      <div className="reading-progress-track" aria-hidden="true">
        <div ref={barRef} id="reading-progress-bar" className="reading-progress-bar" />
      </div>
      <div className="cine-stage" aria-hidden="true" />
      <div className="cine-letterbox" aria-hidden="true" />
    </>
  );
};

export default CinematicLayers;
