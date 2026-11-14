import type { Accent } from '@/lib/accents';
import type { HealthMetric } from './types';

const accents: Accent[] = ['forest', 'bronze', 'sage', 'rose', 'sky', 'slate'];

/** Share of the way from the starting value to the current value at each of the five points. */
const progress = [0, 0.4, 0.6, 0.85, 1];

/**
 * label, current value, unit or input type, data source, and an optional chart
 * range `[min, max, from]`. Rows without a range are not charted. Placeholder
 * history is made up, moving from `from` to the current value.
 */
export type MetricRow = [
  label: string,
  value: string,
  unit: string,
  source: string,
  chart?: [min: number, max: number, from: number],
];

const round = (value: number) => Math.round(value * 10) / 10;

export const buildMetrics = (rows: MetricRow[]): HealthMetric[] =>
  rows.map(([label, value, unit, source, chart], index) => {
    const metric: HealthMetric = {
      id: label.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      label,
      value,
      unit,
      source,
    };
    if (chart) {
      const [min, max, from] = chart;
      const current = Number(value.replace(/,/g, ''));
      metric.trend = {
        min,
        max,
        values: progress.map((share) => round(from + (current - from) * share)),
        accent: accents[index % accents.length]!,
      };
    }
    return metric;
  });
