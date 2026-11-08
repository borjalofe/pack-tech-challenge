#!/bin/sh
set -eu

echo "Applying Drizzle migrations…"
pnpm db:migrate

echo "Seeding catalog…"
pnpm db:seed

echo "Starting SvelteKit app on :${PORT:-3000}"
exec node build
