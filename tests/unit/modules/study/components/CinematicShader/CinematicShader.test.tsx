import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PreferencesProvider } from '@/contexts/PreferencesContext';
import { ToastProvider } from '@/contexts/ToastContext';
import CinematicShader from '@/modules/study/components/CinematicShader/CinematicShader';
import { createShaderRenderer } from '@/modules/study/components/CinematicShader/createShaderRenderer';

describe('CinematicShader', () => {
  it('não cria renderizador quando o navegador não oferece WebGL', () => {
    expect(createShaderRenderer(document.createElement('canvas'))).toBeNull();
  });

  it('renderiza a tela decorativa escondida da leitura de tela sem quebrar', () => {
    const { container } = render(
      <ToastProvider>
        <PreferencesProvider>
          <CinematicShader />
        </PreferencesProvider>
      </ToastProvider>,
    );
    const wrapper = container.querySelector('.cine-shader-wrap');
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    expect(wrapper?.querySelector('canvas.cine-shader')).not.toBeNull();
  });
});
