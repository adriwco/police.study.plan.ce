import React from 'react';

interface RevisionPanelProps {
  index: string;
  tag: string;
  emptyMessage: string;
  children: React.ReactNode[];
}

const RevisionPanel = ({ index, tag, emptyMessage, children }: RevisionPanelProps) => (
  <section className="module-cell justify-start">
    <div className="module-cell-top">
      <span className="module-index">{index}</span>
      <span className="module-weight-tag">{tag}</span>
    </div>
    <div className="rev-list-mini">
      {children.length ? (
        children
      ) : (
        <p className="m-0 text-[0.84rem] text-ink-muted">{emptyMessage}</p>
      )}
    </div>
  </section>
);

export default RevisionPanel;
