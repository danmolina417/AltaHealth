import { accentStyles, type Accent } from '@/lib/accents';

interface AreaSparklineProps {
  values: number[];
  label: string;
  accent?: Accent;
}

const PADDING = 5;

/** Small filled line chart that fills its container's width. */
export const AreaSparkline = ({ values, label, accent = 'forest' }: AreaSparklineProps) => {
  const styles = accentStyles[accent];
  const min = Math.min(...values) - PADDING;
  const max = Math.max(...values) + PADDING;
  const lastIndex = Math.max(values.length - 1, 1);

  const toX = (index: number) => (index / lastIndex) * 100;
  const toY = (value: number) => 100 - ((value - min) / (max - min)) * 100;

  const line = values.map((v, i) => `${toX(i)},${toY(v)}`).join(' ');

  return (
    <div role="img" aria-label={`${label}: ${values.join(', ')}`} className="relative mx-1 h-16">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full overflow-visible"
        aria-hidden="true"
      >
        <polygon
          points={`0,100 ${line} 100,100`}
          fill="currentColor"
          className={`${styles.text} opacity-15`}
        />
        <polyline
          points={line}
          fill="none"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className={styles.stroke}
        />
      </svg>
      {values.map((v, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`absolute size-2 -translate-x-1/2 translate-y-1/2 rounded-full ${styles.bar}`}
          style={{ left: `${toX(i)}%`, bottom: `${100 - toY(v)}%` }}
        />
      ))}
    </div>
  );
};
