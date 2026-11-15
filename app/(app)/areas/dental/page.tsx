import type { Metadata } from 'next';
import { HealthAreaPage } from '@/features/areas/HealthAreaPage';
import { dentalDetail } from '@/features/areas/dentalMockData';

export const metadata: Metadata = { title: dentalDetail.title };

export default function Page() {
  return <HealthAreaPage detail={dentalDetail} />;
}
