import { ScoreRing } from '@/components/ScoreRing';

interface WellnessGaugeProps {
  score: number;
  max?: number;
}

export const WellnessGauge = ({ score, max = 100 }: WellnessGaugeProps) => (
  <figure className="flex flex-col items-center gap-3">
    <figcaption className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
      Wellness Quotient
    </figcaption>
    <ScoreRing
      score={score}
      max={max}
      label={`Wellness Quotient ${score} out of ${max}`}
      showMax
      className="size-44 sm:size-52 lg:size-64"
      valueClassName="text-5xl font-semibold text-brand-600 lg:text-6xl"
    />
  </figure>
);
