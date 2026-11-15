import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import App from '@/App';
import { addDaysIso, todayIso } from '@/utils/dateUtils';

import { renderWithProviders } from '../../../../renderWithProviders';

const openRoute = (hash: string) => {
  window.location.hash = hash;
  renderWithProviders(<App />);
};

describe('Telas de estudo', () => {
  it('filtra o edital por bloco e por texto', async () => {
    const user = userEvent.setup();
    openRoute('#/edital');
    const total = document.querySelectorAll('.edital-module-block').length;
    await user.click(screen.getByRole('button', { name: 'Jurídico (50q)' }));
    expect(document.querySelectorAll('.edital-module-block').length).toBeLessThan(total);
    await user.type(
      screen.getByLabelText('Filtrar matéria ou tópico'),
      'zzz-sem-resultado',
    );
    expect(document.querySelectorAll('.edital-module-block')).toHaveLength(0);
  });

  it('marca ciclo de revisão pela matriz do edital', async () => {
    const user = userEvent.setup();
    openRoute('#/edital');
    const [firstChip] = screen.getAllByRole('button', { name: /R1·24H/ });
    await user.click(firstChip);
    expect(firstChip).toHaveAttribute('aria-pressed', 'true');
  });

  it('lista revisão vencida e permite concluir', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      'pcce.feitas',
      JSON.stringify({ '01-01': addDaysIso(todayIso(), -2) }),
    );
    openRoute('#/revisoes');
    const panel = screen.getByText('01 / PENDENTES HOJE').closest('section')!;
    expect(within(panel).getByText(/01-01 ·/)).toBeInTheDocument();
    await user.click(within(panel).getByRole('button', { name: 'Concluir' }));
    expect(
      within(panel).getByText('Nenhuma revisão pendente para hoje.'),
    ).toBeInTheDocument();
  });

  it('busca no caderno de anotações', async () => {
    const user = userEvent.setup();
    localStorage.setItem('pcce.nota.01-01', JSON.stringify('princípio da legalidade'));
    localStorage.setItem('pcce.nota.01-02', JSON.stringify('hierarquia'));
    openRoute('#/caderno');
    expect(
      screen.getByRole('heading', { name: 'Caderno de Anotações (2)' }),
    ).toBeInTheDocument();
    await user.type(screen.getByLabelText('Pesquisar nas notas'), 'legalidade');
    expect(document.querySelectorAll('article.notepad-card')).toHaveLength(1);
  });

  it('mostra estado vazio do caderno', () => {
    openRoute('#/caderno');
    expect(screen.getByText('Nenhuma anotação registrada')).toBeInTheDocument();
  });

  it('carrega o guia com seus capítulos', async () => {
    openRoute('#/guia');
    expect(await screen.findByText('Capítulos do Guia')).toBeInTheDocument();
    expect(document.querySelectorAll('#guide-body h2').length).toBeGreaterThan(0);
  });

  it('filtra a barra lateral e mostra estado vazio', async () => {
    const user = userEvent.setup();
    openRoute('#/');
    await user.type(screen.getByLabelText('Filtrar módulo ou aula'), 'texto-inexistente');
    expect(screen.getByText('Nenhum registro para este filtro.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Limpar filtro' }));
    expect(
      screen.queryByText('Nenhum registro para este filtro.'),
    ).not.toBeInTheDocument();
  });
});
