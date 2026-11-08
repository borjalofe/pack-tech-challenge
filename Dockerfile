# SvelteKit app image — migrate/seed on start, then listen (Compose service `app`).
FROM node:22-bookworm-slim AS base
WORKDIR /app
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@11.18.0 --activate

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS build
# Must match the browser URL (Compose publishes APP_PORT → localhost).
ARG ORIGIN=http://localhost:3000
ENV ORIGIN=$ORIGIN
COPY . .
RUN pnpm build

FROM base AS runtime
ENV NODE_ENV=production
ENV PORT=3000
ENV FILE_STORAGE_ROOT=/data/file-store
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY --from=build /app/drizzle ./drizzle
COPY --from=build /app/src/lib/server/db ./src/lib/server/db
COPY --from=build /app/src/lib/catalog.ts ./src/lib/catalog.ts
COPY --from=build /app/drizzle.config.ts ./drizzle.config.ts
COPY scripts/docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 3000
VOLUME ["/data/file-store"]
ENTRYPOINT ["/entrypoint.sh"]
