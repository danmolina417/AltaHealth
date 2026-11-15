import type { Metadata } from 'next';
import { HealthAreaPage } from '@/features/areas/HealthAreaPage';
import { lifestyleDetail } from '@/features/areas/lifestyleMockData';

export const metadata: Metadata = { title: lifestyleDetail.title };

export default function Page() {
  return <HealthAreaPage detail={lifestyleDetail} />;
}
