# ========================================================
# 🦀 Production & Security-Hardened Multi-Stage Dockerfile
# Optimized for Render.com, Cloud Run, Fly.io & Kubernetes
# ========================================================

# 1. Builder Stage
FROM rust:1-slim-bookworm AS builder
WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    pkg-config \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Cache dependencies layer
COPY Cargo.toml Cargo.lock ./
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release
RUN rm -rf src target/release/deps/la_feria* target/release/la-feria*

# Build application with production release profile
COPY src ./src
RUN cargo build --release

# 2. Hardened Runtime Stage
FROM debian:bookworm-slim
WORKDIR /app

# Install minimal runtime certificates and healthcheck utility
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Security hardening: Dedicated unprivileged service user and group
RUN groupadd -g 10001 feria && \
    useradd -r -u 10001 -g feria -m -d /home/feria -s /sbin/nologin feria

# Create persistent storage directory for SQLite WAL database
RUN mkdir -p /data /app/public && \
    chown -R feria:feria /app /data /home/feria && \
    chmod 750 /data

# Copy compiled binary and static assets
COPY --from=builder --chown=feria:feria /app/target/release/la-feria /app/la-feria
COPY --chown=feria:feria public /app/public

# Run as unprivileged user
USER feria

# Production runtime environment variables
ENV PORT=3000
ENV DATABASE_PATH=/data/feria.db
ENV RUST_LOG=la_feria=info,tower_http=info
EXPOSE 3000

# Container Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT:-3000}/health || exit 1

# Execute La Feria Axum server
ENTRYPOINT ["/app/la-feria"]
