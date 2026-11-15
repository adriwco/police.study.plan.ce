import { BlockFilter } from '@/types/study';

interface BlockTabsProps {
  tabs: { id: BlockFilter; label: string }[];
  value: BlockFilter;
  onChange: (value: BlockFilter) => void;
  label: string;
  className?: string;
}

const BlockTabs = ({ tabs, value, onChange, label, className = '' }: BlockTabsProps) => (
  <div className={`tabs-bar ${className}`} role="group" aria-label={label}>
    {tabs.map((tab) => (
      <button
        key={tab.id}
        type="button"
        className={`tab-btn ${value === tab.id ? 'active' : ''}`}
        aria-pressed={value === tab.id}
        onClick={() => onChange(tab.id)}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default BlockTabs;
