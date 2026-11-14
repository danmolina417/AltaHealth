'use client';

import { useState } from 'react';
import { MetricTrendChart } from '@/components/MetricTrendChart';
import { AreaScoreCard } from './AreaScoreCard';
import { MetricsTable } from './MetricsTable';
import { NotesPanel } from './NotesPanel';
import { SectionTabs, TabPanel, type TabItem } from './SectionTabs';
import type { HealthAreaDetail } from './types';

type AreaTab = 'overview' | 'metrics' | 'progress' | 'notes';

const tabs: TabItem<AreaTab>[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'metrics', label: 'Metrics' },
  { id: 'progress', label: 'Progress' },
  { id: 'notes', label: 'Notes' },
];

/** The Overview, Metrics, Progress and Notes tabs of a health area page. */
export const AreaSections = ({ detail }: { detail: HealthAreaDetail }) => {
  const {
    title,
    scoreTitle,
    score,
    metricsTitle,
    tableDetail,
    metrics,
    trendTitle,
    trendLabels,
    notes,
  } = detail;
  const [selected, setSelected] = useState<AreaTab>('overview');

  return (
    <>
      <SectionTabs
        label={`${title} sections`}
        tabs={tabs}
        selected={selected}
        onSelect={setSelected}
      />

      <TabPanel key={selected} id={selected}>
        {selected === 'overview' && <AreaScoreCard title={scoreTitle} score={score} />}
        {selected === 'metrics' && (
          <MetricsTable title={metricsTitle} metrics={metrics} detail={tableDetail} />
        )}
        {selected === 'progress' && (
          <>
            <h2 className="font-serif text-xl sm:text-2xl">{trendTitle}</h2>
            {metrics.map(({ id, label, unit, trend }) =>
              trend ? (
                <MetricTrendChart
                  key={id}
                  title={label}
                  unit={unit}
                  values={trend.values}
                  xLabels={trendLabels}
                  min={trend.min}
                  max={trend.max}
                  accent={trend.accent}
                />
              ) : null,
            )}
          </>
        )}
        {selected === 'notes' && <NotesPanel initialNotes={notes} />}
      </TabPanel>
    </>
  );
};
