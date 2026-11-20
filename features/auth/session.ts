import 'server-only';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { auth } from '@/lib/auth';
import { paths } from '@/lib/paths';

/** The signed-in user fields that may be passed to Client Components. */
export interface SessionUser {
  id: string;
  name: string;
  email: string;
}

/**
 * Validates the session cookie against the database. Memoized per render pass;
 * Server Actions and Route Handlers run it on every call.
 */
export const getSession = cache(async () => auth.api.getSession({ headers: await headers() }));

/**
 * The secure auth check. Call it in every signed-in page/layout, Server Action and
 * data fetcher instead of relying on proxy.ts. Redirects to login when signed out.
 */
export const requireUser = async (): Promise<SessionUser> => {
  const session = await getSession();
  if (!session) redirect(paths.login);

  const { id, name, email } = session.user;
  return { id, name, email };
};
