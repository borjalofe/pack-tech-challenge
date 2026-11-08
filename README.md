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
pnpm run build   # production build
pnpm run preview # serve the production build
```

## Decisions

- [0001 — pnpm as package manager](docs/decisions/0001-pnpm-as-package-manager.md)
