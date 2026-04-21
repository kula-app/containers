# syntax=docker/dockerfile:1

# ====================================================== VERSIONS ======================================================

# renovate: datasource=docker depName=alpine versioning=loose
ARG ALPINE_VERSION=3.22
# renovate: datasource=github-releases depName=indygreg/apple-platform-rs extractVersion=^apple-codesign/(?<version>.*)$ versioning=loose
ARG RCODESIGN_VERSION=0.29.0

# ================================================ DOWNLOAD: RCODESIGN =================================================

FROM alpine:${ALPINE_VERSION} AS dl-rcodesign
ARG RCODESIGN_VERSION
ARG TARGETARCH

WORKDIR /tmp

RUN apk add --no-cache curl

RUN <<EOT ash
set -eu
if [ "${TARGETARCH}" = "amd64" ]; then
  TARGET="x86_64-unknown-linux-musl"
elif [ "${TARGETARCH}" = "arm64" ]; then
  TARGET="aarch64-unknown-linux-musl"
else
  echo "Unsupported target architecture: ${TARGETARCH}"
  exit 1
fi
ARCHIVE="apple-codesign-${RCODESIGN_VERSION}-${TARGET}.tar.gz"
URL="https://github.com/indygreg/apple-platform-rs/releases/download/apple-codesign%2F${RCODESIGN_VERSION}/${ARCHIVE}"
curl -L --fail "${URL}" -o rcodesign.tar.gz
curl -L --fail "${URL}.sha256" -o rcodesign.tar.gz.sha256
echo "$(cat rcodesign.tar.gz.sha256)  rcodesign.tar.gz" | sha256sum -c -
tar -xzf rcodesign.tar.gz
mv "apple-codesign-${RCODESIGN_VERSION}-${TARGET}/rcodesign" /tmp/rcodesign
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
