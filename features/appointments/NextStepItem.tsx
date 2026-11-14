import { ArrowRight, Check, Drop, Heart, Tooth, User, type Icon } from '@phosphor-icons/react';
import type { NextStep, StepCategory } from './types';

const categories: Record<StepCategory, { label: string; icon: Icon }> = {
  dental: { label: 'Dental', icon: Tooth },
  medical: { label: 'Medical', icon: Drop },
  skin: { label: 'Skin & Aesthetics', icon: User },
  wellness: { label: 'Wellness', icon: Heart },
};

interface NextStepCardProps {
  step: NextStep;
  requested: boolean;
  onRequest: (id: string) => void;
}

export const NextStepItem = ({ step, requested, onRequest }: NextStepCardProps) => {
  const { id, category, title, description, schedule, actionLabel } = step;
  const { label, icon: CategoryIcon } = categories[category];

  return (
    <article className="flex gap-4 rounded-card border border-line bg-surface p-4 shadow-card sm:gap-5 sm:p-5">
      <span
        aria-hidden="true"
        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent-bronze text-white sm:size-14"
      >
        <CategoryIcon size={26} weight="fill" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div>
          <p className="text-sm text-ink-muted">{label}</p>
          <h2 className="mt-1 font-serif text-xl">{title}</h2>
          <p className="mt-2 max-w-md text-ink-muted">{description}</p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium">{schedule}</p>
          <button
            type="button"
            disabled={requested}
            onClick={() => onRequest(id)}
            className="inline-flex min-h-11 items-center gap-3 rounded-full border border-brand-600 bg-surface px-5 text-sm font-semibold text-ink transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-default disabled:bg-brand-50 disabled:text-brand-700"
          >
            {requested ? 'Requested' : actionLabel}
            {requested ? (
              <Check size={16} aria-hidden="true" />
            ) : (
              <ArrowRight size={16} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
