import type { ReactNode } from 'react';
import { AreasLayout } from '@/features/areas/AreasLayout';

export default function Layout({ children }: { children: ReactNode }) {
  return <AreasLayout>{children}</AreasLayout>;
}
