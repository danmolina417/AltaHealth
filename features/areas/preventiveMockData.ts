import { buildMetrics } from './buildMetrics';
import type { HealthAreaDetail } from './types';

/**
 * Placeholder data. No metrics were specified for this pillar, so the metrics,
 * units, sources, ranges and history are all assumptions. Replace with the real
 * list and an API call when they exist.
 */
export const preventiveDetail: HealthAreaDetail = {
  title: 'Preventive & Longevity',
  tagline: 'Look ahead. Live longer, better.',
  scoreTitle: 'Preventive & Longevity Score',
  score: {
    value: 80,
    status: 'Good',
    change: '+4 since last visit',
    message: 'You are staying ahead of the curve. Keep your screenings current.',
  },
  metricsTitle: 'Key Preventive & Longevity Metrics',
  tableDetail: 'unit',
  metrics: buildMetrics([
    ['Biological age', '41', 'years', 'Laboratory', [30, 70, 44]],
    ['Grip strength', '34', 'kg', 'Clinician', [10, 70, 30]],
    ['Waist-to-height ratio', '0.5', 'ratio', 'Clinician', [0.3, 0.8, 0.55]],
    ['Bone density T-score', '-0.8', 'standard deviations', 'Imaging', [-4, 2, -1]],
    ['Cancer screenings up to date', '3 of 4', 'Screenings', 'Clinical record'],
    ['Vaccinations up to date', 'Yes', 'Yes / No', 'Clinical record'],
  ]),
  trendTitle: 'Metric Progress Over Time',
  trendLabels: ['1', '2', '3', '4', '5'],
  notes: [
    {
      id: 'note-1',
      author: 'Dr. Chen',
      timestamp: '2026-10-12T11:00:00',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
  ],
};
