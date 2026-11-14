import type { Metadata } from 'next';
import { MyHealthPage } from '@/features/myHealth/MyHealthPage';

export const metadata: Metadata = { title: 'My Health' };

export default function Page() {
  return <MyHealthPage />;
}
