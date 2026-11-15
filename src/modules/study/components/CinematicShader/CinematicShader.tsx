import { useEffect, useRef } from 'react';

import { usePreferences } from '@/contexts/PreferencesContext';
import { createShaderRenderer } from '@/modules/study/components/CinematicShader/createShaderRenderer';

const RENDER_SCALE = 0.6;
const FRAME_INTERVAL_MS = 1000 / 30;

const CinematicShader = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = usePreferences();
  const darkRef = useRef(theme === 'dark');
  darkRef.current = theme === 'dark';

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = canvas ? createShaderRenderer(canvas) : null;
    if (!canvas || !renderer) return undefined;

    let visible = true;
    let frameId = 0;
    let lastFrame = 0;
    const startedAt = performance.now();

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 1.5) * RENDER_SCALE;
      renderer.resize(
        Math.max(1, Math.round(canvas.clientWidth * scale)),
        Math.max(1, Math.round(canvas.clientHeight * scale)),
      );
    };

    const loop = (now: number) => {
      frameId = requestAnimationFrame(loop);
      if (!visible || document.hidden || now - lastFrame < FRAME_INTERVAL_MS) return;
      lastFrame = now;
      renderer.draw((now - startedAt) / 1000, darkRef.current);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    visibilityObserver.observe(canvas);
    resize();
    frameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="cine-shader-wrap" aria-hidden="true">
      <canvas ref={canvasRef} className="cine-shader" />
    </div>
  );
};

export default CinematicShader;
