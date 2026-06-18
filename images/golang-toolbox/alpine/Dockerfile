# syntax=docker/dockerfile:1

# ====================================================== VERSIONS ======================================================

# renovate: datasource=docker depName=alpine versioning=loose
ARG ALPINE_VERSION=3.24
# renovate: datasource=github-releases depName=golang/go versioning=loose
ARG GO_VERSION=1.26.3
# renovate: datasource=github-releases depName=dprint/dprint versioning=loose
ARG DPRINT_VERSION=0.54.0
# renovate: datasource=go depName=honnef.co/go/tools versioning=semver
ARG STATICCHECK_VERSION=0.7.0
# renovate: datasource=go depName=golang.org/x/vuln versioning=semver
ARG GOVULNCHECK_VERSION=1.4.0

# ==================================================== DOWNLOAD: GO ====================================================

FROM alpine:${ALPINE_VERSION} AS dl-go
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

# ================================================== DOWNLOAD: DPRINT ==================================================

FROM alpine:${ALPINE_VERSION} AS dl-dprint
ARG DPRINT_VERSION
ARG TARGETARCH

WORKDIR /tmp

RUN apk add --no-cache curl unzip

RUN <<EOT ash
if [ "${TARGETARCH}" = "amd64" ]; then
  curl -L --fail "https://github.com/dprint/dprint/releases/download/${DPRINT_VERSION}/dprint-x86_64-unknown-linux-musl.zip" -o dprint.zip
elif [ "${TARGETARCH}" = "arm64" ]; then
  curl -L --fail "https://github.com/dprint/dprint/releases/download/${DPRINT_VERSION}/dprint-aarch64-unknown-linux-musl.zip" -o dprint.zip
else
  echo "Unsupported target architecture: ${TARGETARCH}"
  exit 1
fi
unzip dprint.zip
chmod +x dprint
EOT

# ====================================================== PRODUCT =======================================================

FROM kula/base:alpine
ARG STATICCHECK_VERSION
ARG GOVULNCHECK_VERSION

# Metadata
LABEL maintainer="kula app GmbH <opensource@kula.app>"
LABEL description="Minimal container for building Go applications with essential build tools"

# Install build dependencies and tools
RUN apk --no-cache update && \
    apk --no-cache add \
    # Build tools
    make \
    gcc \
    musl-dev \
    # Version control
    git \
    # HTTPS support
    ca-certificates \
    # Utilities
    unzip \
    # Cleanup is automatic with --no-cache
    && rm -rf /var/cache/apk/*

# Install Go
COPY --from=dl-go /tmp/go.tar.gz /tmp/
RUN tar -C /usr/local -xzf /tmp/go.tar.gz && \
    rm /tmp/go.tar.gz

# Install dprint
COPY --from=dl-dprint /tmp/dprint /usr/local/bin/dprint

# Set Go environment variables
ENV PATH="/usr/local/go/bin:${PATH}"
ENV GOPATH="/go"
ENV PATH="${GOPATH}/bin:${PATH}"

# Create GOPATH directory structure
RUN mkdir -p "${GOPATH}/src" "${GOPATH}/bin" && \
    chmod -R 777 "${GOPATH}"

# Install Go analysis tools
RUN go install "honnef.co/go/tools/cmd/staticcheck@v${STATICCHECK_VERSION}" && \
    go install "golang.org/x/vuln/cmd/govulncheck@v${GOVULNCHECK_VERSION}"

# Smoke tests
RUN set -x && \
    go version && \
    make --version && \
    gcc --version && \
    git --version && \
    dprint --version && \
    staticcheck --version && \
    govulncheck --version

# Set working directory
WORKDIR /workspace
