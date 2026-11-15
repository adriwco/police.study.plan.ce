import { Lesson } from '@/types/study';
import { formatBrDate, todayIso } from '@/utils/dateUtils';

export const MARKDOWN_MIME = 'text/markdown;charset=utf-8';
export const JSON_MIME = 'application/json;charset=utf-8';

export const buildNotebookMarkdown = (
  notes: { aula: Lesson; text: string }[],
  today = todayIso(),
) =>
  [
    '# Caderno de Estudos — Curso PCCE',
    `Exportado em: ${formatBrDate(today)}`,
    '',
    ...notes.flatMap((entry) => [
      `## [${entry.aula.id}] ${entry.aula.titulo} (${entry.aula.modulo.titulo})`,
      entry.text,
      '\n---\n',
    ]),
  ].join('\n');

export const buildSingleNoteMarkdown = (aula: Lesson, note: string) =>
  `# ${aula.titulo}\nMódulo ${aula.modulo.id} - ${aula.modulo.titulo}\n\n${note}\n`;
