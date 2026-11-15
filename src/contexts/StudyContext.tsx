import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { noteStorageKey, STORAGE_KEYS } from '@/constants/storageKeys';
import { useToast } from '@/contexts/ToastContext';
import { usePersistentState } from '@/hooks/usePersistentState';
import { catalog } from '@/service/catalogService';
import {
  BackupPayload,
  CompletedMap,
  FavoriteMap,
  Lesson,
  NoteMap,
  OpenModulesMap,
  QuestionMap,
  QuestionResult,
  RevisionCycleKey,
  RevisionMap,
  StudyDaysMap,
} from '@/types/study';
import { todayIso } from '@/utils/dateUtils';
import { omitKey } from '@/utils/recordUtils';
import { readStorage, writeStorage } from '@/utils/storage';
import { mergeStudyDaysFromCompleted } from '@/utils/studyMetrics';

export interface NoteEntry {
  aula: Lesson;
  text: string;
}

interface StudyContextProps {
  feitas: CompletedMap;
  dias: StudyDaysMap;
  revisoes: RevisionMap;
  favoritos: FavoriteMap;
  questoes: QuestionMap;
  notas: NoteMap;
  abertos: OpenModulesMap;
  ultimaAula: string | null;
  notesList: NoteEntry[];
  toggleCompleted: (lessonId: string) => void;
  toggleRevision: (lessonId: string, cycleKey: RevisionCycleKey) => void;
  toggleFavorite: (lessonId: string) => void;
  evaluateQuestion: (lessonId: string, qNum: number, result: QuestionResult) => void;
  setNote: (lessonId: string, text: string) => void;
  toggleModule: (moduleId: string) => void;
  setAllModulesOpen: (open: boolean) => void;
  visitLesson: (lesson: Lesson) => void;
  recordActivity: () => void;
  buildBackup: () => BackupPayload;
  restoreBackup: (data: unknown) => void;
}

const StudyContext = createContext<StudyContextProps | undefined>(undefined);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

const readAllNotes = (lista: Lesson[]) =>
  lista.reduce<NoteMap>((notes, aula) => {
    const text = readStorage<unknown>(noteStorageKey(aula.id), '');
    if (typeof text === 'string' && text) notes[aula.id] = text;
    return notes;
  }, {});

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toast = useToast();
  const { lista } = catalog;
  const [feitas, setFeitas] = usePersistentState<CompletedMap>(
    STORAGE_KEYS.completed,
    {},
  );
  const [dias, setDias] = usePersistentState<StudyDaysMap>(
    STORAGE_KEYS.studyDays,
    {},
    (stored) =>
      mergeStudyDaysFromCompleted(readStorage(STORAGE_KEYS.completed, {}), stored),
  );
  const [revisoes, setRevisoes] = usePersistentState<RevisionMap>(
    STORAGE_KEYS.revisions,
    {},
  );
  const [favoritos, setFavoritos] = usePersistentState<FavoriteMap>(
    STORAGE_KEYS.favorites,
    {},
  );
  const [questoes, setQuestoes] = usePersistentState<QuestionMap>(
    STORAGE_KEYS.questions,
    {},
  );
  const [abertos, setAbertos] = usePersistentState<OpenModulesMap>(
    STORAGE_KEYS.openModules,
    {
      '00': true,
      '01': true,
    },
  );
  const [ultimaAula, setUltimaAula] = usePersistentState<string | null>(
    STORAGE_KEYS.lastLesson,
    null,
  );
  const [notas, setNotas] = useState<NoteMap>(() => readAllNotes(lista));

  const recordActivity = useCallback(() => {
    const today = todayIso();
    setDias((previous) => (previous[today] ? previous : { ...previous, [today]: true }));
  }, [setDias]);

  const toggleCompleted = useCallback(
    (lessonId: string) => {
      if (feitas[lessonId]) {
        setFeitas((previous) => omitKey(previous, lessonId));
        toast('Aula reaberta como pendente');
        return;
      }
      setFeitas((previous) => ({ ...previous, [lessonId]: todayIso() }));
      recordActivity();
      toast('Aula concluída · Revisões 24h/7d/30d agendadas');
    },
    [feitas, recordActivity, setFeitas, toast],
  );

  const toggleRevision = useCallback(
    (lessonId: string, cycleKey: RevisionCycleKey) => {
      const isDone = !!revisoes[lessonId]?.[cycleKey];
      setRevisoes((previous) => {
        const record = { ...(previous[lessonId] ?? {}) };
        if (isDone) delete record[cycleKey];
        else record[cycleKey] = todayIso();
        return { ...previous, [lessonId]: record };
      });
      if (isDone) {
        toast('Ciclo de revisão desmarcado');
      } else {
        recordActivity();
        toast('Revisão registrada');
      }
    },
    [recordActivity, revisoes, setRevisoes, toast],
  );

  const toggleFavorite = useCallback(
    (lessonId: string) => {
      const isFavorite = !!favoritos[lessonId];
      setFavoritos((previous) => {
        if (!isFavorite) return { ...previous, [lessonId]: true };
        return omitKey(previous, lessonId);
      });
      toast(isFavorite ? 'Marcação removida' : 'Aula marcada ★');
    },
    [favoritos, setFavoritos, toast],
  );

  const evaluateQuestion = useCallback(
    (lessonId: string, qNum: number, result: QuestionResult) => {
      const key = `${lessonId}#${qNum}`;
      const isSame = questoes[key] === result;
      setQuestoes((previous) => {
        if (!isSame) return { ...previous, [key]: result };
        return omitKey(previous, key);
      });
      if (!isSame) recordActivity();
    },
    [questoes, recordActivity, setQuestoes],
  );

  const setNote = useCallback(
    (lessonId: string, text: string) => {
      writeStorage(noteStorageKey(lessonId), text);
      setNotas((previous) => ({ ...previous, [lessonId]: text }));
      recordActivity();
    },
    [recordActivity],
  );

  const toggleModule = useCallback(
    (moduleId: string) =>
      setAbertos((previous) => ({ ...previous, [moduleId]: !previous[moduleId] })),
    [setAbertos],
  );

  const setAllModulesOpen = useCallback(
    (open: boolean) =>
      setAbertos(Object.fromEntries(catalog.modulos.map((modulo) => [modulo.id, open]))),
    [setAbertos],
  );

  const visitLesson = useCallback(
    (lesson: Lesson) => {
      setAbertos((previous) =>
        previous[lesson.modulo.id] ? previous : { ...previous, [lesson.modulo.id]: true },
      );
      setUltimaAula(lesson.id);
    },
    [setAbertos, setUltimaAula],
  );

  const notesList = useMemo(
    () =>
      lista
        .map((aula) => ({ aula, text: (notas[aula.id] ?? '').trim() }))
        .filter((entry) => entry.text.length > 0),
    [lista, notas],
  );

  const buildBackup = useCallback(
    (): BackupPayload => ({
      version: 2,
      exportedAt: new Date().toISOString(),
      feitas,
      dias,
      revisoes,
      favoritos,
      questoes,
      notas: Object.fromEntries(
        notesList.map((entry) => [entry.aula.id, notas[entry.aula.id]]),
      ),
    }),
    [dias, favoritos, feitas, notas, notesList, questoes, revisoes],
  );

  const restoreBackup = useCallback(
    (data: unknown) => {
      if (!isRecord(data)) throw new Error('Formato inválido');
      if (isRecord(data.feitas)) setFeitas(data.feitas as CompletedMap);
      if (isRecord(data.revisoes)) setRevisoes(data.revisoes as RevisionMap);
      if (isRecord(data.favoritos)) setFavoritos(data.favoritos as FavoriteMap);
      if (isRecord(data.questoes)) setQuestoes(data.questoes as QuestionMap);
      const restoredDays = isRecord(data.dias) ? (data.dias as StudyDaysMap) : dias;
      const restoredCompleted = isRecord(data.feitas)
        ? (data.feitas as CompletedMap)
        : feitas;
      setDias(mergeStudyDaysFromCompleted(restoredCompleted, restoredDays));
      if (isRecord(data.notas)) {
        const restoredNotes = Object.entries(data.notas).filter(
          (entry): entry is [string, string] => typeof entry[1] === 'string',
        );
        restoredNotes.forEach(([lessonId, text]) =>
          writeStorage(noteStorageKey(lessonId), text),
        );
        setNotas((previous) => ({ ...previous, ...Object.fromEntries(restoredNotes) }));
      }
    },
    [dias, feitas, setDias, setFavoritos, setFeitas, setQuestoes, setRevisoes],
  );

  const value = useMemo(
    () => ({
      feitas,
      dias,
      revisoes,
      favoritos,
      questoes,
      notas,
      abertos,
      ultimaAula,
      notesList,
      toggleCompleted,
      toggleRevision,
      toggleFavorite,
      evaluateQuestion,
      setNote,
      toggleModule,
      setAllModulesOpen,
      visitLesson,
      recordActivity,
      buildBackup,
      restoreBackup,
    }),
    [
      feitas,
      dias,
      revisoes,
      favoritos,
      questoes,
      notas,
      abertos,
      ultimaAula,
      notesList,
      toggleCompleted,
      toggleRevision,
      toggleFavorite,
      evaluateQuestion,
      setNote,
      toggleModule,
      setAllModulesOpen,
      visitLesson,
      recordActivity,
      buildBackup,
      restoreBackup,
    ],
  );

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};
