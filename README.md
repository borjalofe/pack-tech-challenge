# pack-tech-challenge

SvelteKit + TypeScript app for the Pack resources take-home. Package manager: **pnpm**.

## Stack

| Piece | Choice |
| --- | --- |
| App | SvelteKit (Svelte 5) + TypeScript |
| Bundler | Vite |
| Package manager | pnpm (`packageManager` + lockfile) |

## How to run

**Prerequisite:** Node.js ≥ 22 and [pnpm](https://pnpm.io/installation) (or Corepack: `corepack enable`).

```sh
pnpm install
pnpm run dev
```

App: [http://localhost:5173](http://localhost:5173)

Other commands that work today:

```sh
pnpm run check   # svelte-check / TypeScript
pnpm lint        # prettier + eslint
pnpm test        # vitest unit
pnpm run audit   # SCA, fail on high+
pnpm run build   # production build
pnpm run preview # serve the production build
```

## PR gate

PRs to `main` run `.github/workflows/pr-gate.yml` (gate v0): typecheck + lint, unit tests, and `pnpm run audit` at high severity. Local equivalents are the commands above.

## Daily vulnerability scan

Independent of the PR gate: `.github/workflows/daily-audit.yml` runs `pnpm run audit` (high threshold) on a daily schedule and on demand.

Manual run (Actions UI or CLI):

```sh
gh workflow run "Daily audit" --ref main
```

Container image scanning is **N/A** until this repo ships a container image.

## Decisions

- [0001 — pnpm as package manager](docs/decisions/0001-pnpm-as-package-manager.md)
