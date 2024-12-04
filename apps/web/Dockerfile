ARG BUN_VERSION=latest
ARG NODE_VERSION=20.12.2
FROM imbios/bun-node:${BUN_VERSION}-${NODE_VERSION}-slim as base

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}


FROM base AS deps
WORKDIR /app

COPY package.json bun.lockb ./
COPY apps/web/package.json ./apps/web/

COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/ui/package.json ./packages/ui/
COPY packages/algorithms/package.json ./packages/algorithms/

RUN bun install

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules


WORKDIR /app

RUN bun run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/apps/web/next.config.mjs ./
COPY --from=builder /app/apps/web/package.json ./

COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "apps/web/server.js"]
