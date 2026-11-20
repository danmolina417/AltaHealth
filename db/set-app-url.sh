#!/usr/bin/env bash
# Gives the `app` role a new random password on one Neon branch and stores the matching
# DATABASE_URL in that Vercel environment. Use it to provision a branch after its migrations ran,
# and to rotate the password. No secret is printed or passed as a command-line argument.
#
#   db/set-app-url.sh <production|preview|development>
#
# It asks for the branch's *pooled* owner (neondb_owner) URL from the Neon console. Piped input
# works too.
set -euo pipefail

env=${1:-}
case "$env" in
  production | preview) sensitivity=--sensitive ;;
  development) sensitivity=--no-sensitive ;;
  *)
    echo "usage: $0 <production|preview|development>" >&2
    exit 64
    ;;
esac

read -rsp "Pooled owner URL of the Neon branch for $env: " owner_url
echo >&2
case "$owner_url" in
  *-pooler.*) ;;
  *)
    echo "That isn't a pooled URL: its host should contain '-pooler.'." >&2
    exit 65
    ;;
esac

password=$(openssl rand -hex 32)

psql "$owner_url" --quiet --no-psqlrc -v ON_ERROR_STOP=1 <<<"alter role app password '$password';"

# Same host and database, as `app`, verifying the server certificate.
app_url=$(OWNER_URL="$owner_url" APP_PASSWORD="$password" node -e '
  const url = new URL(process.env.OWNER_URL);
  url.username = "app";
  url.password = process.env.APP_PASSWORD;
  url.searchParams.set("sslmode", "verify-full");
  process.stdout.write(url.toString());
')

# Connect the way the app does before storing the URL.
APP_URL="$app_url" node -e '
  const { Client } = require("pg");
  const client = new Client({ connectionString: process.env.APP_URL });
  client
    .connect()
    .then(() => client.query("select current_user"))
    .then(({ rows }) => {
      if (rows[0].current_user !== "app") throw new Error(`connected as ${rows[0].current_user}`);
    })
    .finally(() => client.end())
    .catch((error) => {
      console.error(`The app role could not connect: ${error.message}`);
      process.exit(1);
    });
'

printf %s "$app_url" | vercel env add DATABASE_URL --environment "$env" "$sensitivity" --force --yes >/dev/null
echo "DATABASE_URL for $env now connects as app." >&2
