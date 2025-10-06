# =====================================================
# TrafficPro - Multi-Stage Dockerfile
# Build: Node 20 → dist/
# Runtime: Caddy (static file server)
# =====================================================

# ---- Stage 1: Build ----
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --prefer-offline --no-audit

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Verify dist directory exists
RUN ls -la /app/dist

# ---- Stage 2: Runtime ----
FROM caddy:2-alpine

LABEL maintainer="Mauro Duffrayer"
LABEL description="TrafficPro - Gestão Profissional de Tráfego Pago"

WORKDIR /srv

# Copy built assets from build stage
COPY --from=build /app/dist /srv/dist

# Copy Caddy configuration
COPY ops/Caddyfile /etc/caddy/Caddyfile

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Caddy runs automatically via the base image entrypoint
