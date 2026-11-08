# Pack brand tokens (chrome)

- Status: Accepted for M1 chrome (#19)
- Sources: [`source/`](./source/) Pack take-home screenshots

## Reference screenshots

| File | Scene |
| --- | --- |
| [`01-unfilled-upload-wizard.png`](./source/01-unfilled-upload-wizard.png) | Resources page + empty Upload modal (modal out of scope here) |
| [`02-filled-upload-wizard.png`](./source/02-filled-upload-wizard.png) | Filled modal (out of scope) |
| [`03-table-uploaded-content.png`](./source/03-table-uploaded-content.png) | Resources table chrome — primary visual target for this issue |

Prefer non-dimmed chrome from (3) when sampling colors.

## Token anchors in code

| Role | Value | CSS / JS |
| --- | --- | --- |
| Primary / CTA | `#FC8034` | `--color-primary` / `PACK_TOKENS.color.primary` |
| Page wash | `#F9FAFC` | `--color-page` |
| Surface | `#FFFFFF` | `--color-surface` |
| Muted text | `#5C5C5C` | `--color-muted` |
| Success | `#1C9C70` | `--color-success` |
| Radius | 4–8px | `--radius-sm` / `--radius-md` |
| Soft shadow | `0 4px 16px 0 rgba(0,0,0,.15)` | `--shadow-soft` |
| Content width | `1120px` | `--width-content` |
| Sans | Inter + system-ui | `--font-sans` |

Authoritative modules: `src/lib/styles/tokens.ts`, `src/lib/styles/tokens.css`.

## Chrome owned by #19

Header (logo **pack**, nav with Resources active underline, US flag + avatar), white card + soft shadow, toolbar (chart + type tabs + Field loupe + disabled Upload), FAB chat + green status. No upload modal. No table body.
