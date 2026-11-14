import type { Metadata } from 'next';
import { HealthAreaPage } from '@/features/areas/HealthAreaPage';
import { nutritionDetail } from '@/features/areas/nutritionMockData';

export const metadata: Metadata = { title: nutritionDetail.title };

export default function Page() {
  return <HealthAreaPage detail={nutritionDetail} />;
}
