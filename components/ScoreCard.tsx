import Link from 'next/link';
import { accentStyles, type Accent } from '@/lib/accents';
import { ScoreRing } from './ScoreRing';

export interface ScoreCardData {
  id: string;
  label: string;
  score: number;
  /** Points gained (or lost, if negative) since the baseline. */
  change: number;
  status: string;
  accent: Accent;
  /** When set, the card links to this route. */
  to?: string;
}

const formatChange = (change: number) => `${change < 0 ? '−' : '+'} ${Math.abs(change)}`;

export const ScoreCard = ({
  label,
  score,
  change,
  status,
  accent,
  to,
}: Omit<ScoreCardData, 'id'>) => (
  <article
    className={`relative flex flex-col items-center gap-3 rounded-card border border-line bg-canvas px-3 py-5 text-center shadow-card sm:px-4 sm:py-6 lg:gap-2 lg:py-4 ${
      to
        ? 'transition-shadow focus-within:outline-2 focus-within:outline-brand-600 hover:shadow-md'
        : ''
    }`}
  >
    <h3 className="text-sm font-medium text-ink sm:text-base">
      {to ? (
        // The pseudo-element stretches the link over the whole card.
        <Link href={to} className="outline-none after:absolute after:inset-0 after:content-['']">
          {label}
        </Link>
      ) : (
        label
      )}
    </h3>
    <ScoreRing
      score={score}
      label={`${label} ${score} out of 100`}
      accent={accent}
      className="size-24 sm:size-28 lg:size-16"
      valueClassName="font-serif text-3xl text-ink sm:text-4xl lg:text-2xl"
    />
    <div className="flex flex-col items-center gap-3 lg:flex-row lg:gap-2">
      <p className={`text-base font-medium ${accentStyles[accent].text}`}>{formatChange(change)}</p>
      <p className="text-sm text-ink-muted">{status}</p>
    </div>
  </article>
);
