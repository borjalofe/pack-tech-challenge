# 0001 — pnpm as package manager

- Status: Accepted
- Date: 2026-11-08
- Issue: #13

## Context

The Pack take-home needs one install path and a committed lockfile so evaluators and CI get the same dependency graph. npm and yarn would also install a SvelteKit app; the milestone already specifies **pnpm**.

## Decision

Use **pnpm** only:

- `packageManager` in `package.json` pins the tooling version
- `pnpm-lock.yaml` is the source of truth for installs
- Documented commands use `pnpm` (not npm/yarn)

## Consequences

- Fresh clones need Corepack or a local pnpm matching `packageManager`
- Later CI and feature tasks assume `pnpm install` / `pnpm run …` at the repo root
