import type { Metadata } from 'next';
import { HealthAreaPage } from '@/features/areas/HealthAreaPage';
import { preventiveDetail } from '@/features/areas/preventiveMockData';

export const metadata: Metadata = { title: preventiveDetail.title };

export default function Page() {
  return <HealthAreaPage detail={preventiveDetail} />;
}
