# syntax=docker/dockerfile:1

# ====================================================== PRODUCT =======================================================

FROM kula/base:alpine

# Metadata
LABEL org.opencontainers.image.title="curl"
LABEL org.opencontainers.image.description="Minimal container for running curl"
LABEL org.opencontainers.image.base.name="kula/base:alpine"
LABEL maintainer="kula app GmbH <opensource@kula.app>"
LABEL description="Minimal container for running curl"

# Install dependencies
RUN apk --no-cache update && \
    apk --no-cache add curl

# Smoke tests
RUN set -x && \
    curl --version
