# syntax=docker/dockerfile:1

# ====================================================== VERSIONS ======================================================

# renovate: datasource=docker depName=debian versioning=loose
ARG DEBIAN_VERSION=bookworm-slim

# ====================================================== PRODUCT =======================================================

FROM debian:${DEBIAN_VERSION}
ARG DEBIAN_VERSION

# Metadata
LABEL org.opencontainers.image.authors="kula app GmbH <opensource@kula.app>"
LABEL org.opencontainers.image.vendor="kula app GmbH"
LABEL org.opencontainers.image.url="https://github.com/kula-app/containers"
LABEL org.opencontainers.image.source="https://github.com/kula-app/containers"
LABEL org.opencontainers.image.documentation="https://github.com/kula-app/containers"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.title="kula base (bookworm)"
LABEL org.opencontainers.image.description="Minimal kula-owned base image for bookworm"
LABEL org.opencontainers.image.base.name="debian:${DEBIAN_VERSION}"
LABEL maintainer="kula app GmbH <opensource@kula.app>"
LABEL description="Minimal kula-owned base image for bookworm"

ENV LANG=C.UTF-8

# Install dependencies
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    ca-certificates \
    tzdata \
    tini \
    # Cleanup
    && apt-get clean && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives

# Smoke tests
RUN set -x && \
    cat /etc/os-release && \
    tini --version
