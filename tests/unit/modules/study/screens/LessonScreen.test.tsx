import { fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import App from '@/App';

import { renderWithProviders } from '../../../../renderWithProviders';

const openLesson = async (lessonId: string) => {
  window.location.hash = `#/aula/${lessonId}`;
  renderWithProviders(<App />);
  await screen.findByRole('button', { name: 'Concluir aula' });
};

describe('Tela de aula', () => {
  it('mostra trilha de navegação, etiquetas e sumário da aula', async () => {
    await openLesson('01-01');
    const breadcrumbs = screen.getByRole('navigation', { name: 'Trilha de navegação' });
    expect(within(breadcrumbs).getByText(/Aula 01 de 12/)).toBeInTheDocument();
    expect(document.querySelectorAll('.toc-link').length).toBeGreaterThan(0);
    expect(document.title).toContain('01-01');
  });

  it('conclui a aula e atualiza cabeçalho e barra lateral', async () => {
    const user = userEvent.setup();
    await openLesson('01-01');
    await user.click(screen.getByRole('button', { name: 'Concluir aula' }));
    expect(screen.getByRole('button', { name: '✓ Concluída' })).toBeInTheDocument();
    expect(screen.getByText(/1\/\d+/, { selector: '#g-text' })).toBeInTheDocument();
    expect(
      screen.getByText('Aula concluída · Revisões 24h/7d/30d agendadas'),
    ).toBeInTheDocument();
  });

  it('registra a autoavaliação da questão e atualiza o placar', async () => {
    const user = userEvent.setup();
    await openLesson('01-01');
    const card = document.getElementById('quiz-card-1')!;
    await user.click(within(card).getByRole('button', { name: 'Revisar depois' }));
    expect(card).toHaveClass('status-miss');
    expect(document.querySelector('[data-quiz-banner]')).toHaveTextContent('1 REVISAR');
    expect(JSON.parse(localStorage.getItem('pcce.questoes')!)).toEqual({
      '01-01#1': 'miss',
    });
  });

  it('expande comando rápido no caderno e salva a nota', async () => {
    await openLesson('01-01');
    const textarea = screen.getByLabelText('Anotações da aula');
    fireEvent.change(textarea, { target: { value: 'Ideia /check ' } });
    expect((textarea as HTMLTextAreaElement).value).toContain('VERIFICAÇÃO DE ESTUDO');
    expect(screen.getByText(/Salvo às/)).toBeInTheDocument();
    expect(localStorage.getItem('pcce.nota.01-01')).toContain('VERIFICAÇÃO DE ESTUDO');
  });

  it('marca a aula como favorita', async () => {
    const user = userEvent.setup();
    await openLesson('01-01');
    await user.click(screen.getByRole('button', { name: '☆ Marcar' }));
    expect(screen.getByRole('button', { name: '★ Marcada' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('volta ao painel quando a aula não existe', async () => {
    window.location.hash = '#/aula/99-99';
    renderWithProviders(<App />);
    expect(await screen.findByText('ÍNDICE GERAL DO CURSO')).toBeInTheDocument();
  });
});
