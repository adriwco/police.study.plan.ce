export const ROUTES = {
  dashboard: '/',
  edital: '/edital',
  revisions: '/revisoes',
  notebook: '/caderno',
  guide: '/guia',
  lesson: (lessonId: string) => `/aula/${lessonId}`,
} as const;

export const SIDEBAR_SECTIONS = [
  { index: '01', label: 'Painel Geral', to: ROUTES.dashboard, counter: null },
  { index: '02', label: 'Edital Verticalizado', to: ROUTES.edital, counter: null },
  {
    index: '03',
    label: 'Revisões (24h·7d·30d)',
    to: ROUTES.revisions,
    counter: 'revisions',
  },
  { index: '04', label: 'Caderno de Notas', to: ROUTES.notebook, counter: 'notes' },
  { index: '05', label: 'Guia Diretor PCCE', to: ROUTES.guide, counter: null },
] as const;

export const FONT_SCALE_LABELS = {
  sm: 'Escala tipográfica: 94%',
  md: 'Escala tipográfica: 100%',
  lg: 'Escala tipográfica: 114%',
  xl: 'Escala tipográfica: 125%',
} as const;

export const FONT_SCALE_ORDER = ['sm', 'md', 'lg', 'xl'] as const;

export const GUIDE_FILE = 'GUIA-COMPLETO-PCCE.md';
