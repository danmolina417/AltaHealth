import { TrendChart } from '../../components/TrendChart';
import { MetricCard } from './MetricCard';
import { skinDetail } from './skinMockData';

export const SkinPage = () => {
  const { title, description, metrics, trendLabel, trend, context } = skinDetail;

  return (
    <section aria-labelledby="area-heading">
      <h1 id="area-heading" className="font-serif text-4xl">
        {title}
      </h1>
      <p className="mt-2 text-ink-muted">{description}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {metrics.map(({ id, ...metric }) => (
          <MetricCard key={id} {...metric} />
        ))}
      </div>

      <h2 className="mt-8 text-xs font-semibold uppercase tracking-wide text-accent-bronze">
        {trendLabel}
      </h2>
      <div className="mt-3 grid gap-4 lg:grid-cols-[3fr_2fr]">
        <TrendChart title="Skin assessment trend" points={trend} accent="bronze" />
        <article className="rounded-card bg-sand p-5 shadow-card sm:p-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-accent-bronze">
            Results in context
          </h3>
          <p className="mt-4 text-base">{context}</p>
        </article>
      </div>
    </section>
  );
};
