# syntax=docker/dockerfile:1

# ====================================================== VERSIONS ======================================================

# renovate: datasource=docker depName=alpine versioning=loose
ARG ALPINE_VERSION=3.23

# ====================================================== PRODUCT =======================================================

FROM alpine:${ALPINE_VERSION}

# Metadata
LABEL maintainer="kula app GmbH <opensource@kula.app>"
LABEL description="Minimal container for running curl"

# Install dependencies
RUN apk --no-cache update && \
    apk --no-cache add curl

# Smoke tests
RUN set -x && \
    curl --version
