import type { ReactNode } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { requireUser } from '@/features/auth/session';

export default async function SignedInLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();

  return <AppLayout user={user}>{children}</AppLayout>;
}
