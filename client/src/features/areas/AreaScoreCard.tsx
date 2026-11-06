import { ScoreRing } from '../../components/ScoreRing';
import type { HealthAreaDetail } from './types';

const ClockIcon = () => (
  <svg viewBox="0 0 20 20" className="size-5 text-accent-bronze" aria-hidden="true">
    <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10 5.5V10l3 2" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const AreaScoreCard = ({
  title,
  score,
}: {
  title: string;
  score: HealthAreaDetail['score'];
}) => (
  <article className="flex items-center gap-5 rounded-card border border-line bg-surface p-5 shadow-card sm:gap-8 sm:p-6">
    <ScoreRing
      score={score.value}
      label={`${title} ${score.value} out of 100`}
      accent="forest"
      className="size-28 shrink-0 sm:size-40"
      valueClassName="font-serif text-4xl text-ink sm:text-5xl"
    />
    <div className="min-w-0">
      <h2 className="font-serif text-xl sm:text-2xl">{title}</h2>
      <p className="mt-2 text-sm font-semibold text-accent-forest">{score.status}</p>
      <p className="mt-3 flex items-center gap-2 text-sm text-ink-muted">
        <ClockIcon />
        {score.change}
      </p>
      <p className="mt-3 text-sm text-ink-muted">{score.message}</p>
    </div>
  </article>
);
