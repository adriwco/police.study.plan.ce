import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import App from '@/App';

import { renderWithProviders } from '../renderWithProviders';

describe('App', () => {
  it('abre o painel com o título editorial e o progresso zerado', () => {
    renderWithProviders(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Formação jurídica e exata do zero absoluto.',
    );
    expect(
      screen.getByRole('progressbar', { name: 'Progresso geral do curso' }),
    ).toHaveAttribute('aria-valuenow', '0');
  });

  it('navega para a aula pelo botão de continuar leitura', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);
    await user.click(screen.getByRole('link', { name: 'Continuar leitura →' }));
    expect(
      await screen.findByRole('button', { name: 'Concluir aula' }),
    ).toBeInTheDocument();
    expect(window.location.hash).toBe('#/aula/00-01');
  });

  it('abre a busca global com Ctrl+K e navega pelo teclado', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);
    await user.keyboard('{Control>}k{/Control}');
    const input = screen.getByPlaceholderText(/Buscar por aula/);
    await waitFor(() => expect(input).toHaveFocus());
    await user.type(input, 'edital verticalizado');
    await user.keyboard('{Enter}');
    expect(
      await screen.findByRole('heading', { name: /Edital Verticalizado e Ciclos/ }),
    ).toBeInTheDocument();
  });

  it('liga o modo foco pela tecla F e alterna o tema', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);
    await user.keyboard('f');
    expect(document.body).toHaveClass('focus-mode');
    await user.click(screen.getByRole('button', { name: 'Alternar para tema escuro' }));
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(
      screen.getByRole('button', { name: 'Alternar para tema claro' }),
    ).toHaveTextContent('Luz');
  });

  it('redireciona rota desconhecida para o painel', async () => {
    window.location.hash = '#/nao-existe';
    renderWithProviders(<App />);
    expect(await screen.findByText('ÍNDICE GERAL DO CURSO')).toBeInTheDocument();
  });
});
