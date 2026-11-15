import { accentStyles, type Accent } from '@/lib/accents';

export interface TrendPoint {
  label: string;
  score: number;
}

interface TrendChartProps {
  title: string;
  points: TrendPoint[];
  accent?: Accent;
}

const PADDING = 10;

export const TrendChart = ({ title, points, accent = 'sage' }: TrendChartProps) => {
  const styles = accentStyles[accent];
  const scores = points.map((p) => p.score);
  const min = Math.min(...scores) - PADDING;
  const max = Math.max(...scores) + PADDING;
  const count = points.length;

  const toX = (index: number) => ((index + 0.5) / count) * 100;
  const toY = (score: number) => 100 - ((score - min) / (max - min)) * 100;

  const polyline = points.map((p, i) => `${toX(i)},${toY(p.score)}`).join(' ');
  const summary = points.map((p) => `${p.label} ${p.score}`).join(', ');

  return (
    <article className="rounded-card border border-line bg-surface p-4 shadow-card sm:p-6">
      <h3 className="sr-only">{title}</h3>
      <div role="img" aria-label={`${title}: ${summary}`}>
        <div className="relative h-24">
          <div aria-hidden="true" className="absolute inset-0 flex flex-col justify-between">
            <span className="h-px bg-line" />
            <span className="h-px bg-line" />
            <span className="h-px bg-line" />
          </div>
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 size-full overflow-visible"
            aria-hidden="true"
          >
            <polyline
              points={polyline}
              fill="none"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              className={styles.stroke}
            />
          </svg>
          {points.map((p, i) => (
            <span
              key={p.label}
              aria-hidden="true"
              className={`absolute size-2.5 -translate-x-1/2 translate-y-1/2 rounded-full ${styles.bar}`}
              style={{ left: `${toX(i)}%`, bottom: `${100 - toY(p.score)}%` }}
            />
          ))}
        </div>
        <div
          className="mt-3 grid text-center"
          style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}
        >
          {points.map((p) => (
            <span key={p.label} className="text-xs uppercase text-ink-muted">
              {p.label}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};
