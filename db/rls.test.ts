import { Kysely, PostgresDialect, sql } from 'kysely';
import pg from 'pg';
import { inject } from 'vitest';
import { asUser, type Database } from '@/lib/db';

// Runs against the migrated database from db/test/globalSetup.ts, connected the way the app is
// (`app`) and the way migrations are (the owner). `rls_probe` is a stand-in user-owned table
// built with the pattern every such table follows (see the app_role migration).

const userA = '00000000-0000-4000-8000-00000000000a';
const userB = '00000000-0000-4000-8000-00000000000b';

const owner = new pg.Pool({ connectionString: inject('ownerUrl') });
// One connection, so a test can tell whether a setting outlives its transaction.
const appPool = new pg.Pool({ connectionString: inject('appUrl'), max: 1 });
const app = new Kysely<Database>({ dialect: new PostgresDialect({ pool: appPool }) });

const notesOf = async (userId: string) =>
  (
    await owner.query('select note from rls_probe where user_id = $1 order by note', [userId])
  ).rows.map((row: { note: string }) => row.note);

beforeAll(async () => {
  await owner.query(`
    create table public.rls_probe (
      id uuid default pg_catalog.gen_random_uuid() not null primary key,
      user_id uuid not null default public.app_user_id()
        references auth.users (id) on delete cascade,
      note text not null
    );
    create index rls_probe_user_id_idx on public.rls_probe (user_id);
    alter table public.rls_probe enable row level security;
    create policy rls_probe_owner on public.rls_probe
      using (user_id = (select public.app_user_id()))
      with check (user_id = (select public.app_user_id()));

    insert into auth.users (id, name, email, email_verified) values
      ('${userA}', 'A', 'a@example.com', false),
      ('${userB}', 'B', 'b@example.com', false);
  `);
});

beforeEach(async () => {
  await owner.query(`
    delete from rls_probe;
    insert into rls_probe (user_id, note) values ('${userA}', 'a1'), ('${userB}', 'b1');
  `);
});

afterAll(async () => {
  await app.destroy();
  await owner.end();
});

describe('user data as the app role', () => {
  it('fails loudly outside withUser instead of returning nothing', async () => {
    await expect(sql`select * from rls_probe`.execute(app)).rejects.toThrow(
      'app.user_id is not set',
    );
    await expect(sql`insert into rls_probe (note) values ('x')`.execute(app)).rejects.toThrow(
      'app.user_id is not set',
    );
  });

  it('shows each user only their own rows', async () => {
    const { rows } = await asUser(
      userA,
      (tx) => sql<{ note: string }>`select note from rls_probe`.execute(tx),
      app,
    );

    expect(rows.map((row) => row.note)).toEqual(['a1']);
  });

  it("doesn't let a user change or delete another user's rows", async () => {
    const affected = await asUser(
      userA,
      async (tx) => ({
        updated: (await sql`update rls_probe set note = 'x' where user_id = ${userB}`.execute(tx))
          .numAffectedRows,
        deleted: (await sql`delete from rls_probe where user_id = ${userB}`.execute(tx))
          .numAffectedRows,
      }),
      app,
    );

    expect(affected).toEqual({ updated: 0n, deleted: 0n });
    expect(await notesOf(userB)).toEqual(['b1']);
  });

  it('writes new rows for the signed-in user', async () => {
    await asUser(userA, (tx) => sql`insert into rls_probe (note) values ('a2')`.execute(tx), app);

    expect(await notesOf(userA)).toEqual(['a1', 'a2']);
  });

  it('refuses rows written for, or handed over to, another user', async () => {
    await expect(
      asUser(
        userA,
        (tx) => sql`insert into rls_probe (user_id, note) values (${userB}, 'x')`.execute(tx),
        app,
      ),
    ).rejects.toThrow('row-level security');
    await expect(
      asUser(userA, (tx) => sql`update rls_probe set user_id = ${userB}`.execute(tx), app),
    ).rejects.toThrow('row-level security');

    expect(await notesOf(userB)).toEqual(['b1']);
  });

  it('forgets the user when the transaction ends', async () => {
    await asUser(userA, (tx) => sql`select 1`.execute(tx), app);

    // Same pooled connection, new transaction.
    await expect(sql`select public.app_user_id()`.execute(app)).rejects.toThrow(
      'app.user_id is not set',
    );
  });
});

describe('Better Auth as the app role', () => {
  it('reads and writes its own tables', async () => {
    const { rows } = await sql<{ id: string }>`
      insert into auth.verifications (identifier, value, expires_at)
      values ('test', 'value', now() + interval '1 hour')
      returning id
    `.execute(app);
    await sql`update auth.users set name = 'A' where id = ${userA}`.execute(app);
    await sql`delete from auth.verifications where id = ${rows[0]!.id}`.execute(app);

    const { rows: users } = await sql`select id from auth.users`.execute(app);
    expect(users.length).toBeGreaterThanOrEqual(2);
  });

  it("removes a user's app rows when it deletes the user", async () => {
    const userC = '00000000-0000-4000-8000-00000000000c';
    await owner.query(`
      insert into auth.users (id, name, email, email_verified) values ('${userC}', 'C', 'c@example.com', false);
      insert into rls_probe (user_id, note) values ('${userC}', 'c1');
    `);

    await sql`delete from auth.users where id = ${userC}`.execute(app);

    expect(await notesOf(userC)).toEqual([]);
  });
});

describe('the app role', () => {
  it("can't change the schema", async () => {
    await expect(sql`create table public.sneaky (id int)`.execute(app)).rejects.toThrow(
      'permission denied for schema public',
    );
    await expect(sql`alter table auth.users add column sneaky text`.execute(app)).rejects.toThrow(
      'must be owner',
    );
  });

  it("can't read the migration history", async () => {
    await expect(sql`select * from public.schema_migrations`.execute(app)).rejects.toThrow(
      'permission denied',
    );
  });

  it('has no special privileges', async () => {
    const { rows } = await owner.query(
      `select rolsuper, rolbypassrls, rolcreaterole, rolcreatedb from pg_roles where rolname = 'app'`,
    );

    expect(rows).toEqual([
      { rolsuper: false, rolbypassrls: false, rolcreaterole: false, rolcreatedb: false },
    ]);
  });
});

describe('the schema', () => {
  it('protects every app table with RLS and a policy', async () => {
    const { rows } = await owner.query(`
      select c.relname
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public'
        and c.relkind in ('r', 'p')
        and c.relname <> 'schema_migrations'
        and (not c.relrowsecurity or not exists (select 1 from pg_policy p where p.polrelid = c.oid))
    `);

    expect(rows).toEqual([]);
  });
});
