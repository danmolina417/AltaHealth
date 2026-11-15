import { buildMetrics } from './buildMetrics';
import type { HealthAreaDetail } from './types';

/**
 * Placeholder data. Chart ranges and history are assumptions, since only the
 * metrics, units and sources were specified. Replace with an API call when the backend exists.
 */
export const nutritionDetail: HealthAreaDetail = {
  title: 'Nutrition',
  tagline: 'Fuel well. Feel the difference.',
  scoreTitle: 'Nutrition Score',
  score: {
    value: 74,
    status: 'Improving',
    change: '+3 since last visit',
    message: 'Your eating habits are moving the right way. Keep building on them.',
  },
  metricsTitle: 'Key Nutrition Metrics',
  tableDetail: 'unit',
  metrics: buildMetrics([
    ['Daily calorie intake', '2,100', 'kcal/day', 'Food logging', [0, 4000, 2500]],
    ['Protein intake', '95', 'g/day', 'Food logging', [0, 300, 70]],
    ['Carbohydrate intake', '240', 'g/day', 'Food logging', [0, 500, 300]],
    ['Sugary snacks/drinks', '2', '# per day', 'Food logging', [0, 10, 5]],
    ['Fruit & vegetables', '3', 'servings/day', 'Food logging', [0, 10, 1]],
    ['Acidic drinks', '2', '# per day', 'Food logging', [0, 10, 4]],
    ['Water', '1.7', 'liters/day', 'Food logging', [0, 5, 1]],
    ['Total fat intake', '70', 'g/day', 'Food logging', [0, 200, 90]],
    ['Saturated fat', '22', 'g/day', 'Food logging', [0, 80, 30]],
    ['Fiber intake', '24', 'g/day', 'Food logging', [0, 60, 15]],
    ['Added sugar', '38', 'g/day', 'Food logging', [0, 150, 70]],
    ['Sodium intake', '2,100', 'mg/day', 'Food logging', [0, 5000, 3000]],
    ['Water intake', '1,700', 'mL/day', 'Patient', [0, 5000, 1000]],
    ['Fruit consumption', '1', 'servings/day', 'Patient', [0, 10, 0.5]],
    ['Vegetable consumption', '2', 'servings/day', 'Patient', [0, 10, 1]],
    ['Whole grain intake', '2', 'servings/day', 'Patient', [0, 10, 1]],
    ['Ultra-processed food intake', '4', 'servings/week', 'Patient', [0, 30, 10]],
    ['Meal regularity', '3 regular meals', 'Meals/day, timing', 'Patient'],
    ['Late-night eating', '1', 'days/week', 'Patient', [0, 7, 3]],
    ['Snacking frequency', '2', 'snacks/day', 'Patient', [0, 8, 4]],
    ['Caffeine intake', '180', 'mg/day', 'Patient', [0, 600, 320]],
    ['Vitamin D', '34', 'ng/mL', 'Laboratory', [0, 100, 22]],
    ['Vitamin B12', '520', 'pg/mL', 'Laboratory', [0, 1500, 380]],
    ['Ferritin', '85', 'ng/mL', 'Laboratory', [0, 400, 60]],
    ['Folate', '14', 'ng/mL', 'Laboratory', [0, 40, 9]],
    ['Magnesium', '2', 'mg/dL', 'Laboratory', [0, 5, 1.7]],
    ['Dietary adherence', '82', '%', 'Patient / clinician', [0, 100, 60]],
    ['Food sensitivities / allergies', 'None reported', 'Categorical', 'Patient / clinical record'],
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
  ],
};
