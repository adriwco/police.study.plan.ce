import { describe, expect, it } from 'vitest';

import { NOTE_SNIPPETS } from '@/constants/noteSnippets';
import {
  applySlashCommands,
  insertSnippet,
} from '@/modules/study/components/LessonNotepad/applySlashCommands';

describe('applySlashCommands', () => {
  it('expande o comando digitado seguido de espaço', () => {
    expect(applySlashCommands('início /lei ')).toEqual({
      value: `início ${NOTE_SNIPPETS.lei}`,
      expanded: true,
    });
  });

  it('insere a data de hoje com /hoje', () => {
    expect(applySlashCommands('/hoje ', '2026-11-15').value).toBe('[15.11.2026] ');
  });

  it('não altera texto sem comando', () => {
    expect(applySlashCommands('lei sem barra')).toEqual({
      value: 'lei sem barra',
      expanded: false,
    });
  });
});

describe('insertSnippet', () => {
  it('separa o modelo do texto anterior com linha em branco', () => {
    expect(insertSnippet('abc', 'X', 3, 3)).toBe('abc\n\nX');
  });

  it('substitui a seleção sem separador quando o texto termina em quebra de linha', () => {
    expect(insertSnippet('abc\n', 'X', 0, 3)).toBe('X\n');
  });
});
