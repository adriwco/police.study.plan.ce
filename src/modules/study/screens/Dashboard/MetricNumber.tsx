import { useCountUp } from '@/hooks/useCountUp';

interface MetricNumberProps {
  value: number;
  animate: boolean;
}

const MetricNumber = ({ value, animate }: MetricNumberProps) => {
  const displayed = useCountUp(value, animate);
  return <span className="cine-count">{displayed}</span>;
};

export default MetricNumber;
