import { paths } from '../../routes/paths';
import type { WellnessSnapshot } from './types';

/** Placeholder data matching the design. Replace with an API call when the backend exists. */
export const mockSnapshot: WellnessSnapshot = {
  overallScore: 82,
  scores: [
    {
      id: 'skin',
      label: 'Skin Health',
      score: 88,
      change: 4,
      status: 'Great progress',
      accent: 'forest',
      to: paths.skin,
    },
    {
      id: 'dental',
      label: 'Dental Health',
      score: 82,
      change: 6,
      status: 'On track',
      accent: 'forest',
      to: paths.dental,
    },
    {
      id: 'medical',
      label: 'Medical Health',
      score: 76,
      change: 3,
      status: 'Improving',
      accent: 'bronze',
      to: paths.medical,
    },
    {
      id: 'lifestyle',
      label: 'Lifestyle & Nutrition',
      score: 78,
      change: 2,
      status: 'Stable',
      accent: 'forest',
      to: paths.lifestyle,
    },
  ],
  trend: [
    { label: 'May', score: 74 },
    { label: 'Jun', score: 76 },
    { label: 'Jul', score: 77 },
    { label: 'Aug', score: 78 },
    { label: 'Sep', score: 80 },
    { label: 'Oct', score: 82 },
  ],
  nextStep: 'Consider booking your dental cleaning and updating your nutrition check-in.',
};
