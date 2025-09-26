# syntax=docker/dockerfile:1

# ====================================================== VERSIONS ======================================================

# renovate: datasource=docker depName=bitnami/minideb versioning=loose
ARG DEBIAN_VERSION=bullseye

# ====================================================== PRODUCT =======================================================

FROM bitnami/minideb:${DEBIAN_VERSION}

# Metadata
LABEL maintainer="kula app GmbH <opensource@kula.app>" 
LABEL description="Container for running lftp"

# Install dependencies
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    # Install root certificates for HTTPS access
    ca-certificates \
    lftp \
    # Cleanup
    && apt-get clean && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives

# Smoke tests
RUN set -x && \
    lftp --version
