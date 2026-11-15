import { describe, expect, it } from 'vitest';

import { buildCatalog } from '@/service/catalogService';
import { buildNotebookMarkdown, buildSingleNoteMarkdown } from '@/utils/notesExport';

const { lista } = buildCatalog({
  modulos: [
    {
      id: '01',
      titulo: 'Direito',
      descricao: '',
      aulas: [{ id: '01-01', titulo: 'Norma', arquivo: 'a.md' }],
    },
  ],
});

describe('notesExport', () => {
  it('monta o caderno completo com cabeçalho e uma seção por aula', () => {
    const markdown = buildNotebookMarkdown(
      [{ aula: lista[0], text: 'Resumo' }],
      '2026-11-15',
    );
    expect(markdown).toContain('# Caderno de Estudos — Curso PCCE');
    expect(markdown).toContain('Exportado em: 15.11.2026');
    expect(markdown).toContain('## [01-01] Norma (Direito)\nResumo');
  });

  it('monta a nota avulsa com título e módulo', () => {
    expect(buildSingleNoteMarkdown(lista[0], 'Texto')).toBe(
      '# Norma\nMódulo 01 - Direito\n\nTexto\n',
    );
  });
});
