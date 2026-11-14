import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { memoryRouter } from './memoryRouter';

// The real Next.js router only exists inside a running Next app.
vi.mock('next/navigation', () => import('./mocks/next-navigation'));
vi.mock('next/link', () => import('./mocks/next-link'));

afterEach(() => {
  cleanup();
  memoryRouter.reset();
});
