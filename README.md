# pack-tech-challenge

SvelteKit + TypeScript app for the Pack resources take-home. Package manager: **pnpm**.

## Stack

| Piece | Choice |
| --- | --- |
| App | SvelteKit (Svelte 5) + TypeScript |
| Bundler | Vite |
| Package manager | pnpm (`packageManager` + lockfile) |
| Database | Postgres 16 via Compose service `db` + Drizzle migrations |
| Upload validation | Shared Zod (`src/lib/validation/resource-upload.ts`) + client File adapter |
| File blobs | Local filesystem (`FILE_STORAGE_ROOT`) |
| UI tokens | Pack CSS vars (`src/lib/styles/tokens.css`) — primary `#FC8034` |
| Upload UI | Pack modal (`UploadResourceDialog`) → `POST /api/resources` |

## How to run (Compose app + db)

**Prerequisite:** Docker.

```sh
cp .env.example .env
docker compose up --build
```

Set `ORIGIN` in `.env` before `pnpm build` / Compose image build so it matches the browser URL (multipart CSRF). Compose passes `ORIGIN=http://localhost:${APP_PORT}` as a build arg.

- App: [http://localhost:3000](http://localhost:3000) (`APP_PORT`)
- Postgres: `localhost:${POSTGRES_PORT:-5432}`
- Upload UI: Resources → **Upload** (modal uses shared Zod, then `POST /api/resources`)
- Upload API: `POST /api/resources` (multipart)
- List: `GET /api/resources` (public fields for the table; no `storagePath`)
- Download/open: `GET /api/resources/:id/file` (id lookup only; attachment + stored Content-Type)

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

Response shape: `{ items, total }`. Each item includes table-oriented fields such as `title`, `fileOriginalName` (path/filename column), `viewCount`, `uploadedBy`, `provider`, and `category` (type), plus other public metadata. Search/filter query params are not wired yet.

Shared Zod import path for later UI: `src/lib/validation/resource-upload.ts` (or `#lib/validation/resource-upload.js`).

## How to run (host pnpm + Compose db)

**Prerequisite:** Node.js ≥ 22, pnpm, Docker.

```sh
cp .env.example .env
docker compose up -d db
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm run dev
```

App (Vite): [http://localhost:5173](http://localhost:5173) — same `POST` / `GET /api/resources` against the host-running SvelteKit process.

Other commands that work today:

```sh
pnpm run check   # svelte-check / TypeScript
pnpm lint        # prettier + eslint
pnpm test        # vitest unit (+ DB integration when DATABASE_URL is set)
pnpm test:e2e    # Playwright: upload modal, table/toast, row download (build with matching ORIGIN first)
pnpm run audit   # SCA, fail on high+
pnpm run build   # production build (Node adapter; reads ORIGIN for CSRF)
pnpm start       # node build
pnpm run preview # vite preview
```

Local reset: `docker compose down -v` then bring the stack up again.

## Brand / chrome + upload form + table

Pack visual tokens, Resources page chrome (header, card, tabs, Field, Upload, FAB), the **Upload Resource** modal (Images 1–2), the **table body + success toast** (Image 3), and **row download/open**.

- Tokens: [`src/lib/styles/tokens.css`](src/lib/styles/tokens.css) / [`src/lib/styles/tokens.ts`](src/lib/styles/tokens.ts)
- Notes + screenshots: [`docs/brand/`](docs/brand/)
- Shell / modal / table / toast: `src/lib/components/pack/`
- Shared Zod: `src/lib/validation/resource-upload.ts` (client adapter: `resource-upload-client.ts`)
- Dropdown catalog (client-safe): `src/lib/catalog.ts`
- Table binds to `GET /api/resources` (SSR load + refresh after upload)
- Toast copy after successful upload: `Resource Uploaded Successfully!` (success token `#1C9C70`)
- Title / ⋮ open `GET /api/resources/:id/file` (no client path; missing → 404)

## PR gate

PRs to `main` run `.github/workflows/pr-gate.yml` (gate v0): typecheck + lint, unit tests, db migrate/seed + upload integration, Playwright e2e (upload → list → open), and `pnpm run audit` at high severity.

```sh
# Local e2e (Compose db up; ORIGIN must match Playwright baseURL at build time)
cp .env.example .env   # if needed
docker compose up -d db
pnpm db:migrate && pnpm db:seed
ORIGIN=http://localhost:4173 pnpm run build
E2E_PORT=4173 E2E_BASE_URL=http://localhost:4173 pnpm test:e2e
```

Specs live under `e2e/` (`upload-resource`, `resources-table`, `row-download`).

## Daily vulnerability scan

Independent of the PR gate: `.github/workflows/daily-audit.yml` runs `pnpm run audit` (high threshold) on a daily schedule and on demand.

Manual run (Actions UI or CLI):

```sh
gh workflow run "Daily audit" --ref main
```

Container image scanning is **N/A** until a dedicated image-scanning job is added (Compose already builds an `app` image for runtime).

## Decisions

- [0001 — pnpm as package manager](docs/decisions/0001-pnpm-as-package-manager.md)
- [0002 — Compose Postgres + env contract](docs/decisions/0002-compose-postgres-env-contract.md)
- [0003 — Drizzle for resources migration + catalog seed](docs/decisions/0003-drizzle-resources-migration.md)
- [0004 — Shared Zod upload schema + local filesystem store](docs/decisions/0004-shared-zod-local-fs-upload.md)
- [0005 — Pack visual tokens + chrome shell](docs/decisions/0005-pack-visual-tokens.md)
