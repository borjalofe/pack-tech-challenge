#!/bin/sh
set -eu

# Fly release_command (and `docker run … <cmd>`) append args to ENTRYPOINT.
# When present, run that command instead of the default migrate/seed/start path.
if [ "$#" -gt 0 ]; then
	exec "$@"
fi

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
