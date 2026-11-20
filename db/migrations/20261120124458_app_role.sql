-- migrate:up
-- The `app` role is what the running app connects as (DATABASE_URL). It owns nothing, can't
-- change the schema and doesn't bypass RLS. Its password is set per Neon branch with
-- db/set-app-url.sh, never here. Migrations run as the owner, from a URL kept only locally.

create role app login;

-- Better Auth reads and writes its own tables, including ones future plugins add.
grant usage on schema auth to app;
grant select, insert, update, delete on all tables in schema auth to app;
alter default privileges in schema auth
  grant select, insert, update, delete on tables to app;

-- App tables: read and write, always filtered by RLS (see README "Access control").
alter default privileges in schema public
  grant select, insert, update, delete on tables to app;

-- The signed-in user for the current transaction, set by `asUser` / `withUser` (lib/db.ts).
-- Raises instead of returning null, so a query that skips withUser fails loudly.
create function public.app_user_id() returns uuid
  language plpgsql
  stable
as $$
declare
  user_id text := nullif(current_setting('app.user_id', true), '');
begin
  if user_id is null then
    raise exception 'app.user_id is not set: query user data through withUser()';
  end if;
  return user_id::uuid;
end
$$;

-- Every table holding a user's data follows this pattern:
--
--   create table public.<things> (
--     id uuid default pg_catalog.gen_random_uuid() not null primary key,
--     user_id uuid not null default public.app_user_id()
--       references auth.users (id) on delete cascade,
--     ...
--   );
--   create index <things>_user_id_idx on public.<things> (user_id);
--   alter table public.<things> enable row level security;
--   create policy <things>_owner on public.<things>
--     using (user_id = (select public.app_user_id()))
--     with check (user_id = (select public.app_user_id()));

-- migrate:down

drop function public.app_user_id();

alter default privileges in schema public
  revoke select, insert, update, delete on tables from app;
alter default privileges in schema auth
  revoke select, insert, update, delete on tables from app;
revoke select, insert, update, delete on all tables in schema auth from app;
revoke usage on schema auth from app;

drop role app;
