# 0005 — Pack visual tokens + chrome shell

- Status: Accepted
- Date: 2026-11-08
- Issue: #19

## Context

M1 needs Pack-like Resources chrome before the upload modal and table body land. Vendor screenshots live under `docs/brand/source/`. Pixel-perfect match is out of scope; color/width hierarchy must read as Pack.

## Decision

- Lock **one** primary orange token: `#FC8034` (brief + Image-3 CTA). Do not use overlay-dimmed oranges from wizard screenshots as anchors.
- Page wash `#F9FAFC`, surfaces `#FFFFFF`, muted `#5C5C5C`, success `#1C9C70`, radii 4–8px, soft card shadow.
- Content card max-width **1120px** so the layout stays card-bound like Image 3 (not edge-stretched).
- Typeface: **Inter** with system-ui fallback via `--font-sans`.
- Implement chrome in-app under `src/lib/components/pack/` using CSS variables — no second design-system package in this milestone.

## Consequences

- Later table/modal issues reuse these tokens and must not rebuild header/card/FAB/tabs/Field chrome.
- Primary button text uses black (`--color-primary-foreground`) for AA contrast on `#FC8034`.
