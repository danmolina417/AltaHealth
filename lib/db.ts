import { attachDatabasePool } from '@vercel/functions';
import { Kysely, PostgresDialect, sql, type Transaction } from 'kysely';
import { Pool } from 'pg';

/**
 * Shared Postgres pool. `DATABASE_URL` is Neon's pooled URL for the unprivileged `app` role,
 * used by both Better Auth and app code. Migrations run as the owner from `.env.owner`.
 */
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Lets Vercel Fluid compute close idle clients before a function instance is suspended.
attachDatabasePool(pool);

/** App tables, added here as migrations create them. */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- no app tables yet
export interface Database {}

export const db = new Kysely<Database>({ dialect: new PostgresDialect({ pool }) });

/**
 * Runs `work` in one transaction as `userId`, which RLS policies read through `app_user_id()`.
 * The setting ends with the transaction, so it never reaches the next user of a pooled
 * connection. App code calls `withUser` (features/auth/userDb.ts), which passes the signed-in user.
 */
export const asUser = <T>(
  userId: string,
  work: (tx: Transaction<Database>) => Promise<T>,
  database: Kysely<Database> = db,
): Promise<T> =>
  database.transaction().execute(async (tx) => {
    await sql`select set_config('app.user_id', ${userId}, true)`.execute(tx);
    return work(tx);
  });
