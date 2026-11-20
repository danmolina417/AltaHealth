import { execFileSync } from 'node:child_process';
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import pg from 'pg';
import type { TestProject } from 'vitest/node';

declare module 'vitest' {
  export interface ProvidedContext {
    /** The database owner, as `neondb_owner` on Neon: runs migrations, bypasses RLS. */
    ownerUrl: string;
    /** The `app` role, as the running app connects. */
    appUrl: string;
  }
}

let container: StartedPostgreSqlContainer | undefined;

/**
 * Starts a throwaway Postgres (the major version Neon runs), sets it up like Neon (a
 * non-superuser owner with CREATEROLE and BYPASSRLS owns the database) and runs the migrations.
 */
export default async function setup(project: TestProject) {
  container = await new PostgreSqlContainer('postgres:18-alpine').start();
  const superuserUrl = container.getConnectionUri();

  const urlFor = (user: string, password: string) => {
    const url = new URL(superuserUrl);
    url.username = user;
    url.password = password;
    url.pathname = '/alta';
    url.searchParams.set('sslmode', 'disable');
    return url.toString();
  };

  const admin = new pg.Client({ connectionString: superuserUrl });
  await admin.connect();
  await admin.query(`create role owner login createrole bypassrls password 'owner'`);
  await admin.query('create database alta owner owner');
  await admin.end();

  const ownerUrl = urlFor('owner', 'owner');
  const dbmate = (command: string) =>
    execFileSync('node_modules/.bin/dbmate', ['--url', ownerUrl, '--no-dump-schema', command], {
      stdio: 'pipe',
    });
  // Rolling back and re-applying the latest migration keeps its down section working.
  dbmate('up');
  dbmate('rollback');
  dbmate('up');

  const owner = new pg.Client({ connectionString: ownerUrl });
  await owner.connect();
  await owner.query(`alter role app password 'app'`);
  await owner.end();

  project.provide('ownerUrl', ownerUrl);
  project.provide('appUrl', urlFor('app', 'app'));
}

export async function teardown() {
  await container?.stop();
}
