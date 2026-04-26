# syntax=docker/dockerfile:1

# ====================================================== PRODUCT =======================================================

FROM kula/base:alpine

# Metadata
LABEL org.opencontainers.image.title="jq"
LABEL org.opencontainers.image.description="Minimal container for running jq"
LABEL org.opencontainers.image.base.name="kula/base:alpine"
LABEL maintainer="kula app GmbH <opensource@kula.app>"
LABEL description="Minimal container for running jq"

# Install dependencies
RUN apk --no-cache update && \
    apk --no-cache add jq

# Smoke tests
RUN set -x && \
    jq --version
