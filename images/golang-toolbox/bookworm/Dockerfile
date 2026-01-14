# syntax=docker/dockerfile:1

# ====================================================== VERSIONS ======================================================

# renovate: datasource=github-releases depName=golang/go versioning=loose
ARG GO_VERSION=1.25.0

# ==================================================== DOWNLOAD: GO ====================================================

FROM alpine AS dl-go
ARG GO_VERSION
ARG TARGETARCH

WORKDIR /tmp

RUN apk add --no-cache curl

RUN <<EOT ash
if [ "${TARGETARCH}" = "amd64" ]; then
  curl -L --fail "https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz" -o go.tar.gz
elif [ "${TARGETARCH}" = "arm64" ]; then
  curl -L --fail "https://go.dev/dl/go${GO_VERSION}.linux-arm64.tar.gz" -o go.tar.gz
else
  echo "Unsupported target architecture: ${TARGETARCH}"
  exit 1
fi
EOT

# ====================================================== PRODUCT =======================================================

FROM bitnami/minideb:bookworm

# Metadata
LABEL maintainer="kula app GmbH <opensource@kula.app>"
LABEL description="Container with Go toolchain and essential build tools based on Debian Bookworm"

# Install build dependencies and tools
RUN apt-get update -y && apt-get install -y --no-install-recommends \
  # Build tools
  make \
  gcc \
  g++ \
  libc6-dev \
  pkg-config \
  # Version control
  git \
  # HTTPS support
  ca-certificates \
  curl \
  # Shell
  bash \
  # Utilities
  unzip \
  # Cleanup
  && apt-get clean && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives

# Install Go
COPY --from=dl-go /tmp/go.tar.gz /tmp/
RUN tar -C /usr/local -xzf /tmp/go.tar.gz && \
    rm /tmp/go.tar.gz

# Set Go environment variables
ENV PATH="/usr/local/go/bin:${PATH}"
ENV GOPATH="/go"
ENV PATH="${GOPATH}/bin:${PATH}"

# Create GOPATH directory structure
RUN mkdir -p "${GOPATH}/src" "${GOPATH}/bin" && \
    chmod -R 777 "${GOPATH}"

# Smoke tests
RUN set -x && \
    go version && \
    make --version && \
    gcc --version && \
    g++ --version && \
    git --version && \
    bash --version

# Set working directory
WORKDIR /workspace
