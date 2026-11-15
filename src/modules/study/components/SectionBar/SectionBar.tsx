import React from 'react';

interface SectionBarProps {
  kicker: string;
  title: React.ReactNode;
  as?: 'h1' | 'h2';
  children?: React.ReactNode;
  className?: string;
}

const SectionBar = ({
  kicker,
  title,
  as: Heading = 'h1',
  children,
  className = '',
}: SectionBarProps) => (
  <div className={`section-bar ${className}`}>
    <div>
      <span className="section-kicker">{kicker}</span>
      <Heading className="section-title">{title}</Heading>
    </div>
    {children}
  </div>
);

export default SectionBar;
