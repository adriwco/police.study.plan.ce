export type BlockId = 'base' | 'basicas' | 'juridico' | 'especificas' | 'final';

export type BlockFilter = BlockId | 'all';

export interface ModuleMeta {
  block: BlockId;
  blockLabel: string;
  weight: string;
}

export interface RawLesson {
  id: string;
  titulo: string;
  arquivo: string | null;
}

export interface RawModule {
  id: string;
  titulo: string;
  descricao: string;
  pasta?: string;
  aulas: RawLesson[];
}

export interface RawTrilha {
  modulos: RawModule[];
}

export interface StudyModule extends RawModule {
  meta: ModuleMeta;
}

export interface Lesson extends RawLesson {
  ordemNoModulo: number;
  modulo: StudyModule;
}

export interface Catalog {
  modulos: StudyModule[];
  lista: Lesson[];
}

export type RevisionCycleKey = 'r1' | 'r7' | 'r30';

export type QuestionResult = 'hit' | 'miss';

export type CompletedMap = Record<string, string>;
export type StudyDaysMap = Record<string, boolean>;
export type RevisionMap = Record<string, Partial<Record<RevisionCycleKey, string>>>;
export type FavoriteMap = Record<string, boolean>;
export type QuestionMap = Record<string, QuestionResult>;
export type NoteMap = Record<string, string>;
export type OpenModulesMap = Record<string, boolean>;

export interface RevisionEntry {
  aula: Lesson;
  cycleKey: RevisionCycleKey;
  cycleLabel: string;
  targetDate: string;
  completedDate: string;
}

export interface StreakDay {
  date: string;
  active: boolean;
  isToday: boolean;
}

export interface StreakSummary {
  streak: number;
  totalDays: number;
  last28: StreakDay[];
}

export interface BackupPayload {
  version: number;
  exportedAt: string;
  feitas: CompletedMap;
  dias: StudyDaysMap;
  revisoes: RevisionMap;
  favoritos: FavoriteMap;
  questoes: QuestionMap;
  notas: NoteMap;
}

export type Theme = 'light' | 'dark';

export type FontScale = 'sm' | 'md' | 'lg' | 'xl';

export type PomodoroMode = '25' | '50' | '5';
