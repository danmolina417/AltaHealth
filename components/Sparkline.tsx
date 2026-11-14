import { accentStyles, type Accent } from '@/lib/accents';

interface SparklineProps {
  values: number[];
  label: string;
  accent?: Accent;
}

const WIDTH = 96;
const HEIGHT = 24;
const PAD = 3;

export const Sparkline = ({ values, label, accent = 'forest' }: SparklineProps) => {
  const styles = accentStyles[accent];
  const min = Math.min(...values);
  const range = Math.max(...values) - min || 1;
  const step = values.length > 1 ? (WIDTH - PAD * 2) / (values.length - 1) : 0;

  const coords = values.map((value, i) => ({
    x: PAD + i * step,
    y: PAD + (1 - (value - min) / range) * (HEIGHT - PAD * 2),
  }));

  return (
    <svg
      role="img"
      aria-label={`${label} trend`}
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
    >
      <polyline
        points={coords.map(({ x, y }) => `${x},${y}`).join(' ')}
        fill="none"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        className={styles.stroke}
      />
      {coords.map(({ x, y }, i) => (
        <circle key={i} cx={x} cy={y} r="2" fill="currentColor" className={styles.text} />
      ))}
    </svg>
  );
};
