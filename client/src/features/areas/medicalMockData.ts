import type { Accent } from '../../lib/accents';
import type { HealthAreaDetail, HealthMetric } from './types';

const accents: Accent[] = ['forest', 'bronze', 'sage', 'rose', 'sky', 'slate'];

/** label, current value, goal, chart range [min, max], and made-up history ending at the current value. */
type MetricRow = [
  label: string,
  value: string,
  reference: string,
  range: [min: number, max: number],
  history: number[],
];

const rows: MetricRow[] = [
  ['Systolic BP', '145', 'Normal: below 120', [80, 200], [158, 154, 151, 148, 145]],
  ['Diastolic BP', '92', 'Normal: below 80', [40, 130], [100, 98, 96, 94, 92]],
  ['Fasting glucose', '115', 'Normal: 70–99', [60, 250], [132, 126, 121, 118, 115]],
  ['HbA1c', '6.1%', 'Normal: below 5.7%', [4, 12], [6.8, 6.6, 6.4, 6.2, 6.1]],
  ['LDL cholesterol', '145', 'Often desirable: below 100', [0, 250], [172, 163, 156, 150, 145]],
  ['HDL cholesterol', '43', 'Low: below 40 (men), 50 (women)', [20, 100], [37, 39, 40, 42, 43]],
  ['Total cholesterol', '225', 'Desirable: below 200', [100, 350], [248, 241, 236, 230, 225]],
  ['Triglycerides', '230', 'Normal: below 150', [0, 500], [290, 270, 255, 242, 230]],
  [
    'hs-CRP',
    '2.5',
    'CVD risk marker: below 1 lower; 1–3 intermediate; above 3 higher',
    [0, 10],
    [3.6, 3.2, 3, 2.7, 2.5],
  ],
  ['eGFR', '58', 'Generally 90+; interpret by age and context', [0, 120], [54, 55, 56, 57, 58]],
  ['BMI', '29', 'Standard adult range: 18.5–24.9', [15, 45], [31.2, 30.5, 30, 29.5, 29]],
  [
    'Weekly activity',
    '90 min',
    'At least 150 min moderate activity',
    [0, 400],
    [30, 45, 60, 75, 90],
  ],
  [
    'Daily steps',
    '5,000',
    'Individualized; often 7,000–10,000',
    [0, 20000],
    [3200, 3800, 4300, 4700, 5000],
  ],
  ['Resting heart rate', '85', 'Typical adult resting: 60–100', [40, 120], [92, 90, 88, 86, 85]],
  ['Sleep duration', '6.5 hr', 'Generally 7–9 hours', [0, 12], [5.5, 5.8, 6, 6.3, 6.5]],
  ['VO₂ max', '33', 'Age- and sex-dependent', [10, 70], [29, 30, 31, 32, 33]],
  ['Lp(a)', '120', 'Elevated risk commonly ≥125 nmol/L', [0, 250], [124, 123, 121, 121, 120]],
  [
    'ApoB',
    '105',
    'Often desirable below 90; lower for high risk',
    [40, 180],
    [125, 118, 113, 108, 105],
  ],
];

const metrics: HealthMetric[] = rows.map(
  ([label, value, reference, [min, max], values], index) => ({
    id: label.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    label,
    value,
    reference,
    trend: { min, max, values, accent: accents[index % accents.length]! },
  }),
);

/** Placeholder data. Replace with an API call when the backend exists. */
export const medicalDetail: HealthAreaDetail = {
  title: 'Medical Health',
  tagline: 'Know your numbers. Guide your care.',
  scoreTitle: 'Medical Health Score',
  score: {
    value: 76,
    status: 'Improving',
    change: '+3 since last visit',
    message: 'Several markers are moving the right way. Review the rest with your doctor.',
  },
  metricsTitle: 'Key Medical Metrics',
  tableDetail: 'reference',
  metrics,
  trendTitle: 'Metric Progress Over Time',
  trendLabels: ['1', '2', '3', '4', '5'],
  notes: [
    {
      id: 'note-1',
      author: 'Dr. Rivera',
      timestamp: '2026-10-08T10:00:00',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      id: 'note-2',
      author: 'Me',
      timestamp: '2026-10-10T19:20:00',
      body: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      id: 'note-3',
      author: 'Dr. Rivera',
      timestamp: '2026-11-03T08:45:00',
      body: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    },
  ],
};
