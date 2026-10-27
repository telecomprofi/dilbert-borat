# syntax=docker.io/docker/dockerfile:1

FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source files
COPY next.config.js ./
COPY pages ./pages
COPY components ./components
COPY styles ./styles
COPY public ./public

# Build with standalone output
RUN npm run build

# Production image
FROM node:18-alpine AS runner
WORKDIR /app

# Copy standalone output and static assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

# Set proper permissions and non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app

# Copy Dilbert_compressed directory as the last step
COPY Dilbert_compressed ./Dilbert_compressed

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
