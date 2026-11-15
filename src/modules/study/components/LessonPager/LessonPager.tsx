import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/navigation';
import { Lesson } from '@/types/study';

interface LessonPagerProps {
  previous?: Lesson;
  next?: Lesson;
}

const LessonPager = ({ previous, next }: LessonPagerProps) => (
  <nav className="lesson-pager" aria-label="Navegação entre aulas">
    {previous ? (
      <Link className="pager-card prev" to={ROUTES.lesson(previous.id)}>
        <span className="pager-dir">← Anterior · {previous.id}</span>
        <span className="pager-title">{previous.titulo}</span>
      </Link>
    ) : (
      <div className="pager-card" />
    )}
    {next ? (
      <Link className="pager-card next" to={ROUTES.lesson(next.id)}>
        <span className="pager-dir">Próxima · {next.id} →</span>
        <span className="pager-title">{next.titulo}</span>
      </Link>
    ) : (
      <div className="pager-card" />
    )}
  </nav>
);

export default LessonPager;
