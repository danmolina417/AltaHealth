import type { ScoreCardData } from '@/components/ScoreCard';
import { paths } from '@/lib/paths';
import { dentalDetail } from '@/features/areas/dentalMockData';
import { lifestyleDetail } from '@/features/areas/lifestyleMockData';
import { medicalDetail } from '@/features/areas/medicalMockData';
import { nutritionDetail } from '@/features/areas/nutritionMockData';
import { preventiveDetail } from '@/features/areas/preventiveMockData';
import { skinDetail } from '@/features/areas/skinMockData';
import type { HealthMetric } from '@/features/areas/types';
import { mockSnapshot } from '@/features/landing/mockData';
import type { KeyMetric, MyHealthSnapshot, PillarSummary } from './types';

const scoreFor = (id: string): ScoreCardData => {
  const card = mockSnapshot.scores.find((score) => score.id === id);
  if (!card) throw new Error(`Missing score for "${id}"`);
  return card;
};

const pickMetrics = (metrics: HealthMetric[], ids: string[]): KeyMetric[] =>
  ids.map((id) => {
    const metric = metrics.find((m) => m.id === id);
    if (!metric) throw new Error(`Missing metric "${id}"`);
    return { label: metric.label, value: [metric.value, metric.unit].filter(Boolean).join(' ') };
  });

const pillar = (id: string, to: string, metrics: KeyMetric[]): PillarSummary => {
  const { label, score, change, accent } = scoreFor(id);
  return { id, label, score, change, accent, to, metrics };
};

const skinCard = scoreFor('skin');
const dentalCard = scoreFor('dental');
const medicalCard = scoreFor('medical');

/** Placeholder data. The pillar numbers come from the same mock data as the landing and detail pages. */
export const myHealthSnapshot: MyHealthSnapshot = {
  scoreCards: [
    skinCard,
    dentalCard,
    medicalCard,
    {
      id: 'overall',
      label: 'Overall Wellness',
      score: mockSnapshot.overallScore,
      change: 4,
      status: 'Strong',
      accent: 'forest',
    },
  ],
  pillars: [
    pillar(
      'skin',
      paths.skin,
      skinDetail.metrics.map(({ label, value }) => ({ label, value: String(value) })),
    ),
    pillar(
      'dental',
      paths.dental,
      pickMetrics(dentalDetail.metrics, ['probing-depth', 'bleeding', 'plaque']),
    ),
    pillar(
      'medical',
      paths.medical,
      pickMetrics(medicalDetail.metrics, ['systolic-bp', 'hba1c', 'hs-crp']),
    ),
    pillar(
      'lifestyle',
      paths.lifestyle,
      pickMetrics(lifestyleDetail.metrics, ['daily-steps', 'sleep-duration', 'resting-heart-rate']),
    ),
    pillar(
      'nutrition',
      paths.nutrition,
      pickMetrics(nutritionDetail.metrics, [
        'daily-calorie-intake',
        'protein-intake',
        'fruit-vegetables',
      ]),
    ),
    pillar(
      'preventive',
      paths.preventive,
      pickMetrics(preventiveDetail.metrics, [
        'biological-age',
        'grip-strength',
        'waist-to-height-ratio',
      ]),
    ),
  ],
  months: ['May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026'],
  series: [
    { id: 'skin', label: 'Skin Health', accent: 'bronze', values: [76, 79, 82, 85, 86, 88] },
    { id: 'dental', label: 'Dental Health', accent: 'rose', values: [68, 74, 77, 79, 81, 82] },
    { id: 'medical', label: 'Medical Health', accent: 'forest', values: [62, 67, 70, 72, 74, 76] },
    { id: 'lifestyle', label: 'Lifestyle', accent: 'sage', values: [72, 73, 75, 76, 77, 78] },
    { id: 'nutrition', label: 'Nutrition', accent: 'tan', values: [64, 67, 69, 71, 73, 74] },
    {
      id: 'preventive',
      label: 'Preventive & Longevity',
      accent: 'sky',
      values: [70, 73, 75, 77, 79, 80],
    },
    { id: 'overall', label: 'Overall Wellness', accent: 'slate', values: [66, 70, 74, 77, 80, 82] },
  ],
};
