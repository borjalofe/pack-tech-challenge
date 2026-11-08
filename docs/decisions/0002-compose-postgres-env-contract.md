# 0002 — Compose Postgres + env contract

- Status: Accepted
- Date: 2026-11-08
- Issue: #16

## Context

Later upload/API work needs a stable local Postgres and credentials pattern before any `app` Compose service exists.

## Decision

- Use Docker Compose (`compose.yaml`) with service name **`db` only** for now.
- Ship Postgres 16 with healthcheck and a named volume.
- Keep credentials and ports in **`.env` / `.env.example`** — non-default user/password/db (`pack` / `pack_dev_change_me` / `pack_challenge`), never bake secrets into the compose file.
- Host apps use `DATABASE_URL` → `localhost`; a future in-compose app uses hostname **`db`**.

## Consequences

- Upload/API issues can attach an `app` service without renaming `db`.
- Local-only defaults are fine for the take-home; production secrets stay out of the repo.
