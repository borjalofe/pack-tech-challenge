# 0003 — Drizzle for resources migration + catalog seed

- Status: Accepted
- Date: 2026-11-08
- Issue: #16

## Context

M1 needs a `resources` table (metadata, roles, file pointer, list placeholders) and dropdown catalog values before Zod or HTTP upload land. Compose Postgres is the target database.

## Decision

- Use **Drizzle ORM** + SQL migrations under `drizzle/` applied with `pnpm db:migrate`.
- Map resources columns for Pack upload/list (including `view_count` / `uploaded_by` placeholders).
- Store dropdown enums as Postgres enums on `resources` and seed human labels into `catalog_entries` via `pnpm db:seed`.

## Consequences

- Later API/UI work reuses the same schema under `src/lib/server/db/`.
- Prisma / TypeORM / raw-only runners are out of scope unless a later ADR replaces this.
- CI `db` job migrates and seeds against ephemeral Postgres on each PR.
