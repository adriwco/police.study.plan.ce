const pad = (value: number) => String(value).padStart(2, '0');

const toIso = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const todayIso = () => toIso(new Date());

export const addDaysIso = (baseIso: string, days: number) => {
  const parts = String(baseIso).split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return todayIso();
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  date.setDate(date.getDate() + days);
  return toIso(date);
};

export const formatBrDate = (iso?: string | null) => {
  if (!iso) return '';
  const parts = iso.slice(0, 10).split('-');
  if (parts.length !== 3) return iso;
  return `${parts[2]}.${parts[1]}.${parts[0]}`;
};

export const formatClock = (date: Date) =>
  `${pad(date.getHours())}:${pad(date.getMinutes())}`;

export const formatSeconds = (totalSeconds: number) =>
  `${pad(Math.floor(totalSeconds / 60))}:${pad(totalSeconds % 60)}`;

export const padIndex = (value: number) => pad(value);
