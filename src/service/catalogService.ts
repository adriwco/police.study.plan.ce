import { DEFAULT_MODULE_META, MODULE_META } from '@/constants/moduleMeta';
import { Catalog, Lesson, RawTrilha } from '@/types/study';

import trilhaJson from '../../aulas/trilha.json';

export const buildCatalog = (raw: RawTrilha): Catalog => {
  const modulos = raw.modulos.map((modulo) => ({
    ...modulo,
    meta: MODULE_META[modulo.id] ?? DEFAULT_MODULE_META,
  }));
  const lista: Lesson[] = modulos.flatMap((modulo) =>
    modulo.aulas.map((aula, index) => ({ ...aula, ordemNoModulo: index + 1, modulo })),
  );
  return { modulos, lista };
};

export const catalog = buildCatalog(trilhaJson as RawTrilha);

export const findLessonIndex = (lessonId: string, lista: Lesson[] = catalog.lista) =>
  lista.findIndex((aula) => aula.id === lessonId);

export const findLesson = (lessonId: string, lista: Lesson[] = catalog.lista) =>
  lista.find((aula) => aula.id === lessonId);

export const findNeighbourLessons = (
  lessonId: string,
  lista: Lesson[] = catalog.lista,
) => {
  const index = findLessonIndex(lessonId, lista);
  if (index < 0) return { previous: undefined, next: undefined };
  return {
    previous: lista
      .slice(0, index)
      .reverse()
      .find((aula) => aula.arquivo),
    next: lista.slice(index + 1).find((aula) => aula.arquivo),
  };
};
