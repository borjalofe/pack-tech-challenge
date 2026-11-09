#!/bin/sh
set -eu

echo "Applying Drizzle migrations…"
pnpm db:migrate

echo "Seeding catalog (no demo resource rows)…"
pnpm db:seed

if [ "${SEED_DEMO_DATA:-}" = "true" ]; then
	echo "SEED_DEMO_DATA=true — seeding local demo resource row…"
	pnpm db:seed:demo
fi

echo "Starting SvelteKit app on :${PORT:-3000}"
exec node build
