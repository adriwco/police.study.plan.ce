import { useCallback } from 'react';

import { useStudy } from '@/contexts/StudyContext';
import { useToast } from '@/contexts/ToastContext';
import { todayIso } from '@/utils/dateUtils';
import { downloadTextFile } from '@/utils/downloadFile';
import { buildNotebookMarkdown, MARKDOWN_MIME } from '@/utils/notesExport';

export const useExportNotebook = () => {
  const { notesList } = useStudy();
  const toast = useToast();

  return useCallback(() => {
    if (!notesList.length) {
      toast('Sem anotações para exportar');
      return;
    }
    downloadTextFile(
      `caderno-pcce-${todayIso()}.md`,
      buildNotebookMarkdown(notesList),
      MARKDOWN_MIME,
    );
    toast('Caderno exportado (.md)');
  }, [notesList, toast]);
};
