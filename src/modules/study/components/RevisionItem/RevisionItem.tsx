import React from 'react';

import { Link } from 'react-router-dom';

interface RevisionItemProps {
  to: string;
  title: string;
  children?: React.ReactNode;
  action: React.ReactNode;
  className?: string;
}

const RevisionItem = ({
  to,
  title,
  children,
  action,
  className = '',
}: RevisionItemProps) => (
  <div className={`rev-item-mini ${className}`}>
    <div className="rev-item-info">
      <Link to={to} className="rev-item-title">
        {title}
      </Link>
      {children ? <div className="rev-item-sub">{children}</div> : null}
    </div>
    {action}
  </div>
);

export default RevisionItem;
