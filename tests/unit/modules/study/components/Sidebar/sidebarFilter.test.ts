import { describe, expect, it } from 'vitest';

import { filterModuleLessons } from '@/modules/study/components/Sidebar/sidebarFilter';
import { buildCatalog } from '@/service/catalogService';

const [modulo] = buildCatalog({
  modulos: [
    {
      id: '08',
      titulo: 'Direito Penal',
      descricao: '',
      aulas: [
        { id: '08-01', titulo: 'Crime', arquivo: 'a.md' },
        { id: '08-02', titulo: 'Pena', arquivo: 'b.md' },
      ],
    },
  ],
}).modulos;

const ids = (lessons: { id: string }[]) => lessons.map((lesson) => lesson.id);

describe('filterModuleLessons', () => {
  const state = { feitas: { '08-01': '2026-11-15' }, favoritos: { '08-02': true } };

  it('filtra por estado', () => {
    expect(
      ids(filterModuleLessons(modulo, { ...state, query: '', chip: 'pending' })),
    ).toEqual(['08-02']);
    expect(
      ids(filterModuleLessons(modulo, { ...state, query: '', chip: 'done' })),
    ).toEqual(['08-01']);
    expect(
      ids(filterModuleLessons(modulo, { ...state, query: '', chip: 'fav' })),
    ).toEqual(['08-02']);
  });

  it('busca por título da aula, código ou nome do módulo', () => {
    expect(
      ids(filterModuleLessons(modulo, { ...state, query: 'CRIME', chip: 'all' })),
    ).toEqual(['08-01']);
    expect(
      ids(filterModuleLessons(modulo, { ...state, query: '08-02', chip: 'all' })),
    ).toEqual(['08-02']);
    expect(
      filterModuleLessons(modulo, { ...state, query: 'penal', chip: 'all' }),
    ).toHaveLength(2);
  });
});
