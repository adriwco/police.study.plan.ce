import { BlockFilter, BlockId, ModuleMeta } from '@/types/study';

export const MODULE_META: Record<string, ModuleMeta> = {
  '00': { block: 'base', blockLabel: 'Base & Método', weight: 'Método obrigatório' },
  '01': { block: 'base', blockLabel: 'Base & Método', weight: 'Base do Direito' },
  '02': { block: 'base', blockLabel: 'Base & Método', weight: 'Base Exatas' },
  '03': { block: 'basicas', blockLabel: 'Básicas · 30q', weight: '10 questões' },
  '04': { block: 'basicas', blockLabel: 'Básicas · 30q', weight: '10 questões' },
  '05': { block: 'basicas', blockLabel: 'Básicas · 30q', weight: '10 questões' },
  '06': { block: 'juridico', blockLabel: 'Jurídico · 50q', weight: '8 questões' },
  '07': { block: 'juridico', blockLabel: 'Jurídico · 50q', weight: '8 questões' },
  '08': { block: 'juridico', blockLabel: 'Jurídico · 50q', weight: '8 questões · Penal' },
  '09': { block: 'juridico', blockLabel: 'Jurídico · 50q', weight: '8 questões · Penal' },
  '10': { block: 'juridico', blockLabel: 'Jurídico · 50q', weight: '8 questões' },
  '11': { block: 'juridico', blockLabel: 'Jurídico · 50q', weight: '8 questões' },
  '12': {
    block: 'juridico',
    blockLabel: 'Jurídico · 50q',
    weight: '10 questões · Desempate',
  },
  '13': { block: 'especificas', blockLabel: 'Específicas · 20q', weight: '5 questões' },
  '14': { block: 'especificas', blockLabel: 'Específicas · 20q', weight: '5 questões' },
  '15': { block: 'especificas', blockLabel: 'Específicas · 20q', weight: '5 questões' },
  '16': { block: 'especificas', blockLabel: 'Específicas · 20q', weight: '5 questões' },
  '17': {
    block: 'final',
    blockLabel: 'Redação & Reta Final',
    weight: 'Discursiva · 30 pts',
  },
  '18': { block: 'final', blockLabel: 'Redação & Reta Final', weight: 'Simulados & TAF' },
};

export const DEFAULT_MODULE_META: ModuleMeta = {
  block: 'base',
  blockLabel: 'Base',
  weight: 'Curso',
};

export const BLOCK_METRICS: { id: BlockId; name: string }[] = [
  { id: 'juridico', name: 'Jurídico (50q)' },
  { id: 'basicas', name: 'Básicas (30q)' },
  { id: 'especificas', name: 'Específicas (20q)' },
  { id: 'base', name: 'Base & Método' },
];

export const HOME_BLOCK_TABS: { id: BlockFilter; label: string }[] = [
  { id: 'all', label: 'Todos (19)' },
  { id: 'base', label: 'Base (03)' },
  { id: 'basicas', label: 'Básicas · 30q (03)' },
  { id: 'juridico', label: 'Jurídico · 50q (07)' },
  { id: 'especificas', label: 'Específicas · 20q (04)' },
  { id: 'final', label: 'Discursiva & TAF (02)' },
];

export const EDITAL_BLOCK_TABS: { id: BlockFilter; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'juridico', label: 'Jurídico (50q)' },
  { id: 'basicas', label: 'Básicas (30q)' },
  { id: 'especificas', label: 'Específicas (20q)' },
  { id: 'base', label: 'Base (0–2)' },
  { id: 'final', label: 'Redação & TAF' },
];
