import { buildMetrics } from './buildMetrics';
import type { HealthAreaDetail } from './types';

/**
 * Placeholder data. Chart ranges and history are assumptions, since only the
 * metrics, units and sources were specified. Replace with an API call when the backend exists.
 */
export const lifestyleDetail: HealthAreaDetail = {
  title: 'Lifestyle',
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
  metrics: buildMetrics([
    ['Daily steps', '7,400', 'steps/day', 'Wearable', [0, 20000, 5200]],
    ['Exercise frequency', '3', 'sessions/week', 'Patient / wearable', [0, 14, 1]],
    ['Active calories burned', '420', 'kcal/day', 'Wearable estimate', [0, 1500, 310]],
    ['Sedentary time', '8.5', 'hours/day', 'Wearable', [0, 16, 10.5]],
    ['Sleep duration', '7.1', 'hours/night', 'Wearable', [0, 12, 6.2]],
    ['Sleep efficiency', '89', '%', 'Wearable', [0, 100, 82]],
    ['Deep sleep', '78', 'minutes/night', 'Wearable estimate', [0, 180, 58]],
    ['REM sleep', '96', 'minutes/night', 'Wearable estimate', [0, 180, 80]],
    ['Sleep consistency', '35', 'bedtime variation, minutes', 'Wearable', [0, 120, 70]],
    ['Resting heart rate', '62', 'BPM', 'Wearable', [40, 120, 70]],
    ['Heart rate variability', '48', 'ms', 'Wearable', [0, 150, 36]],
    ['Stress level', '4', '1–10 scale', 'Patient', [1, 10, 7]],
    ['Energy level', '7', '1–10 scale', 'Patient', [1, 10, 5]],
    ['Mood', '7', '1–10 scale', 'Patient', [1, 10, 5]],
    ['Social connection', '6', '1–10 scale', 'Patient', [1, 10, 4]],
    ['Alcohol consumption', '6', 'drinks/week', 'Patient', [0, 30, 14]],
    ['Tobacco / nicotine use', 'Quit', 'Frequency', 'Patient'],
    ['Screen time', '5.5', 'hours/day', 'Device / patient', [0, 16, 7.5]],
    ['Outdoor activity', '40', 'minutes/day', 'Patient', [0, 180, 15]],
    ['Perceived recovery', '7', '1–10 scale', 'Patient', [1, 10, 5]],
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
