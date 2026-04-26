# syntax=docker/dockerfile:1

# ====================================================== VERSIONS ======================================================

# renovate: datasource=docker depName=alpine versioning=loose
ARG ALPINE_VERSION=3.22
# renovate: datasource=github-releases depName=indygreg/apple-platform-rs extractVersion=^apple-codesign/(?<version>.*)$ versioning=loose
ARG RCODESIGN_VERSION=0.29.0
# SHA-256 of the upstream release tarballs. Update alongside RCODESIGN_VERSION; values are at
# https://github.com/indygreg/apple-platform-rs/releases (each `*.tar.gz` has a sibling `.sha256`).
ARG RCODESIGN_SHA256_AMD64=dbe85cedd8ee4217b64e9a0e4c2aef92ab8bcaaa41f20bde99781ff02e600002
ARG RCODESIGN_SHA256_ARM64=4af92c87ddf52f5f2d1258a3b4e56c7dcb8f1b2468df744976c5f139e031961f

# ================================================ DOWNLOAD: RCODESIGN =================================================

FROM alpine:${ALPINE_VERSION} AS dl-rcodesign
ARG RCODESIGN_VERSION
ARG RCODESIGN_SHA256_AMD64
ARG RCODESIGN_SHA256_ARM64
ARG TARGETARCH

WORKDIR /tmp

RUN apk add --no-cache curl

RUN <<EOT ash
if [ "${TARGETARCH}" = "amd64" ]; then
  curl -L --fail "https://github.com/indygreg/apple-platform-rs/releases/download/apple-codesign%2F${RCODESIGN_VERSION}/apple-codesign-${RCODESIGN_VERSION}-x86_64-unknown-linux-musl.tar.gz" -o rcodesign.tar.gz
  echo "${RCODESIGN_SHA256_AMD64}  rcodesign.tar.gz" | sha256sum -c -
elif [ "${TARGETARCH}" = "arm64" ]; then
  curl -L --fail "https://github.com/indygreg/apple-platform-rs/releases/download/apple-codesign%2F${RCODESIGN_VERSION}/apple-codesign-${RCODESIGN_VERSION}-aarch64-unknown-linux-musl.tar.gz" -o rcodesign.tar.gz
  echo "${RCODESIGN_SHA256_ARM64}  rcodesign.tar.gz" | sha256sum -c -
else
  echo "Unsupported target architecture: ${TARGETARCH}"
  exit 1
fi
tar -xzf rcodesign.tar.gz
mv apple-codesign-*/rcodesign /tmp/rcodesign
chmod +x /tmp/rcodesign
EOT

# ====================================================== PRODUCT =======================================================

FROM alpine:${ALPINE_VERSION}

# Metadata
LABEL maintainer="kula app GmbH <opensource@kula.app>"
LABEL description="Container for signing and notarizing Apple binaries using rcodesign (apple-codesign)"

# Install runtime dependencies (zip is required to package Mach-O binaries for notarization)
RUN apk --no-cache update && \
    apk --no-cache add ca-certificates zip

# Install rcodesign
COPY --from=dl-rcodesign /tmp/rcodesign /usr/local/bin/rcodesign

# Smoke tests
RUN set -x && \
    rcodesign --version && \
    zip --version

WORKDIR /workspace
