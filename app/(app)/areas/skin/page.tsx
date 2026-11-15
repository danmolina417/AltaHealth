import type { Metadata } from 'next';
import { SkinPage } from '@/features/areas/SkinPage';
import { skinDetail } from '@/features/areas/skinMockData';

export const metadata: Metadata = { title: skinDetail.title };

export default function Page() {
  return <SkinPage />;
}
