# syntax=docker/dockerfile:1

# ====================================================== VERSIONS ======================================================

# renovate: datasource=docker depName=alpine versioning=loose
ARG ALPINE_VERSION=3.22

# ====================================================== PRODUCT =======================================================

FROM alpine:${ALPINE_VERSION}

# Metadata
LABEL maintainer="kula app GmbH <opensource@kula.app>"
LABEL description="Minimal container for running tree"

# Install dependencies
RUN apk --no-cache update && \
    apk --no-cache add tree

# Smoke tests
RUN set -x && \
    tree --version
