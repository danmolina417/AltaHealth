import { accentStyles, type Accent } from '@/lib/accents';

export interface ChartSeries {
  id: string;
  label: string;
  values: number[];
  accent: Accent;
}

interface MultiLineChartProps {
  title: string;
  series: ChartSeries[];
  xLabels: string[];
  yMin: number;
  yMax: number;
  yStep: number;
}

export const MultiLineChart = ({
  title,
  series,
  xLabels,
  yMin,
  yMax,
  yStep,
}: MultiLineChartProps) => {
  const count = xLabels.length;
  const toX = (index: number) => ((index + 0.5) / count) * 100;
  const toY = (value: number) =>
    100 - ((Math.min(Math.max(value, yMin), yMax) - yMin) / (yMax - yMin)) * 100;

  const ticks: number[] = [];
  for (let tick = yMin; tick <= yMax; tick += yStep) ticks.push(tick);

  return (
    <article className="rounded-card border border-line bg-surface p-5 shadow-card sm:p-6">
      <h2 className="font-serif text-xl sm:text-2xl">{title}</h2>
      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center">
        <div
          role="img"
          aria-label={`${title}: ${series.map((s) => s.label).join(', ')}`}
          className="min-w-0 flex-1"
        >
          <div className="flex">
            <div className="relative h-56 w-10 shrink-0" aria-hidden="true">
              {ticks.map((tick) => (
                <span
                  key={tick}
                  className="absolute right-2 translate-y-1/2 text-xs text-ink-muted"
                  style={{ bottom: `${100 - toY(tick)}%` }}
                >
                  {tick}
                </span>
              ))}
            </div>
            <div className="relative h-56 flex-1 border-b border-l border-line" aria-hidden="true">
              {ticks.slice(1).map((tick) => (
                <span
                  key={tick}
                  className="absolute inset-x-0 h-px bg-line/60"
                  style={{ bottom: `${100 - toY(tick)}%` }}
                />
              ))}
              {xLabels.map((label, i) => (
                <span
                  key={label}
                  className="absolute inset-y-0 w-px bg-line/60"
                  style={{ left: `${toX(i)}%` }}
                />
              ))}
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 size-full overflow-visible"
              >
                {series.map(({ id, values, accent }) => (
                  <polyline
                    key={id}
                    points={values.map((v, i) => `${toX(i)},${toY(v)}`).join(' ')}
                    fill="none"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    className={accentStyles[accent].stroke}
                  />
                ))}
              </svg>
              {series.flatMap(({ id, values, accent }) =>
                values.map((v, i) => (
                  <span
                    key={`${id}-${xLabels[i]}`}
                    className={`absolute size-2 -translate-x-1/2 translate-y-1/2 rounded-full ${accentStyles[accent].bar}`}
                    style={{ left: `${toX(i)}%`, bottom: `${100 - toY(v)}%` }}
                  />
                )),
              )}
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
        <ul className="flex flex-wrap gap-x-5 gap-y-2 lg:flex-col lg:gap-3">
          {series.map(({ id, label, accent }) => (
            <li key={id} className="flex items-center gap-2 text-sm text-ink-muted">
              <span
                aria-hidden="true"
                className={`size-2.5 rotate-45 ${accentStyles[accent].bar}`}
              />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
};
