import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { getSession } from '@/features/auth/session';
import { paths } from '@/lib/paths';

/**
 * Signed-in visitors skip login/signup. This uses the real session check rather
 * than the cookie, so a stale cookie can't bounce between here and the app.
 */
export default async function AuthPagesLayout({ children }: { children: ReactNode }) {
  if (await getSession()) redirect(paths.home);

  return children;
}
