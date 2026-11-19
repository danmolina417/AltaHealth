import { getSessionCookie } from 'better-auth/cookies';
import { NextResponse, type NextRequest } from 'next/server';
import { paths } from '@/lib/paths';

const publicPages: readonly string[] = [paths.login, paths.signup];
const publicApiPrefix = '/api/auth/';
const publicApiRoutes: readonly string[] = ['/api/health'];

const isPublic = (pathname: string) =>
  publicPages.includes(pathname) ||
  publicApiRoutes.includes(pathname) ||
  pathname.startsWith(publicApiPrefix);

/**
 * Deny-by-default first pass: everything except the public allowlist needs a
 * session cookie. This only checks that the cookie exists (no database call), so it
 * is a redirect optimisation, not the security boundary: pages, Server Actions and
 * route handlers must still call `requireUser()` / `getSession()` from
 * features/auth/session.ts.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublic(pathname) || getSessionCookie(request)) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.redirect(new URL(paths.login, request.url));
}

export const config = {
  // Static files and images are always public.
  matcher: ['/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico)$).*)'],
};
