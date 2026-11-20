import { redirect } from 'next/navigation';
import type { SessionUser } from '@/features/auth/session';
import { paths } from '@/lib/paths';

/**
 * In-memory stand-in for Better Auth, used by the app tests in place of
 * `@/lib/authClient` (browser) and `@/features/auth/session` (server).
 */

interface FakeAccount extends SessionUser {
  password: string;
}

export const seededUser = {
  name: 'Jane',
  email: 'jane@example.com',
  password: 'password123',
} as const;

const seed = (): FakeAccount[] => [{ id: 'user-1', ...seededUser }];

let accounts = seed();
let current: FakeAccount | null = null;

const toUser = ({ id, name, email }: FakeAccount): SessionUser => ({ id, name, email });
const failure = (status: number, code: string) => ({
  data: null,
  error: { status, code, message: code },
});

export const resetFakeAuth = () => {
  accounts = seed();
  current = null;
};

export const fakeAuthClient = {
  signIn: {
    email: async ({ email, password }: { email: string; password: string }) => {
      const account = accounts.find((a) => a.email === email && a.password === password);
      if (!account) return failure(401, 'INVALID_EMAIL_OR_PASSWORD');
      current = account;
      return { data: { user: toUser(account) }, error: null };
    },
  },
  signUp: {
    email: async ({ name, email, password }: { name: string; email: string; password: string }) => {
      if (accounts.some((a) => a.email === email)) {
        return failure(422, 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL');
      }
      const account = { id: `user-${accounts.length + 1}`, name, email, password };
      accounts.push(account);
      current = account;
      return { data: { user: toUser(account) }, error: null };
    },
  },
  signOut: async () => {
    current = null;
    return { data: { success: true }, error: null };
  },
};

export const fakeSession = {
  getSession: async () => (current ? { user: toUser(current) } : null),
  requireUser: async (): Promise<SessionUser> => {
    if (!current) redirect(paths.login);
    return toUser(current);
  },
};
