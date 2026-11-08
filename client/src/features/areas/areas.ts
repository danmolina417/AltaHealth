import { paths } from '../../routes/paths';

export interface WellnessArea {
  id: string;
  label: string;
  /** Areas without a route are shown but not yet navigable. */
  to?: string;
}

export const wellnessAreas: WellnessArea[] = [
  { id: 'skin', label: 'Skin & aesthetics', to: paths.skin },
  { id: 'dental', label: 'Dental & oral health', to: paths.dental },
  { id: 'medical', label: 'Medical metrics', to: paths.medical },
  { id: 'lifestyle', label: 'Lifestyle', to: paths.lifestyle },
  { id: 'nutrition', label: 'Nutrition', to: paths.nutrition },
  { id: 'preventive', label: 'Preventive & longevity', to: paths.preventive },
];
