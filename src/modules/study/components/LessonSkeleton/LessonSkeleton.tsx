const SKELETON_LINES = [
  { width: '45%', height: 28 },
  { width: '90%' },
  { width: '82%' },
  { width: '86%' },
  { width: '60%' },
];

const LessonSkeleton = () => (
  <div className="lesson-workspace">
    <div className="lesson-article">
      <div className="skeleton-wrap" aria-busy="true" aria-label="Carregando aula">
        {SKELETON_LINES.map((line, index) => (
          <div key={index} className="skeleton-line" style={line} />
        ))}
      </div>
    </div>
  </div>
);

export default LessonSkeleton;
