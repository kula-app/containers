# syntax=docker/dockerfile:1

# ====================================================== PRODUCT =======================================================

FROM kula/base:alpine

# Metadata
LABEL org.opencontainers.image.title="tree"
LABEL org.opencontainers.image.description="Minimal container for running tree"
LABEL org.opencontainers.image.base.name="kula/base:alpine"
LABEL maintainer="kula app GmbH <opensource@kula.app>"
LABEL description="Minimal container for running tree"

# Install dependencies
RUN apk --no-cache update && \
    apk --no-cache add tree

# Smoke tests
RUN set -x && \
    tree --version
