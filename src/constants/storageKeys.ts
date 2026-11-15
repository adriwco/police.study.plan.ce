export const STORAGE_KEYS = {
  completed: 'pcce.feitas',
  openModules: 'pcce.abertos',
  studyDays: 'pcce.dias',
  revisions: 'pcce.revisoes',
  favorites: 'pcce.favoritos',
  questions: 'pcce.questoes',
  lastLesson: 'pcce.ultima',
  pomodoroStats: 'pcce.pomoStats',
  theme: 'pcce.tema',
  fontScale: 'pcce.escalaFonte',
  cinemaMode: 'pcce.cinema',
  cinemaSound: 'pcce.somCinema',
  notePrefix: 'pcce.nota.',
} as const;

export const noteStorageKey = (lessonId: string) =>
  `${STORAGE_KEYS.notePrefix}${lessonId}`;
