import { CompletedMap, FavoriteMap, RawLesson, StudyModule } from '@/types/study';

export type SidebarChip = 'all' | 'pending' | 'done' | 'fav';

interface SidebarFilterOptions {
  query: string;
  chip: SidebarChip;
  feitas: CompletedMap;
  favoritos: FavoriteMap;
}

export const filterModuleLessons = (
  modulo: StudyModule,
  { query, chip, feitas, favoritos }: SidebarFilterOptions,
): RawLesson[] => {
  const normalizedQuery = query.trim().toLowerCase();
  return modulo.aulas.filter((aula) => {
    if (chip === 'pending' && feitas[aula.id]) return false;
    if (chip === 'done' && !feitas[aula.id]) return false;
    if (chip === 'fav' && !favoritos[aula.id]) return false;
    if (!normalizedQuery) return true;
    return (
      aula.titulo.toLowerCase().includes(normalizedQuery) ||
      aula.id.toLowerCase().includes(normalizedQuery) ||
      modulo.titulo.toLowerCase().includes(normalizedQuery)
    );
  });
};
