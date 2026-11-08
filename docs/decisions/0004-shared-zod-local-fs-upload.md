# 0004 — Shared Zod upload schema + local filesystem store

- Status: Accepted
- Date: 2026-11-08
- Issue: #17

## Context

#16 locked Drizzle + Compose `db`. #17 needs multipart create with one validation contract for client and server, durable bytes on disk, and a Compose `app` service. Cloud object storage is deferred.

## Decision

- Canonical create schema lives at **`src/lib/validation/resource-upload.ts`** (`resourceCreateSchema`). Future form UI imports this module (thin `File` adapter allowed); no second Zod contract.
- Store objects on the **local filesystem** under `FILE_STORAGE_ROOT` (default `var/file-store`), outside web static roots.
- Object keys are **`resources/<uuid>.<ext>`** from allowlisted MIME — never from client path segments; reject absolute keys and `..` traversal.
- Persist metadata with Drizzle; on insert failure after a write, delete the orphan object.
- Assume **single-user local demo** (no auth) for uploaded-by / access control.

## Consequences

- Upload security depends on Zod allowlists + random keys + rooted path resolution.
- List/download issues reuse the same store and schema.
- Compose `app` mounts `/data/file-store` and points `DATABASE_URL` at hostname `db`.
