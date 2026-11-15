import { RevisionCycleKey } from '@/types/study';

export const REVISION_CYCLES: { key: RevisionCycleKey; days: number; label: string }[] = [
  { key: 'r1', days: 1, label: '24h' },
  { key: 'r7', days: 7, label: '7d' },
  { key: 'r30', days: 30, label: '30d' },
];

export const REVISION_CHIPS: { key: RevisionCycleKey; label: string }[] = [
  { key: 'r1', label: 'R1·24H' },
  { key: 'r7', label: 'R2·7D' },
  { key: 'r30', label: 'R3·30D' },
];
