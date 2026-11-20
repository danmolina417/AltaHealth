import { attachDatabasePool } from '@vercel/functions';
import { Pool } from 'pg';

/**
 * Shared Postgres pool for the Neon database. `DATABASE_URL` is Neon's pooled
 * (pgbouncer) URL; schema migrations use `DATABASE_URL_UNPOOLED` via dbmate.
 */
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Lets Vercel Fluid compute close idle clients before a function instance is suspended.
attachDatabasePool(pool);
