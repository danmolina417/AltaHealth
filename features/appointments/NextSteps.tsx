'use client';

import { useState } from 'react';
import { SectionTabs, TabPanel, type TabItem } from '@/features/areas/SectionTabs';
import { NextStepItem } from './NextStepItem';
import type { NextStep } from './types';

type StepFilter = 'all' | 'upcoming' | 'recommended';

const tabs: TabItem<StepFilter>[] = [
  { id: 'all', label: 'All' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'recommended', label: 'Recommended' },
];

/** Filterable list of next steps; tracks which ones the user has requested. */
export const NextSteps = ({ steps }: { steps: NextStep[] }) => {
  const [filter, setFilter] = useState<StepFilter>('all');
  const [requested, setRequested] = useState<ReadonlySet<string>>(new Set());

  const visibleSteps = filter === 'all' ? steps : steps.filter((step) => step.status === filter);
  const request = (id: string) => setRequested((current) => new Set(current).add(id));

  return (
    <>
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
    </>
  );
};
