# syntax=docker/dockerfile:1

# ====================================================== VERSIONS ======================================================

# renovate: datasource=docker depName=alpine versioning=loose
ARG ALPINE_VERSION=3.22

# ====================================================== PRODUCT =======================================================

FROM alpine:${ALPINE_VERSION}
ARG ALPINE_VERSION

# Metadata
LABEL org.opencontainers.image.authors="kula app GmbH <opensource@kula.app>"
LABEL org.opencontainers.image.vendor="kula app GmbH"
LABEL org.opencontainers.image.url="https://github.com/kula-app/containers"
LABEL org.opencontainers.image.source="https://github.com/kula-app/containers"
LABEL org.opencontainers.image.documentation="https://github.com/kula-app/containers"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.title="kula base (alpine)"
LABEL org.opencontainers.image.description="Minimal kula-owned base image for alpine"
LABEL org.opencontainers.image.base.name="alpine:${ALPINE_VERSION}"
LABEL maintainer="kula app GmbH <opensource@kula.app>"
LABEL description="Minimal kula-owned base image for alpine"

ENV LANG=C.UTF-8

# Install dependencies
RUN apk --no-cache update && \
    apk --no-cache add ca-certificates tzdata tini

# Smoke tests
RUN set -x && \
    cat /etc/os-release && \
    tini --version
