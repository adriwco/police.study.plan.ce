export const omitKey = <T extends Record<string, unknown>>(record: T, key: string): T => {
  const copy = { ...record };
  delete copy[key];
  return copy;
};
