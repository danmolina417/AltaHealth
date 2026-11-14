import type { Metadata } from 'next';
import { HealthAreaPage } from '@/features/areas/HealthAreaPage';
import { medicalDetail } from '@/features/areas/medicalMockData';

export const metadata: Metadata = { title: medicalDetail.title };

export default function Page() {
  return <HealthAreaPage detail={medicalDetail} />;
}
