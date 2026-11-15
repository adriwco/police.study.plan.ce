import { useRef, useState } from 'react';

import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/navigation';
import { NOTE_SNIPPET_BUTTONS, NOTE_SNIPPETS } from '@/constants/noteSnippets';
import { useStudy } from '@/contexts/StudyContext';
import { useToast } from '@/contexts/ToastContext';
import {
  applySlashCommands,
  insertSnippet,
} from '@/modules/study/components/LessonNotepad/applySlashCommands';
import { Lesson } from '@/types/study';
import { formatClock } from '@/utils/dateUtils';
import { downloadTextFile } from '@/utils/downloadFile';
import { buildSingleNoteMarkdown, MARKDOWN_MIME } from '@/utils/notesExport';

interface LessonNotepadProps {
  lesson: Lesson;
}

const LessonNotepad = ({ lesson }: LessonNotepadProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [status, setStatus] = useState('Salvo localmente');
  const { notas, setNote } = useStudy();
  const toast = useToast();
  const note = notas[lesson.id] ?? '';

  const saveNote = (value: string, selection?: { start: number; end: number }) => {
    setNote(lesson.id, value);
    setStatus(`Salvo às ${formatClock(new Date())}`);
    if (!selection) return;
    requestAnimationFrame(() => {
      const textarea = textareaRef.current;
      textarea?.focus();
      textarea?.setSelectionRange(selection.start, selection.end);
    });
  };

  const handleChange = (value: string) => {
    const result = applySlashCommands(value);
    if (result.expanded) toast('Modelo inserido');
    saveNote(result.value);
  };

  const handleSnippet = (snippet: string) => {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? note.length;
    const end = textarea?.selectionEnd ?? note.length;
    const next = insertSnippet(note, snippet, start, end);
    const caret = next.length - (note.length - end);
    saveNote(next, { start: caret, end: caret });
  };

  const handleUppercase = () => {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? 0;
    const end = textarea?.selectionEnd ?? 0;
    if (start === end) {
      toast('Selecione um trecho para converter em MAIÚSCULAS');
      return;
    }
    saveNote(
      note.slice(0, start) + note.slice(start, end).toUpperCase() + note.slice(end),
      {
        start,
        end,
      },
    );
  };

  const handleExport = () => {
    if (!note.trim()) {
      toast('Anotação vazia');
      return;
    }
    downloadTextFile(
      `nota-${lesson.id}.md`,
      buildSingleNoteMarkdown(lesson, note),
      MARKDOWN_MIME,
    );
  };

  return (
    <section
      id="lesson-notepad"
      className="notepad-card"
      aria-labelledby="notepad-heading"
    >
      <div className="notepad-header">
        <div className="notepad-title-group">
          <h2 id="notepad-heading" className="notepad-title">
            Caderno da Aula
          </h2>
          <span className="font-mono text-[0.68rem] text-ink-muted">
            Comandos rápidos: <code>/resumo</code> <code>/lei</code>{' '}
            <code>/pegadinha</code> <code>/check</code>
          </span>
        </div>
        <span id="note-save-status" className="notepad-status">
          {status}
        </span>
      </div>
      <div
        className="notepad-toolbar"
        role="toolbar"
        aria-label="Inserir estrutura de nota"
      >
        {NOTE_SNIPPET_BUTTONS.map((button) => (
          <button
            key={button.key}
            type="button"
            className="snippet-btn"
            onClick={() => handleSnippet(NOTE_SNIPPETS[button.key])}
          >
            {button.label}
          </button>
        ))}
        <button type="button" className="snippet-btn" onClick={handleUppercase}>
          MAIÚSCULAS
        </button>
        <button type="button" className="snippet-btn" onClick={handleExport}>
          Exportar .md
        </button>
      </div>
      <label htmlFor="nota" className="sr-only">
        Anotações da aula
      </label>
      <textarea
        ref={textareaRef}
        id="nota"
        data-lenis-prevent=""
        className="notepad-textarea"
        placeholder="Registre seu resumo com suas próprias palavras, artigos de lei ou digite /resumo, /lei, /pegadinha..."
        value={note}
        onChange={(event) => handleChange(event.target.value)}
      />
      <div className="notepad-foot">
        <span id="note-char-count">{note.length} caracteres</span>
        <Link to={ROUTES.notebook}>Índice completo do caderno →</Link>
      </div>
    </section>
  );
};

export default LessonNotepad;
