import { describe, expect, it } from 'vitest';

import { buildLessonDocument, slugifyHeading } from '@/utils/lessonDocument';

const MARKDOWN = `# Título da aula

> Tempo: 30 minutos · Pré-requisito: Módulo 0

## Por que importa

Texto com [link externo](https://exemplo.com) e <img src="x" onerror="alert(1)">.

<script>alert(1)</script>

| A | B |
|---|---|
| 1 | 2 |

## Teste-se

Pergunta 1?

<details><summary>Resposta</summary>Gabarito 1</details>

Pergunta 2?

<details><summary>Resposta</summary>Gabarito 2</details>
`;

const parse = (html: string) => {
  const container = document.createElement('div');
  container.innerHTML = html;
  return container;
};

describe('buildLessonDocument', () => {
  const lessonDocument = buildLessonDocument(MARKDOWN);
  const container = parse(lessonDocument.html);

  it('move a citação de tempo e pré-requisito para as etiquetas da aula', () => {
    expect(lessonDocument.metaPills).toEqual([
      'Tempo: 30 minutos',
      'Pré-requisito: Módulo 0',
    ]);
    expect(container.querySelector('blockquote')).toBeNull();
  });

  it('numera as seções H2 e monta o sumário', () => {
    expect(lessonDocument.toc).toEqual([
      { id: 'por-que-importa', title: 'Por que importa', num: '01' },
      { id: 'teste-se', title: 'Teste-se', num: '02' },
    ]);
    expect(container.querySelector('#por-que-importa .sec-num-tag')).toHaveTextContent(
      '§ 01',
    );
  });

  it('remove scripts e manipuladores de evento e abre links externos em nova aba', () => {
    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('img')?.hasAttribute('onerror')).toBe(false);
    const link = container.querySelector('a[href="https://exemplo.com"]');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('envolve tabelas em região com rolagem acessível', () => {
    const wrapper = container.querySelector('.table-scroll-wrap');
    expect(wrapper).toHaveAttribute('role', 'region');
    expect(wrapper?.querySelector('table')).not.toBeNull();
  });

  it('transforma cada gabarito em cartão de questão com espaço para autoavaliação', () => {
    expect(lessonDocument.quizCount).toBe(2);
    expect(container.querySelector('[data-quiz-banner]')).not.toBeNull();
    const card = container.querySelector('[data-quiz-card="2"]');
    expect(card?.querySelector('p')).toHaveTextContent('Pergunta 2?');
    expect(card?.querySelector('summary')).toHaveTextContent(
      'Conferir gabarito comentado',
    );
    expect(card?.querySelector('[data-quiz-eval="2"]')).not.toBeNull();
  });

  it('gera slugs sem pontuação preservando acentos', () => {
    expect(slugifyHeading(' Direito, objetivo & subjetivo! ')).toBe(
      'direito-objetivo-subjetivo',
    );
  });
});
