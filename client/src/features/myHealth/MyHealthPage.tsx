import { useState } from 'react';
import { MultiLineChart } from '../../components/MultiLineChart';
import { ScoreCard } from '../../components/ScoreCard';
import { SectionTabs, TabPanel, type TabItem } from '../areas/SectionTabs';
import { myHealthSnapshot } from './mockData';
import { PillarOverviewCard } from './PillarOverviewCard';

type PillarTab = 'overview' | 'details';

const tabs: TabItem<PillarTab>[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'details', label: 'Details', disabled: true },
];

const periods = [
  { months: 3, label: 'Last 3 months' },
  { months: 6, label: 'Last 6 months' },
];

export const MyHealthPage = () => {
  const { scoreCards, pillars, months, series } = myHealthSnapshot;
  const [selectedTab, setSelectedTab] = useState<PillarTab>('overview');
  const [periodMonths, setPeriodMonths] = useState(6);

  const visibleMonths = months.slice(-periodMonths);
  const visibleSeries = series.map((s) => ({ ...s, values: s.values.slice(-periodMonths) }));
  const trendFor = (id: string) => visibleSeries.find((s) => s.id === id)?.values ?? [];

  return (
    <section aria-labelledby="my-health-heading" className="flex flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 id="my-health-heading" className="font-serif text-4xl">
            Your Wellness Snapshot
          </h1>
          <p className="mt-2 text-lg text-ink-muted">
            A complete view of your health, beauty and longevity.
          </p>
        </div>
        <label className="flex items-center">
          <span className="sr-only">Time period</span>
          <select
            value={periodMonths}
            onChange={(event) => setPeriodMonths(Number(event.target.value))}
            className="min-h-11 rounded-xl border border-line bg-surface px-3 text-sm focus:outline-2 focus:outline-brand-600"
          >
            {periods.map(({ months: value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {scoreCards.map(({ id, ...card }) => (
          <ScoreCard key={id} {...card} />
        ))}
      </div>

      <article className="flex flex-col gap-4 rounded-card border border-line bg-surface p-5 shadow-card sm:p-6">
        <h2 className="font-serif text-xl sm:text-2xl">Your 6 Pillars of Wellness</h2>
        <SectionTabs
          label="Pillar views"
          tabs={tabs}
          selected={selectedTab}
          onSelect={setSelectedTab}
        />
        <TabPanel id={selectedTab}>
          <div className="grid gap-4 md:grid-cols-3">
            {pillars.map((pillar) => (
              <PillarOverviewCard key={pillar.id} pillar={pillar} trend={trendFor(pillar.id)} />
            ))}
          </div>
        </TabPanel>
      </article>

      <MultiLineChart
        title="Your Progress Over Time"
        series={visibleSeries}
        xLabels={visibleMonths}
        yMin={40}
        yMax={100}
        yStep={20}
      />
    </section>
  );
};
