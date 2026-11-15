import { useEffect, useState } from 'react';

import { getCachedDocument, loadDocument } from '@/service/markdownService';
import { LessonDocument } from '@/utils/lessonDocument';

export const useLessonDocument = (file: string | null | undefined) => {
  const [lessonDocument, setLessonDocument] = useState<LessonDocument | undefined>(() =>
    file ? getCachedDocument(file) : undefined,
  );

  useEffect(() => {
    if (!file) return undefined;
    let active = true;
    const cached = getCachedDocument(file);
    if (cached) {
      setLessonDocument(cached);
      return undefined;
    }
    loadDocument(file).then((loaded) => {
      if (active) setLessonDocument(loaded);
    });
    return () => {
      active = false;
    };
  }, [file]);

  return lessonDocument;
};
