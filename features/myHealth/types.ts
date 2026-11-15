import type { ScoreCardData } from '@/components/ScoreCard';
import type { Accent } from '@/lib/accents';

export interface KeyMetric {
  label: string;
  value: string;
}

export interface PillarSummary {
  id: string;
  label: string;
  score: number;
  change: number;
  accent: Accent;
  /** Page with the full detail for this pillar. */
  to: string;
  metrics: KeyMetric[];
}

export interface ProgressSeries {
  id: string;
  label: string;
  accent: Accent;
  /** One score per entry in `MyHealthSnapshot.months`, oldest first. */
  values: number[];
}

export interface MyHealthSnapshot {
  scoreCards: ScoreCardData[];
  pillars: PillarSummary[];
  months: string[];
  series: ProgressSeries[];
}
