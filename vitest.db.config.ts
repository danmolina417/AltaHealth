import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

/**
 * Database tests (`npm run test:db`): RLS, roles and migrations against a real Postgres in
 * Docker. Kept out of `npm test`, which needs no Docker.
 */
export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('.', import.meta.url)) },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['db/**/*.test.ts'],
    globalSetup: ['./db/test/globalSetup.ts'],
    hookTimeout: 120_000,
  },
});
