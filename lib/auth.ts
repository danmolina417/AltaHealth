import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { pool } from './db';

// No `server-only` import here: the Better Auth CLI (`npx auth generate`) loads this file.

const onVercel = Boolean(process.env.VERCEL);
const configuredHost = process.env.BETTER_AUTH_URL
  ? new URL(process.env.BETTER_AUTH_URL).host
  : undefined;

/**
 * Hosts this deployment answers on. They also become the trusted origins, so
 * preview URLs work without trusting every `*.vercel.app` site.
 */
const allowedHosts = [
  configuredHost,
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
  process.env.VERCEL_BRANCH_URL,
  process.env.VERCEL_URL,
  onVercel ? undefined : 'localhost:*',
].filter((host): host is string => Boolean(host));

export const auth = betterAuth({
  appName: 'Alta Health',
  database: pool,
  baseURL: {
    allowedHosts,
    protocol: onVercel ? 'https' : 'http',
    fallback: process.env.BETTER_AUTH_URL,
  },
  emailAndPassword: {
    enabled: true,
  },
  rateLimit: {
    // Serverless instances don't share memory, so counters live in Postgres.
    storage: 'database',
    customRules: {
      '/sign-in/email': { window: 60, max: 5 },
      '/sign-up/email': { window: 60, max: 5 },
    },
  },
  advanced: {
    ipAddress: {
      // Set by Vercel and not overwritable by the client.
      ipAddressHeaders: ['x-vercel-forwarded-for'],
    },
  },
  // Must stay last: applies Set-Cookie headers from auth calls made in Server Actions.
  plugins: [nextCookies()],
});
