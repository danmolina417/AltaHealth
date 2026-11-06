import type { HealthAreaDetail } from './types';

/** Placeholder data. Replace with an API call when the backend exists. */
export const dentalDetail: HealthAreaDetail = {
  title: 'Dental Health',
  tagline: 'Healthy smiles. Lasting wellness.',
  scoreTitle: 'Dental Health Score',
  score: {
    value: 82,
    status: 'Good',
    change: '+6 since last visit',
    message: 'Your oral health is on track. Keep up the great work!',
  },
  metricsTitle: 'Key Dental Metrics',
  tableDetail: 'unit',
  metrics: [
    {
      id: 'probing-depth',
      label: 'Deepest probing depth',
      value: '3',
      unit: 'mm',
      trend: { min: 0, max: 10, values: [5, 4, 4, 3, 3], accent: 'forest' },
    },
    {
      id: 'bleeding',
      label: 'Bleeding on probing',
      value: '5',
      unit: '% sites',
      trend: { min: 0, max: 50, values: [22, 15, 11, 8, 5], accent: 'bronze' },
    },
    {
      id: 'caries-risk',
      label: 'Caries risk (CAMBRA)',
      value: 'Low',
      unit: 'Low / Moderate / High / Extreme',
    },
    {
      id: 'saliva-flow',
      label: 'Stimulated saliva flow',
      value: '1.2',
      unit: 'mL/min',
      trend: { min: 0, max: 10, values: [0.6, 0.8, 0.9, 1.1, 1.2], accent: 'sage' },
    },
    {
      id: 'saliva-ph',
      label: 'Resting saliva pH',
      value: '7',
      unit: 'pH',
      trend: { min: 5, max: 8, values: [6.4, 6.6, 6.8, 6.9, 7], accent: 'sky' },
    },
    {
      id: 'plaque',
      label: "Plaque index (O'Leary)",
      value: '10',
      unit: '% surfaces',
      trend: { min: 0, max: 80, values: [34, 24, 17, 13, 10], accent: 'rose' },
    },
    {
      id: 'decay',
      label: 'Untreated decay',
      value: '0',
      unit: 'teeth',
      trend: { min: 0, max: 5, values: [3, 2, 1, 1, 0], accent: 'slate' },
    },
    { id: 'pathogens', label: 'Oral pathogen panel', value: 'None', unit: 'None / One / Two+' },
  ],
  trendTitle: 'Metric Progress Over Time',
  trendLabels: ['1', '2', '3', '4', '5'],
  notes: [
    {
      id: 'note-1',
      author: 'Dr. El Chaar',
      timestamp: '2026-10-14T09:30:00',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      id: 'note-2',
      author: 'Me',
      timestamp: '2026-10-16T18:05:00',
      body: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      id: 'note-3',
      author: 'Dr. El Chaar',
      timestamp: '2026-11-02T14:15:00',
      body: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    },
  ],
};
