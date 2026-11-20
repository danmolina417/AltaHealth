// @vitest-environment node
import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import { proxy } from './proxy';

const request = (path: string, cookie?: string) =>
  new NextRequest(new URL(path, 'http://localhost:3000'), {
    headers: cookie ? { cookie } : {},
  });

const sessionCookie = 'better-auth.session_token=token.signature';

describe('proxy', () => {
  it.each(['/', '/appointments', '/areas/dental', '/settings'])(
    'redirects signed-out visitors from %s to login',
    (path) => {
      const res = proxy(request(path));

      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost:3000/login');
    },
  );

  it('answers signed-out API calls with a 401 instead of a redirect', async () => {
    const res = proxy(request('/api/anything'));

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: 'Unauthorized' });
  });

  it.each(['/login', '/signup', '/api/auth/sign-in/email', '/api/auth/get-session', '/api/health'])(
    'lets signed-out visitors reach the public route %s',
    (path) => {
      const res = proxy(request(path));

      expect(res.headers.get('x-middleware-next')).toBe('1');
    },
  );

  it('does not treat look-alike paths as public', () => {
    expect(proxy(request('/api/healthz')).status).toBe(401);
    expect(proxy(request('/api/authx')).status).toBe(401);
    expect(proxy(request('/login/extra')).status).toBe(307);
  });

  it('lets requests with a session cookie through (the real check happens on the server)', () => {
    const res = proxy(request('/areas/dental', sessionCookie));

    expect(res.headers.get('x-middleware-next')).toBe('1');
  });
});
