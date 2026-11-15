import { GUIDE_FILE } from '@/constants/navigation';
import { buildLessonDocument, LessonDocument } from '@/utils/lessonDocument';

const NOT_FOUND_MARKDOWN = '# Conteúdo não encontrado';

const markdownLoaders = import.meta.glob<string>(
  ['/aulas/**/*.md', '/GUIA-COMPLETO-PCCE.md'],
  {
    query: '?raw',
    import: 'default',
  },
);

const documentCache = new Map<string, LessonDocument>();

const toLoaderKey = (file: string) => (file.startsWith('/') ? file : `/${file}`);

export const getCachedDocument = (file: string) => documentCache.get(file);

export const loadDocument = async (file: string) => {
  const cached = documentCache.get(file);
  if (cached) return cached;
  const loader = markdownLoaders[toLoaderKey(file)];
  const markdown = loader ? await loader() : NOT_FOUND_MARKDOWN;
  const lessonDocument = buildLessonDocument(markdown);
  documentCache.set(file, lessonDocument);
  return lessonDocument;
};

export const prefetchDocument = (file?: string | null) => {
  if (!file || documentCache.has(file)) return;
  const run = () => {
    loadDocument(file).catch(() => undefined);
  };
  if ('requestIdleCallback' in window) window.requestIdleCallback(run);
  else setTimeout(run, 600);
};

export const loadGuideDocument = () => loadDocument(GUIDE_FILE);
