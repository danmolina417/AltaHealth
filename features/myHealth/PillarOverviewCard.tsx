import Link from 'next/link';
import { AreaSparkline } from '@/components/AreaSparkline';
import { ScoreRing } from '@/components/ScoreRing';
import { accentStyles } from '@/lib/accents';
import type { PillarSummary } from './types';

interface PillarOverviewCardProps {
  pillar: PillarSummary;
  /** Score history for the selected period. */
  trend: number[];
}

export const PillarOverviewCard = ({ pillar, trend }: PillarOverviewCardProps) => {
  const { label, score, change, accent, to, metrics } = pillar;
  const styles = accentStyles[accent];

  return (
    <article className="flex flex-col gap-4 rounded-card border border-line bg-canvas p-5 shadow-card">
      <h3 className="font-serif text-lg">
        <Link
          href={to}
          className="hover:underline focus-visible:outline-2 focus-visible:outline-brand-600"
        >
          {label}
        </Link>
      </h3>
      <div className="flex items-center gap-4">
        <ScoreRing
          score={score}
          label={`${label} pillar score ${score} out of 100`}
          accent={accent}
          className="size-20"
          valueClassName="font-serif text-2xl text-ink"
        />
        <p className={`text-base font-medium ${styles.text}`}>+ {change}</p>
      </div>
      <AreaSparkline values={trend} label={`${label} trend`} accent={accent} />
      <div>
        <h4 className="text-sm font-semibold">Key Metrics</h4>
        <ul className="mt-3 flex flex-col gap-3 text-sm">
          {metrics.map(({ label: metricLabel, value }) => (
            <li key={metricLabel} className="flex items-center gap-3">
              <span aria-hidden="true" className={`size-1.5 shrink-0 rounded-full ${styles.bar}`} />
              <span className="flex-1 text-ink-muted">{metricLabel}</span>
              <span className="font-medium">{value}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
};
