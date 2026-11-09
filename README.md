# pack-tech-challenge

SvelteKit + TypeScript take-home: Pack-style **Resources** upload, list, and download, with Compose Postgres, shared Zod validation, and a green PR gate (unit + db + Playwright + audit).

## Problem

Operators need a small internal surface to upload mentoring resources (PDF and other allowlisted types), see them in a Pack-like table, and open the stored file again — without inventing a second validation contract or leaking filesystem paths to the browser.

## Who

- **Primary reader:** hiring / portfolio reviewer evaluating an M1 slice (≤3h must-path) against Pack visual refs.
- **Secondary:** a developer cloning the repo to run Compose + pnpm and exercise the happy path.

## Scope

### Includes (shipped in this repo)

- Bootstrap: SvelteKit 5, TypeScript, pnpm, Node adapter, Compose `db` + `app`
- Persistence: Drizzle schema/migrations, catalog seed, local file store under `FILE_STORAGE_ROOT`
- Write/read APIs: `POST` / `GET /api/resources`, download `GET /api/resources/:id/file`
- Shared Zod create schema used by API and Upload Resource modal (thin File adapter only)
- Pack chrome + tokens, upload modal (Images 1–2), table + success toast (Image 3), row download
- CI: PR gate (check, lint, unit, db integration, Playwright e2e, audit@high) + daily audit workflow

### Excludes (not built here)

- Functional search / tab filters (Field and tabs are presentational)
- Cloud object storage or signed URLs
- Production deploy target beyond Compose/`adapter-node`
- In-app rich file viewer (download/open only)

## Architecture

```text
Browser (Pack chrome + modal + table)
    │  multipart POST / JSON GET / file GET
    ▼
SvelteKit (Node adapter)
    ├── validation: shared Zod (#lib/validation/resource-upload)
    ├── resources: create / list / open-by-id
    └── storage: LocalFileStore → FILE_STORAGE_ROOT (keys via UUID, not client paths)
            │
            ▼
        Postgres 16 (Compose service `db`)
```

| Piece | Choice in this repo |
| --- | --- |
| App | SvelteKit (Svelte 5) + TypeScript |
| Bundler | Vite |
| Package manager | pnpm (`packageManager` + lockfile) |
| Database | Postgres 16 via Compose `db` + Drizzle |
| Upload validation | Shared Zod + client File adapter |
| File blobs | Local filesystem (`FILE_STORAGE_ROOT`) |
| UI | Pack CSS tokens + `src/lib/components/pack/` |

**Brand refs:** [`docs/brand/TOKENS.md`](docs/brand/TOKENS.md), screenshots in [`docs/brand/source/`](docs/brand/source/) (01–03 upload wizard / table).

## Decisions

Recorded ADRs (accepted):

- [0001 — pnpm as package manager](docs/decisions/0001-pnpm-as-package-manager.md) (2026-11-08)
- [0002 — Compose Postgres + env contract](docs/decisions/0002-compose-postgres-env-contract.md) (2026-11-08)
- [0003 — Drizzle for resources migration + catalog seed](docs/decisions/0003-drizzle-resources-migration.md) (2026-11-08)
- [0004 — Shared Zod upload schema + local filesystem store](docs/decisions/0004-shared-zod-local-fs-upload.md) (2026-11-08)
- [0005 — Pack visual tokens + chrome shell](docs/decisions/0005-pack-visual-tokens.md) (2026-11-08)
- [0006 — Fly.io as public deploy host (Pack AWS-shaped)](docs/decisions/0006-deploy-host-fly.md) (2026-11-09) — host choice only; app is **not** deployed yet

Operational notes that grew from the same work (documented in code/env, not separate ADRs): bake `ORIGIN` into `kit.paths.origin` at build for HTTP multipart CSRF; keep dropdown catalog in client-safe `src/lib/catalog.ts` (server re-exports).

## How to run

### Compose app + db

**Prerequisite:** Docker.

```sh
cp .env.example .env
docker compose up --build
```

Set `ORIGIN` in `.env` before `pnpm build` / Compose image build so it matches the browser URL (multipart CSRF). Compose passes `ORIGIN=http://localhost:${APP_PORT}` as a build arg.

- App: [http://localhost:3000](http://localhost:3000) (`APP_PORT`)
- Postgres: `localhost:${POSTGRES_PORT:-5432}`
- Upload UI: Resources → **Upload**
- APIs: `POST` / `GET /api/resources`; download `GET /api/resources/:id/file`

Example upload:

```sh
curl -sS -X POST "http://localhost:3000/api/resources" \
  -F "title=Conflict Resolution Basics" \
  -F "description=A short introduction" \
  -F "category=conflict-resolution" \
  -F "language=en" \
  -F "provider=pack" \
  -F "roles=mentor-coach" \
  -F "file=@./path/to/file.pdf;type=application/pdf"
```

Example list:

```sh
curl -sS "http://localhost:3000/api/resources"
```

Response shape: `{ items, total }`. Public fields only (no `storagePath`). Search/filter query params are not wired.

### Host pnpm + Compose db

**Prerequisite:** Node.js ≥ 22, pnpm, Docker.

```sh
cp .env.example .env
docker compose up -d db
pnpm install
pnpm db:migrate
pnpm db:seed        # catalogs only — resources stay empty (prod-safe)
pnpm db:seed:demo   # optional local DX: one sample resource row + blob
pnpm run dev
```

App (Vite): [http://localhost:5173](http://localhost:5173).

`pnpm db:seed` (and Compose/`Fly` entrypoints) load **form catalogs only**. Demo resource rows are **opt-in**: `pnpm db:seed:demo`, or `SEED_DEMO_DATA=true` for the Compose app entrypoint. **Do not set `SEED_DEMO_DATA` on production/Fly** so the public URL starts with an empty table (ADR 0006 / #45).

```sh
pnpm run check   # svelte-check / TypeScript
pnpm lint        # prettier + eslint
pnpm test        # vitest unit (+ DB integration when DATABASE_URL is set)
pnpm test:e2e    # Playwright (build with matching ORIGIN first)
pnpm run audit   # SCA, fail on high+
pnpm run build   # production build (adapter-node → build/)
pnpm start       # NODE_ENV=production node build
```

Local reset: `docker compose down -v` then bring the stack up again.

### Production build / Docker image (no Fly URL yet)

Host process (DB must already be migrated/seeded):

```sh
ORIGIN=http://localhost:3000 pnpm run build
pnpm start
# probe: curl -sS http://127.0.0.1:3000/healthz
```

Image (multi-stage `Dockerfile`, non-root `pack` user; `.env` is not copied):

```sh
docker build --build-arg ORIGIN=http://localhost:3000 -t pack-tech-challenge:local .
docker run --rm -p 3000:3000 \
  -e DATABASE_URL=postgresql://pack:pack_dev_change_me@host.docker.internal:5432/pack_challenge \
  -e ORIGIN=http://localhost:3000 \
  -e FILE_STORAGE_ROOT=/data/file-store \
  pack-tech-challenge:local
```

- `GET /healthz` → `{ status, db }` (`db` is `ok` | `error` | `skipped`; HTTP 503 when degraded).
- Compose `docker compose up --build` remains the supported full local stack; Fly wiring is a later issue — **no public deploy URL is claimed here**.

### Playwright e2e locally

```sh
docker compose up -d db
pnpm db:migrate && pnpm db:seed
ORIGIN=http://localhost:4173 pnpm run build
E2E_PORT=4173 E2E_BASE_URL=http://localhost:4173 pnpm test:e2e
```

Specs: `e2e/upload-resource.spec.ts`, `e2e/resources-table.spec.ts`, `e2e/row-download.spec.ts`.

## Evidence

| Claim | Where it lives |
| --- | --- |
| PR acceptance gate | [`.github/workflows/pr-gate.yml`](.github/workflows/pr-gate.yml) |
| Daily vulnerability scan | [`.github/workflows/daily-audit.yml`](.github/workflows/daily-audit.yml) |
| Shared Zod + upload API | `src/lib/validation/resource-upload.ts`, `src/routes/api/resources/+server.ts` |
| List + download | `src/lib/server/resources/list-resources.ts`, `src/routes/api/resources/[id]/file/+server.ts` |
| Pack UI | `src/lib/components/pack/`, `src/lib/styles/tokens.css` |
| Brand screenshots / token notes | [`docs/brand/`](docs/brand/) |
| Path safety (no `../`) | `src/lib/server/storage/object-key.ts`, `open-resource.spec.ts` |
| E2E happy path | `e2e/row-download.spec.ts` (upload → toast → row → download bytes) |
| Empty resources after default migrate | `src/lib/server/db/seed-demo.integration.spec.ts` |

## Lessons learned (this repo)

Failures and fixes that showed up while building M1 here — not borrowed from other projects:

1. **`$lib/server` catalog broke the client build.** Importing dropdown constants from `#lib/server/db/catalog` into the Upload dialog tripped SvelteKit `server_only_import` after Vite’s client build. Fix: move the catalog to client-safe [`src/lib/catalog.ts`](src/lib/catalog.ts) and re-export from the server path for existing modules.
2. **Multipart CSRF vs HTTP.** `adapter-node` derives `https` when `paths.origin` is unset, so browser `Origin: http://…` failed with “Cross-site POST form submissions are forbidden.” Fix: bake `ORIGIN` into `kit.paths.origin` at build (see `vite.config.ts`, Compose build arg, `.env.example`).
3. **Runtime image missing shared catalog.** After the catalog move, Compose seed failed until the Dockerfile copied `src/lib/catalog.ts` into the runtime image (follow-up fix PRs on `main`).
4. **Playwright strict mode on duplicate titles.** Re-running Image 3 e2e against a dirty DB matched multiple rows. Fix: unique titles with `Date.now()` in the table e2e.
5. **Download filename headers.** Attachment `Content-Disposition` needed ASCII-safe sanitization so odd filenames cannot break the header (`open-resource.ts` + gate follow-up formatting).

## Brand / product surface (what exists)

Pack visual tokens, Resources chrome (header, card, tabs, Field, Upload, FAB), Upload Resource modal, table + toast, row download/open.

- Tokens: [`src/lib/styles/tokens.css`](src/lib/styles/tokens.css) / [`src/lib/styles/tokens.ts`](src/lib/styles/tokens.ts)
- Notes + screenshots: [`docs/brand/`](docs/brand/)
- Toast copy: `Resource Uploaded Successfully!` (success `#1C9C70`)

## PR gate

PRs to `main` run `.github/workflows/pr-gate.yml`: typecheck + lint, unit tests, db migrate/seed + upload/list integration, Playwright e2e (upload → list → open), and `pnpm run audit` at high severity.

## Daily vulnerability scan

Independent of the PR gate: `.github/workflows/daily-audit.yml` runs `pnpm run audit` (high threshold) on a daily schedule and on demand.

```sh
gh workflow run "Daily audit" --ref main
```

Container image scanning is **N/A** until a dedicated image-scanning job is added (Compose already builds an `app` image for runtime).

## Next steps (NTH intent — not shipped)

These are deferred nice-to-haves tracked as review/intent only ([epic #12](https://github.com/borjalofe/pack-tech-challenge/issues/12)). **None of the following are implemented in this repo.**

| Intent | Why it was deferred | Issue |
| --- | --- | --- |
| Wire search + tab filters | Field/tabs are presentational in M1; filter query params are not on the list API | [#24](https://github.com/borjalofe/pack-tech-challenge/issues/24) |
| Cloud object storage | Local `FILE_STORAGE_ROOT` keeps the ≤3h path small; cloud would swap the store adapter | [#25](https://github.com/borjalofe/pack-tech-challenge/issues/25) |
| Deploy on Fly.io | Host chosen ([ADR 0006](docs/decisions/0006-deploy-host-fly.md)); runtime/`fly.toml`/verify not shipped | [#26](https://github.com/borjalofe/pack-tech-challenge/issues/26) / [#44](https://github.com/borjalofe/pack-tech-challenge/issues/44) |
| In-app file viewer | M1 opens/downloads via attachment; rich in-browser preview is separate | [#27](https://github.com/borjalofe/pack-tech-challenge/issues/27) |
