interface ProgressTrackProps {
  pct: number;
  accent?: boolean;
  fillId?: string;
}

const ProgressTrack = ({ pct, accent = true, fillId }: ProgressTrackProps) => (
  <div className="progress-track">
    <div
      id={fillId}
      className={`progress-fill ${accent ? 'accent' : ''}`}
      style={{ width: `${pct}%` }}
    />
  </div>
);

export default ProgressTrack;
