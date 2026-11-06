import type { ScoreCardData } from '../../components/ScoreCard';
import type { TrendPoint } from '../../components/TrendChart';

export interface WellnessSnapshot {
  /** The Wellness Quotient shown in the main gauge. */
  overallScore: number;
  scores: ScoreCardData[];
  trend: TrendPoint[];
  nextStep: string;
}
