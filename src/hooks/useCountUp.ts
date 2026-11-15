import { useEffect, useState } from 'react';

export const useCountUp = (
  target: number,
  animate: boolean,
  delay = 650,
  duration = 1200,
) => {
  const [value, setValue] = useState(animate ? 0 : target);

  useEffect(() => {
    if (!animate) {
      setValue(target);
      return undefined;
    }
    const start = performance.now() + delay;
    let frameId = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, Math.max(0, (now - start) / duration));
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 4))));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [animate, delay, duration, target]);

  return value;
};
