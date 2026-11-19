// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RedirectError } from '@/test/memoryRouter';

// test/setup.ts swaps this module for a fake; these tests cover the real one.
vi.unmock('@/features/auth/session');
vi.mock('server-only', () => ({}));
vi.mock('next/headers', () => ({ headers: async () => new Headers({ cookie: 'session=abc' }) }));

const getSession = vi.fn();
vi.mock('@/lib/auth', () => ({ auth: { api: { getSession } } }));

const { requireUser } = await import('./session');

describe('requireUser', () => {
  beforeEach(() => getSession.mockReset());

  it('redirects to login when there is no valid session', async () => {
    getSession.mockResolvedValue(null);

    await expect(requireUser()).rejects.toEqual(new RedirectError('/login'));
  });

  it('checks the request cookies with Better Auth', async () => {
    getSession.mockResolvedValue(null);

    await requireUser().catch(() => undefined);

    const [{ headers }] = getSession.mock.calls[0]!;
    expect(headers.get('cookie')).toBe('session=abc');
  });

  it('returns only the user fields that are safe to pass to the client', async () => {
    getSession.mockResolvedValue({
      session: { id: 's1', token: 'secret-token', ipAddress: '1.2.3.4' },
      user: { id: 'u1', name: 'Jane', email: 'jane@example.com', emailVerified: false },
    });

    await expect(requireUser()).resolves.toEqual({
      id: 'u1',
      name: 'Jane',
      email: 'jane@example.com',
    });
  });
});
