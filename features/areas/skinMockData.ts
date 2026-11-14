import type { AreaDetail } from './types';

/** Placeholder data matching the design. Replace with an API call when the backend exists. */
export const skinDetail: AreaDetail = {
  title: 'Skin & Aesthetics',
  description: 'Track assessments consistently and review visible changes over time.',
  metrics: [
    { id: 'hydration', label: 'Hydration index', value: 74, change: '+8 pts', accent: 'sage' },
    { id: 'texture', label: 'Texture index', value: 81, change: '+5 pts', accent: 'bronze' },
    { id: 'tone', label: 'Tone evenness', value: 77, change: '+3 pts', accent: 'tan' },
  ],
  trendLabel: 'Trend / last 6 assessments',
  trend: [
    { label: '1', score: 70 },
    { label: '2', score: 71 },
    { label: '3', score: 73 },
    { label: '4', score: 72 },
    { label: '5', score: 76 },
    { label: '6', score: 78 },
  ],
  context:
    'Compare with your own baseline first. Add suitable reference ranges only when supported.',
};
