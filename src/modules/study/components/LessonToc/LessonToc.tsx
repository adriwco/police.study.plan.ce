import { useActiveHeading } from '@/hooks/useActiveHeading';
import { TocItem } from '@/utils/lessonDocument';
import { scrollToElement } from '@/utils/smoothScroll';

interface LessonTocProps {
  items: TocItem[];
}

const LessonToc = ({ items }: LessonTocProps) => {
  const activeId = useActiveHeading(items.map((item) => item.id));

  return (
    <ul id="lesson-toc-list" className="toc-list">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className={`toc-link ${activeId === item.id ? 'active' : ''}`}
            onClick={(event) => {
              event.preventDefault();
              scrollToElement(document.getElementById(item.id));
            }}
          >
            <span className="mr-1.5 font-mono text-[0.68rem] opacity-65">{item.num}</span>
            {item.title}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default LessonToc;
