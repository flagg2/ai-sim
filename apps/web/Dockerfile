# Use Bun as the base image

ARG BUN_VERSION=latest
ARG NODE_VERSION=20.12.2
FROM imbios/bun-node:${BUN_VERSION}-${NODE_VERSION}-slim as base

# Install dependencies
FROM base AS deps
WORKDIR /app

# Copy package.json files
COPY package.json bun.lockb ./
COPY apps/web/package.json ./apps/web/

COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/ui/package.json ./packages/ui/
COPY packages/algorithms/package.json ./packages/algorithms/

# Install dependencies
# ideally would freeze but doesnt work now and dont have the nerve to debug
# developed on mac, deploying on linux, cant be bothered to use a lockfile
RUN bun install
RUN bun install -g turbo

# Rebuild the source code
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules


# Build the project
WORKDIR /app

RUN bun run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy necessary files
COPY --from=builder /app/apps/web/next.config.mjs ./
COPY --from=builder /app/apps/web/package.json ./

# Automatically leverage output traces to reduce image size
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "apps/web/server.js"]
