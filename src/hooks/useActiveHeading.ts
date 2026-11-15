import { useEffect, useState } from 'react';

export const useActiveHeading = (headingIds: string[]) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const idsKey = headingIds.join('|');

  useEffect(() => {
    const ids = idsKey ? idsKey.split('|') : [];
    if (!('IntersectionObserver' in window) || ids.length === 0) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-85px 0px -70% 0px', threshold: 0 },
    );
    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [idsKey]);

  return activeId;
};
