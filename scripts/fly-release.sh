#!/bin/sh
# Fly release_command: schema + form catalogs only (ADR 0006 / #45 / #47).
# Never enable SEED_DEMO_DATA here — demo fixtures stay local/Compose opt-in.
set -eu

echo "Fly release: applying Drizzle migrations…"
pnpm db:migrate

echo "Fly release: seeding catalog (no demo resource rows)…"
pnpm db:seed

echo "Fly release: done."
