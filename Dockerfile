# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Current corepack honors the repo's pinned pnpm@11.10.0 (packageManager field)
RUN npm install -g corepack@latest && corepack enable
WORKDIR /app

FROM base AS build
# husky's prepare script has no .git to hook into inside the build
ENV HUSKY=0
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile
COPY . .
# APP_ENV selects the app config; override per Coolify environment via build arg
ARG APP_ENV=prod
ENV APP_ENV=${APP_ENV} \
    NEXT_TELEMETRY_DISABLED=1
RUN --mount=type=cache,id=next-cache,target=/app/.next/cache \
    pnpm build

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ARG APP_ENV=prod
ENV NODE_ENV=production \
    APP_ENV=${APP_ENV} \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]
