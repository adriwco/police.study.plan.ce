import { ChangeEvent } from 'react';

import { useOverlay } from '@/contexts/OverlayContext';
import { useStudy } from '@/contexts/StudyContext';
import { useToast } from '@/contexts/ToastContext';
import { useExportNotebook } from '@/hooks/useExportNotebook';
import { todayIso } from '@/utils/dateUtils';
import { downloadTextFile } from '@/utils/downloadFile';
import { JSON_MIME } from '@/utils/notesExport';

const BackupModal = () => {
  const { active, close } = useOverlay();
  const { buildBackup, restoreBackup } = useStudy();
  const exportNotebook = useExportNotebook();
  const toast = useToast();
  const isOpen = active === 'backup';

  const exportBackup = () => {
    downloadTextFile(
      `backup-pcce-${todayIso()}.json`,
      JSON.stringify(buildBackup(), null, 2),
      JSON_MIME,
    );
    toast('Arquivo de backup gerado (.json)');
  };

  const importBackup = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        restoreBackup(JSON.parse(String(reader.result)));
        close();
        toast('Backup restaurado');
      } catch {
        toast('Arquivo JSON inválido');
      }
      input.value = '';
    };
    reader.readAsText(file);
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <div
      id="backup-modal"
      className={`modal-backdrop ${isOpen ? 'open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="backup-dialog-title"
      aria-hidden={!isOpen}
      data-lenis-prevent=""
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="cmd-dialog p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="backup-dialog-title" className="m-0 text-[1.1rem]">
            Portabilidade e Cópia de Segurança
          </h2>
          <button type="button" className="btn sm" onClick={close}>
            Fechar
          </button>
        </div>
        <p className="mb-[18px] mt-0 text-[0.86rem] leading-[1.55] text-ink-secondary">
          O progresso das aulas, o registro de constância, a fila de revisões espaçadas e
          o caderno ficam armazenados localmente neste navegador. Exporte um arquivo JSON
          para preservar seus dados ou restaurar em outro computador.
        </p>
        <div className="flex flex-wrap gap-2.5">
          <button type="button" className="btn primary" onClick={exportBackup}>
            Baixar Backup (.json)
          </button>
          <button type="button" className="btn" onClick={exportNotebook}>
            Exportar Caderno (.md)
          </button>
          <label className="btn cursor-pointer">
            Restaurar Backup (.json)
            <input
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={importBackup}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default BackupModal;
