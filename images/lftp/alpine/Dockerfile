# syntax=docker/dockerfile:1

# ====================================================== PRODUCT =======================================================

FROM kula/base:alpine

# Metadata
LABEL org.opencontainers.image.title="lftp"
LABEL org.opencontainers.image.description="Container for running lftp"
LABEL org.opencontainers.image.base.name="kula/base:alpine"
LABEL maintainer="kula app GmbH <opensource@kula.app>"
LABEL description="Container for running lftp"

# Install dependencies
RUN apk --no-cache update && \
    apk --no-cache add lftp

# Smoke tests
RUN set -x && \
    lftp --version
