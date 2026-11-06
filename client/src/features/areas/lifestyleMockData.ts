import type { HealthAreaDetail } from './types';

/**
 * Placeholder data. Chart ranges and history are assumptions, since only the
 * inputs and units were specified. Replace with an API call when the backend exists.
 */
export const lifestyleDetail: HealthAreaDetail = {
  title: 'Lifestyle & Nutrition',
  tagline: 'Small habits. Lasting change.',
  scoreTitle: 'Lifestyle Score',
  score: {
    value: 78,
    status: 'Stable',
    change: '+2 since last visit',
    message: 'Your habits are steady. Small changes add up over time.',
  },
  metricsTitle: 'Key Lifestyle Metrics',
  tableDetail: 'unit',
  metrics: [
    { id: 'nicotine', label: 'Nicotine status', value: 'Quit', unit: 'None / Quit / Current' },
    {
      id: 'sugary',
      label: 'Sugary snacks/drinks',
      value: '2',
      unit: 'per day',
      trend: { min: 0, max: 10, values: [5, 4, 4, 3, 2], accent: 'bronze' },
    },
    {
      id: 'produce',
      label: 'Fruit & vegetables',
      value: '3',
      unit: 'servings/day',
      trend: { min: 0, max: 10, values: [1, 2, 2, 3, 3], accent: 'forest' },
    },
    {
      id: 'alcohol',
      label: 'Alcohol',
      value: '6',
      unit: 'drinks/week',
      trend: { min: 0, max: 30, values: [14, 12, 9, 8, 6], accent: 'rose' },
    },
    {
      id: 'acidic',
      label: 'Acidic drinks',
      value: '2',
      unit: 'per day',
      trend: { min: 0, max: 10, values: [4, 3, 3, 2, 2], accent: 'sage' },
    },
    {
      id: 'water',
      label: 'Water',
      value: '1.7',
      unit: 'liters/day',
      trend: { min: 0, max: 5, values: [1, 1.2, 1.4, 1.5, 1.7], accent: 'sky' },
    },
  ],
  trendTitle: 'Metric Progress Over Time',
  trendLabels: ['1', '2', '3', '4', '5'],
  notes: [
    {
      id: 'note-1',
      author: 'Dr. Chen',
      timestamp: '2026-10-12T11:00:00',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      id: 'note-2',
      author: 'Me',
      timestamp: '2026-10-15T20:10:00',
      body: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      id: 'note-3',
      author: 'Dr. Chen',
      timestamp: '2026-11-04T09:20:00',
      body: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    },
  ],
};
