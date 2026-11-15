import { useCallback, useState } from 'react';

import { readStorage, writeStorage } from '@/utils/storage';

type Updater<T> = T | ((previous: T) => T);

export const usePersistentState = <T>(
  key: string,
  fallback: T | (() => T),
  normalize?: (stored: T) => T,
) => {
  const [value, setValue] = useState<T>(() => {
    const stored = readStorage(
      key,
      typeof fallback === 'function' ? (fallback as () => T)() : fallback,
    );
    if (!normalize) return stored;
    const normalized = normalize(stored);
    writeStorage(key, normalized);
    return normalized;
  });

  const update = useCallback(
    (next: Updater<T>) => {
      setValue((previous) => {
        const resolved =
          typeof next === 'function' ? (next as (previous: T) => T)(previous) : next;
        writeStorage(key, resolved);
        return resolved;
      });
    },
    [key],
  );

  return [value, update] as const;
};
