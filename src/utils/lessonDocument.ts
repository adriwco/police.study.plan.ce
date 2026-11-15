import { marked } from 'marked';

import { padIndex } from '@/utils/dateUtils';
import { sanitizeHtmlTree } from '@/utils/sanitizeHtml';

export interface TocItem {
  id: string;
  title: string;
  num: string;
}

export interface LessonDocument {
  html: string;
  metaPills: string[];
  toc: TocItem[];
  quizCount: number;
}

export const slugifyHeading = (text: string) =>
  text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-');

const extractMetaPills = (container: HTMLElement) => {
  const firstBlockquote = container.querySelector('blockquote');
  if (!firstBlockquote) return [];
  const text = firstBlockquote.textContent?.trim() ?? '';
  const lowered = text.toLowerCase();
  if (!lowered.includes('tempo') && !lowered.includes('pré-requisito')) return [];
  firstBlockquote.remove();
  return text
    .split('·')
    .map((part) => part.trim())
    .filter(Boolean);
};

const wrapTables = (container: HTMLElement) => {
  container.querySelectorAll('table').forEach((table) => {
    if (table.parentElement?.classList.contains('table-scroll-wrap')) return;
    const wrapper = container.ownerDocument.createElement('div');
    wrapper.className = 'table-scroll-wrap';
    wrapper.setAttribute('role', 'region');
    wrapper.setAttribute('aria-label', 'Tabela de dados');
    wrapper.setAttribute('tabindex', '0');
    table.parentNode?.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });
};

const numberSections = (container: HTMLElement) => {
  const documentRef = container.ownerDocument;
  const toc: TocItem[] = [];
  container.querySelectorAll('h1, h2, h3').forEach((heading, index) => {
    const title = heading.textContent?.trim() ?? '';
    if (!heading.id) heading.id = slugifyHeading(title) || `secao-${index}`;
    if (heading.tagName !== 'H2') return;
    const num = padIndex(toc.length + 1);
    const tag = documentRef.createElement('span');
    tag.className = 'sec-num-tag';
    tag.textContent = `§ ${num}`;
    const label = documentRef.createElement('span');
    label.textContent = title;
    heading.replaceChildren(tag, label);
    toc.push({ id: heading.id, title, num });
  });
  return toc;
};

const prepareQuizCards = (container: HTMLElement) => {
  const documentRef = container.ownerDocument;
  const detailsList = Array.from(container.querySelectorAll('details'));
  if (detailsList.length === 0) return 0;

  const banner = documentRef.createElement('div');
  banner.className = 'quiz-score-banner';
  banner.setAttribute('data-quiz-banner', '');
  const firstDetails = detailsList[0];
  const insertRef = firstDetails.previousElementSibling ?? firstDetails;
  insertRef.parentNode?.insertBefore(banner, insertRef);

  detailsList.forEach((details, index) => {
    const qNum = String(index + 1);
    const card = documentRef.createElement('div');
    card.className = 'quiz-card';
    card.id = `quiz-card-${qNum}`;
    card.setAttribute('data-quiz-card', qNum);

    const previous = details.previousElementSibling;
    details.parentNode?.insertBefore(card, details);
    if (previous?.tagName === 'P') card.appendChild(previous);
    card.appendChild(details);

    const summary = details.querySelector('summary');
    if (summary) summary.textContent = 'Conferir gabarito comentado';

    const evalBar = documentRef.createElement('div');
    evalBar.className = 'quiz-eval-bar';
    evalBar.setAttribute('data-quiz-eval', qNum);
    details.appendChild(evalBar);
  });

  return detailsList.length;
};

export const buildLessonDocument = (markdown: string): LessonDocument => {
  const rendered = marked.parse(markdown, { async: false }) as string;
  const parsed = new DOMParser().parseFromString(`<div>${rendered}</div>`, 'text/html');
  const container = parsed.body.firstElementChild as HTMLElement;
  sanitizeHtmlTree(container);
  const metaPills = extractMetaPills(container);
  wrapTables(container);
  const toc = numberSections(container);
  const quizCount = prepareQuizCards(container);
  return { html: container.innerHTML, metaPills, toc, quizCount };
};
