# Production multi-stage image: build with adapter-node, run migrate/catalog seed, then listen.
# No .env secrets are copied (see .dockerignore). Demo resource seed stays opt-in via SEED_DEMO_DATA.
FROM node:22-bookworm-slim AS base
WORKDIR /app
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@11.18.0 --activate

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS build
# Must match the browser URL (Compose publishes APP_PORT → localhost; Fly sets its own ARG).
ARG ORIGIN=http://localhost:3000
ENV ORIGIN=$ORIGIN
COPY . .
RUN pnpm build

FROM base AS runtime
ENV NODE_ENV=production
ENV PORT=3000
ENV FILE_STORAGE_ROOT=/data/file-store
ENV HOME=/home/pack

RUN groupadd --system pack \
	&& useradd --system --gid pack --create-home --home-dir /home/pack pack \
	&& mkdir -p /data/file-store /app \
	&& chown -R pack:pack /data/file-store /home/pack

WORKDIR /app

COPY --chown=pack:pack package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --chown=pack:pack --from=deps /app/node_modules ./node_modules
COPY --chown=pack:pack --from=build /app/build ./build
COPY --chown=pack:pack --from=build /app/drizzle ./drizzle
COPY --chown=pack:pack --from=build /app/src/lib/server/db ./src/lib/server/db
# seed re-exports shared catalog via ../../catalog.js
COPY --chown=pack:pack --from=build /app/src/lib/catalog.ts ./src/lib/catalog.ts
COPY --chown=pack:pack --from=build /app/drizzle.config.ts ./drizzle.config.ts
COPY --chown=pack:pack scripts/docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER pack
EXPOSE 3000
VOLUME ["/data/file-store"]
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
	CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
ENTRYPOINT ["/entrypoint.sh"]
