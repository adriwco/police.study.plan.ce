import { NOTE_SNIPPETS } from '@/constants/noteSnippets';
import { formatBrDate, todayIso } from '@/utils/dateUtils';

const slashRules = (today: string) => [
  { trigger: '/resumo ', text: NOTE_SNIPPETS.resumo },
  { trigger: '/lei ', text: NOTE_SNIPPETS.lei },
  { trigger: '/pegadinha ', text: NOTE_SNIPPETS.pegadinha },
  { trigger: '/check ', text: NOTE_SNIPPETS.check },
  { trigger: '/hoje ', text: `[${formatBrDate(today)}] ` },
];

export const applySlashCommands = (value: string, today = todayIso()) => {
  const rule = slashRules(today).find((candidate) => value.includes(candidate.trigger));
  if (!rule) return { value, expanded: false };
  return { value: value.replace(rule.trigger, rule.text), expanded: true };
};

export const insertSnippet = (
  value: string,
  snippet: string,
  start: number,
  end: number,
) => {
  const prefix = value.length > 0 && !value.endsWith('\n') ? '\n\n' : '';
  return value.slice(0, start) + prefix + snippet + value.slice(end);
};
