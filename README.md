# pack-tech-challenge

SvelteKit + TypeScript app for the Pack resources take-home. Package manager: **pnpm**.

## Stack

| Piece | Choice |
| --- | --- |
| App | SvelteKit (Svelte 5) + TypeScript |
| Bundler | Vite |
| Package manager | pnpm (`packageManager` + lockfile) |
| Database | Postgres 16 via Compose service `db` + Drizzle migrations |
| Upload validation | Shared Zod (`src/lib/validation/resource-upload.ts`) |
| File blobs | Local filesystem (`FILE_STORAGE_ROOT`) |

## How to run (Compose app + db)

**Prerequisite:** Docker.

```sh
cp .env.example .env
docker compose up --build
```

- App: [http://localhost:3000](http://localhost:3000) (`APP_PORT`)
- Postgres: `localhost:${POSTGRES_PORT:-5432}`
- Upload: `POST /api/resources` (multipart)
- List: `GET /api/resources` (public fields for the table; no `storagePath`)

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
pnpm run audit   # SCA, fail on high+
pnpm run build   # production build (Node adapter)
pnpm start       # node build
pnpm run preview # vite preview
```

Local reset: `docker compose down -v` then bring the stack up again.

## PR gate

PRs to `main` run `.github/workflows/pr-gate.yml` (gate v0): typecheck + lint, unit tests, db migrate/seed + upload integration, and `pnpm run audit` at high severity.

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
