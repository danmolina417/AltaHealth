import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { resetFakeAuth } from './fakeAuth';
import { memoryRouter } from './memoryRouter';

// The real Next.js router only exists inside a running Next app.
vi.mock('next/navigation', () => import('./mocks/next-navigation'));
vi.mock('next/link', () => import('./mocks/next-link'));

// Better Auth needs a database; the app tests use an in-memory fake instead.
vi.mock('@/lib/authClient', async () => ({
  authClient: (await import('./fakeAuth')).fakeAuthClient,
}));
vi.mock('@/features/auth/session', async () => (await import('./fakeAuth')).fakeSession);

afterEach(() => {
  cleanup();
  memoryRouter.reset();
  resetFakeAuth();
});
