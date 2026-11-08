import { useState } from 'react';
import { SectionTabs, TabPanel, type TabItem } from '../areas/SectionTabs';
import { appointmentsSnapshot } from './mockData';
import { NextStepItem } from './NextStepItem';

type StepFilter = 'all' | 'upcoming' | 'recommended';

const tabs: TabItem<StepFilter>[] = [
  { id: 'all', label: 'All' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'recommended', label: 'Recommended' },
];

export const AppointmentsPage = () => {
  const { steps, closing } = appointmentsSnapshot;
  const [filter, setFilter] = useState<StepFilter>('all');
  const [requested, setRequested] = useState<ReadonlySet<string>>(new Set());

  const visibleSteps = filter === 'all' ? steps : steps.filter((step) => step.status === filter);
  const request = (id: string) => setRequested((current) => new Set(current).add(id));

  return (
    <section aria-labelledby="appointments-heading" className="flex flex-col gap-6">
      <header>
        <h1 id="appointments-heading" className="font-serif text-4xl">
          Recommended Next Steps
        </h1>
        <p className="mt-2 text-lg text-ink-muted">
          Personalized recommendations to keep you on track.
        </p>
      </header>

      <SectionTabs label="Step filter" tabs={tabs} selected={filter} onSelect={setFilter} />

      <TabPanel id={filter}>
        {visibleSteps.map((step) => (
          <NextStepItem
            key={step.id}
            step={step}
            requested={requested.has(step.id)}
            onRequest={request}
          />
        ))}
      </TabPanel>

      <aside className="rounded-card bg-gradient-to-r from-sand to-canvas p-8 sm:p-10">
        <div className="sm:ml-auto sm:max-w-sm">
          <p className="font-serif text-2xl">{closing.title}</p>
          <p className="mt-2 text-ink-muted">{closing.message}</p>
        </div>
      </aside>
    </section>
  );
};
