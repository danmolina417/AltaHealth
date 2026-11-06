import { accentStyles, type Accent } from '../lib/accents';

interface MetricTrendChartProps {
  title: string;
  unit?: string;
  values: number[];
  xLabels: string[];
  min: number;
  max: number;
  accent?: Accent;
}

const TICK_COUNT = 3;

const formatTick = (value: number) => String(Number(value.toFixed(2)));

/** Single-series line chart on a fixed value range, so charts for different metrics stay comparable over time. */
export const MetricTrendChart = ({
  title,
  unit,
  values,
  xLabels,
  min,
  max,
  accent = 'forest',
}: MetricTrendChartProps) => {
  const styles = accentStyles[accent];
  const count = xLabels.length;
  const toX = (index: number) => ((index + 0.5) / count) * 100;
  const toY = (value: number) =>
    100 - ((Math.min(Math.max(value, min), max) - min) / (max - min)) * 100;
  const ticks = Array.from(
    { length: TICK_COUNT },
    (_, i) => min + ((max - min) * i) / (TICK_COUNT - 1),
  );
  const summary = values.map((v, i) => `${xLabels[i]} ${v}`).join(', ');

  return (
    <article className="rounded-card border border-line bg-surface p-5 shadow-card sm:p-6">
      <h3 className="font-serif text-lg sm:text-xl">
        {title}
        {unit ? <span className="ml-2 font-sans text-sm text-ink-muted">({unit})</span> : null}
      </h3>
      <div
        role="img"
        aria-label={`${title} over time, range ${min} to ${max}: ${summary}`}
        className="mt-4"
      >
        <div className="flex">
          <div className="relative h-40 w-10 shrink-0" aria-hidden="true">
            {ticks.map((tick) => (
              <span
                key={tick}
                className="absolute right-2 translate-y-1/2 text-xs text-ink-muted"
                style={{ bottom: `${100 - toY(tick)}%` }}
              >
                {formatTick(tick)}
              </span>
            ))}
          </div>
          <div className="relative h-40 flex-1 border-b border-l border-line" aria-hidden="true">
            {ticks.slice(1).map((tick) => (
              <span
                key={tick}
                className="absolute inset-x-0 h-px bg-line/60"
                style={{ bottom: `${100 - toY(tick)}%` }}
              />
            ))}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 size-full overflow-visible"
            >
              <polyline
                points={values.map((v, i) => `${toX(i)},${toY(v)}`).join(' ')}
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
                key={xLabels[i]}
                className={`absolute size-2.5 -translate-x-1/2 translate-y-1/2 rounded-full ${styles.bar}`}
                style={{ left: `${toX(i)}%`, bottom: `${100 - toY(v)}%` }}
              />
            ))}
          </div>
        </div>
        <div
          className="mt-2 ml-10 grid text-center"
          style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}
          aria-hidden="true"
        >
          {xLabels.map((label) => (
            <span key={label} className="text-xs text-ink-muted">
              {label}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};
