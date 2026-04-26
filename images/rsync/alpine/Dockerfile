# syntax=docker/dockerfile:1

# ====================================================== PRODUCT =======================================================

FROM kula/base:alpine

# Metadata
LABEL org.opencontainers.image.title="rsync"
LABEL org.opencontainers.image.description="Minimal container for running rsync"
LABEL org.opencontainers.image.base.name="kula/base:alpine"
LABEL maintainer="kula app GmbH <opensource@kula.app>"
LABEL description="Minimal container for running rsync"

# Install dependencies
RUN apk --no-cache update && \
    apk --no-cache add rsync

# Smoke tests
RUN set -x && \
    rsync --version
