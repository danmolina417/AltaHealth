import 'server-only';
import type { Transaction } from 'kysely';
import { asUser, type Database } from '@/lib/db';
import { requireUser } from './session';

/**
 * The way app code reads and writes user data: runs `work` in one transaction as the signed-in
 * user, so RLS limits every query to their rows. Redirects to login when signed out.
 *
 * @example
 * const appointments = await withUser((tx) => tx.selectFrom('appointments').selectAll().execute());
 */
export const withUser = async <T>(work: (tx: Transaction<Database>) => Promise<T>): Promise<T> =>
  asUser((await requireUser()).id, work);
