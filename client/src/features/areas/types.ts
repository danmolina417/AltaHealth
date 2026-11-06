import type { Accent } from '../../lib/accents';
import type { TrendPoint } from '../../components/TrendChart';

export interface AreaMetric {
  id: string;
  label: string;
  value: number;
  change: string;
  accent: Accent;
}

export interface AreaDetail {
  title: string;
  description: string;
  metrics: AreaMetric[];
  trendLabel: string;
  trend: TrendPoint[];
  context: string;
}

export interface HealthMetric {
  id: string;
  label: string;
  /** Display value including its unit when it has one, e.g. "6.1%". */
  value: string;
  unit?: string;
  /** General reference range or goal. */
  reference?: string;
  trend?: MetricTrend;
}

export interface MetricTrend {
  /** Lowest value of the chart's fixed range. */
  min: number;
  /** Highest value of the chart's fixed range. */
  max: number;
  /** One value per entry in `HealthAreaDetail.trendLabels`, ending at the current value. */
  values: number[];
  accent: Accent;
}

export interface Note {
  id: string;
  /** Who wrote the note, e.g. "Dr. El Chaar" or "Me". */
  author: string;
  /** ISO 8601 date and time. */
  timestamp: string;
  body: string;
}

/** Content for a tabbed health area page (Overview, Metrics, Progress, Notes). */
export interface HealthAreaDetail {
  title: string;
  tagline: string;
  scoreTitle: string;
  score: { value: number; status: string; change: string; message: string };
  metricsTitle: string;
  /** Which metric field fills the table's third column. */
  tableDetail: 'unit' | 'reference';
  metrics: HealthMetric[];
  trendTitle: string;
  trendLabels: string[];
  notes: Note[];
}
