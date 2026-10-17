# ==============================================================================
# Multi-Stage Production Dockerfile for Ariya Sarrafzadeh Portfolio
# Produces a minimal (~25MB) hardened Nginx static container
# ==============================================================================

# Stage 1: Build static assets
FROM node:20-alpine AS builder

WORKDIR /app

# Cache dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: High-Performance Static Server
FROM nginx:alpine-slim

# Copy custom hardened Nginx configuration
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

# Copy pre-rendered static artifacts from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
