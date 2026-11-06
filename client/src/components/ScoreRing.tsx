import { accentStyles, type Accent } from '../lib/accents';

interface ScoreRingProps {
  score: number;
  max?: number;
  /** Accessible description, e.g. "Dental health score 82 out of 100". */
  label: string;
  accent?: Accent;
  showMax?: boolean;
  /** Size utilities for the ring, e.g. "size-44". */
  className?: string;
  /** Typography utilities for the centered value. */
  valueClassName?: string;
}

const RADIUS = 45;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const ScoreRing = ({
  score,
  max = 100,
  label,
  accent = 'sage',
  showMax = false,
  className = 'size-44',
  valueClassName = 'text-5xl font-semibold text-ink',
}: ScoreRingProps) => {
  const ratio = Math.min(Math.max(score / max, 0), 1);

  return (
    <div role="img" aria-label={label} className={`relative ${className}`}>
      <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r={RADIUS} fill="none" strokeWidth="7" className="stroke-line" />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          strokeWidth="7"
          strokeDasharray={`${ratio * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          className={accentStyles[accent].stroke}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={valueClassName}>{score}</span>
        {showMax && <span className="text-sm font-medium text-ink-muted">/ {max}</span>}
      </div>
    </div>
  );
};
