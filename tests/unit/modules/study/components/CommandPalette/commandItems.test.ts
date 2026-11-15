import { describe, expect, it, vi } from 'vitest';

import { buildCommandItems } from '@/modules/study/components/CommandPalette/commandItems';
import { catalog } from '@/service/catalogService';

const baseOptions = {
  lista: catalog.lista,
  feitas: {},
  notas: {},
  toggleTheme: vi.fn(),
  openBackup: vi.fn(),
  toggleCinema: vi.fn(),
  toggleSound: vi.fn(),
};

describe('buildCommandItems', () => {
  it('sem busca mostra atalhos e as primeiras aulas', () => {
    const items = buildCommandItems({ ...baseOptions, query: '' });
    expect(items[0].title).toBe('Painel Geral');
    expect(items.filter((item) => item.path?.startsWith('/aula/'))).toHaveLength(8);
  });

  it('encontra aula pelo texto da anotação e marca concluída', () => {
    const [first] = catalog.lista;
    const items = buildCommandItems({
      ...baseOptions,
      query: 'palavra-secreta',
      feitas: { [first.id]: '2026-11-15' },
      notas: { [first.id]: 'minha palavra-secreta aqui' },
    });
    expect(items).toHaveLength(1);
    expect(items[0].path).toBe(`/aula/${first.id}`);
    expect(items[0].sub).toContain('CONCLUÍDA');
  });

  it('inclui comandos que executam ações', () => {
    const items = buildCommandItems({ ...baseOptions, query: 'backup' });
    const backup = items.find((item) => item.key === 'cmd-backup');
    backup?.run?.();
    expect(baseOptions.openBackup).toHaveBeenCalled();
  });

  it('limita a 20 resultados', () => {
    expect(buildCommandItems({ ...baseOptions, query: 'a' }).length).toBeLessThanOrEqual(
      20,
    );
  });

  it('oferece comandos para alternar modo cinema e som', () => {
    const items = buildCommandItems({ ...baseOptions, query: 'cinema' });
    items.find((item) => item.key === 'cmd-cinema')?.run?.();
    expect(baseOptions.toggleCinema).toHaveBeenCalled();
    buildCommandItems({ ...baseOptions, query: 'som' })
      .find((item) => item.key === 'cmd-sound')
      ?.run?.();
    expect(baseOptions.toggleSound).toHaveBeenCalled();
  });
});
