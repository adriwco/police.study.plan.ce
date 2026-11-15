import { ROUTES } from '@/constants/navigation';
import { CompletedMap, Lesson, NoteMap } from '@/types/study';

export interface CommandItem {
  key: string;
  title: string;
  sub: string;
  path?: string;
  run?: () => void;
}

interface BuildCommandItemsOptions {
  query: string;
  lista: Lesson[];
  feitas: CompletedMap;
  notas: NoteMap;
  toggleTheme: () => void;
  openBackup: () => void;
}

const MAX_LESSON_MATCHES = 18;
const MAX_RESULTS = 20;
const DEFAULT_LESSON_COUNT = 8;

const lessonItem = (aula: Lesson, done: boolean): CommandItem => ({
  key: `lesson-${aula.id}`,
  title: `${aula.id} — ${aula.titulo}`,
  sub: `MÓD. ${aula.modulo.id} · ${aula.modulo.titulo}${done ? ' · CONCLUÍDA' : ''}`,
  path: ROUTES.lesson(aula.id),
});

export const buildCommandItems = ({
  query,
  lista,
  feitas,
  notas,
  toggleTheme,
  openBackup,
}: BuildCommandItemsOptions): CommandItem[] => {
  const normalized = query.trim().toLowerCase();

  const quickActions: CommandItem[] = [
    {
      key: 'go-dashboard',
      title: 'Painel Geral',
      sub: 'Cobertura do edital, constância e sessão',
      path: ROUTES.dashboard,
    },
    {
      key: 'go-edital',
      title: 'Edital Verticalizado',
      sub: 'Matriz de disciplinas e revisões R1/R2/R3',
      path: ROUTES.edital,
    },
    {
      key: 'go-revisions',
      title: 'Agenda de Revisões',
      sub: 'Ciclos de 24h, 7d, 30d e caderno de erros',
      path: ROUTES.revisions,
    },
    {
      key: 'go-notebook',
      title: 'Caderno de Anotações',
      sub: 'Índice unificado de resumos',
      path: ROUTES.notebook,
    },
    {
      key: 'go-guide',
      title: 'Guia Diretor PCCE',
      sub: 'Estratégia, ciclos, edital e TAF',
      path: ROUTES.guide,
    },
    {
      key: 'cmd-theme',
      title: 'Alternar Tema (Editorial Paper / Carbon)',
      sub: 'Mudar aparência da interface',
      run: toggleTheme,
    },
    {
      key: 'cmd-backup',
      title: 'Backup e Exportação de Dados',
      sub: 'Salvar ou restaurar arquivo JSON',
      run: openBackup,
    },
  ];

  const matchedActions = quickActions.filter(
    (action) =>
      !normalized ||
      action.title.toLowerCase().includes(normalized) ||
      action.sub.toLowerCase().includes(normalized),
  );

  const matchedLessons = normalized
    ? lista
        .filter(
          (aula) =>
            aula.titulo.toLowerCase().includes(normalized) ||
            aula.id.toLowerCase().includes(normalized) ||
            aula.modulo.titulo.toLowerCase().includes(normalized) ||
            (notas[aula.id] ?? '').toLowerCase().includes(normalized),
        )
        .slice(0, MAX_LESSON_MATCHES)
        .map((aula) => lessonItem(aula, !!feitas[aula.id]))
    : [];

  const defaultLessons = normalized
    ? []
    : lista.slice(0, DEFAULT_LESSON_COUNT).map((aula) => lessonItem(aula, false));

  return [...matchedLessons, ...matchedActions, ...defaultLessons].slice(0, MAX_RESULTS);
};
