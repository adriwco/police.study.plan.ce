import { describe, expect, it } from 'vitest';

import { DEFAULT_MODULE_META, MODULE_META } from '@/constants/moduleMeta';
import {
  buildCatalog,
  catalog,
  findLesson,
  findNeighbourLessons,
} from '@/service/catalogService';

describe('catalogService', () => {
  it('carrega a trilha real com 19 módulos e metadados de bloco', () => {
    expect(catalog.modulos).toHaveLength(19);
    expect(catalog.modulos[6].meta).toEqual(MODULE_META['06']);
    expect(catalog.lista.length).toBeGreaterThan(0);
  });

  it('usa metadado padrão para módulo desconhecido e numera aulas no módulo', () => {
    const built = buildCatalog({
      modulos: [
        {
          id: '99',
          titulo: 'Extra',
          descricao: '',
          aulas: [
            { id: '99-01', titulo: 'A', arquivo: 'a.md' },
            { id: '99-02', titulo: 'B', arquivo: 'b.md' },
          ],
        },
      ],
    });
    expect(built.modulos[0].meta).toEqual(DEFAULT_MODULE_META);
    expect(built.lista.map((aula) => aula.ordemNoModulo)).toEqual([1, 2]);
  });

  it('encontra aula e vizinhas prontas', () => {
    const lista = buildCatalog({
      modulos: [
        {
          id: '01',
          titulo: 'M',
          descricao: '',
          aulas: [
            { id: '01-01', titulo: 'A', arquivo: 'a.md' },
            { id: '01-02', titulo: 'B', arquivo: null },
            { id: '01-03', titulo: 'C', arquivo: 'c.md' },
          ],
        },
      ],
    }).lista;
    expect(findLesson('01-03', lista)?.titulo).toBe('C');
    const neighbours = findNeighbourLessons('01-03', lista);
    expect(neighbours.previous?.id).toBe('01-01');
    expect(neighbours.next).toBeUndefined();
    expect(findNeighbourLessons('inexistente', lista)).toEqual({
      previous: undefined,
      next: undefined,
    });
  });
});
