# 0006 — Fly.io as public deploy host (Pack AWS-shaped)

- Status: Accepted
- Date: 2026-11-09
- Issue: #44 (epic #26)

## Context

Pack’s environment is AWS-shaped (container compute, managed Postgres, secrets, healthchecks). A full **SST + AWS** account bootstrap for this take-home exceeds the remaining time budget. Local Compose + `adapter-node` already prove the app; a public host is still useful for portfolio evidence without pretending the app is already deployed.

The deploy epic (#26) splits host choice (this ADR) from migrate/seed split (#45), runtime hardening (#46), Fly wiring (#47), and a later verify pass (#48). Blob/object storage remains Epic #25 / ADR territory — not decided here.

## Decision

Choose **Fly.io** as the intended public deploy host for this repository:

- Run the existing **Node adapter** image (same Dockerfile direction as Compose `app`).
- Attach **Fly Postgres** (or equivalent managed Postgres on Fly) with secrets via `fly secrets`.
- Use **healthchecks** and a release/migrate command so schema applies on deploy.
- Treat the shape as closer to **ECS/Fargate + RDS + secrets + health** than to a git-push PaaS: you bring a container, wire networking/volumes/secrets, and own the process model.

This ADR does **not** claim a live Fly app exists, and does **not** add `fly.toml` or change the Dockerfile (those belong to #46–#47).

## Rejected alternatives

| Option | Why not for this take-home |
| --- | --- |
| **Railway** | Faster to a URL, but less AWS-like: more PaaS “git push / plugin Postgres” and fewer explicit image + healthcheck + release-command habits Pack’s shape implies. |
| **Vercel-only** | Poor fit for long-lived Node + multipart upload + Postgres next to a local filesystem (or soon S3) store; serverless request limits and ephemeral FS fight the current architecture. |
| **Raw VPS** | Full control, but ops tax (TLS, Postgres, restarts, backups) without matching Pack’s managed-service story; more time than Fly for the same portfolio signal. |
| **Full SST/AWS now** | Correct long-term employer shape, but account/bootstrap/IAM/CDK-or-SST time exceeds the deferred NTH slice for this challenge. |

## Consequences

- Follow-on tasks implement Fly runtime and config (#46–#48); this file only locks the host choice.
- **Production migrate must not load demo resource rows** — schema + form catalogs only. Demo seed stays a local/dev concern (sibling task #45).
- Prefer completing Epic #25 (S3-compatible blobs) before a public verify pass (#48) so uploads survive machine replace; until then, local/volume semantics remain the Compose path.
- README may link this ADR under Decisions; do **not** add an empty “Deploy” product section that implies the app is live.
