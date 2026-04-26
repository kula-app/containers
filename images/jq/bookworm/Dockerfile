# syntax=docker/dockerfile:1

# ====================================================== PRODUCT =======================================================

FROM kula/base:bookworm

# Metadata
LABEL org.opencontainers.image.title="jq"
LABEL org.opencontainers.image.description="Container for running jq"
LABEL org.opencontainers.image.base.name="kula/base:bookworm"
LABEL maintainer="kula app GmbH <opensource@kula.app>"
LABEL description="Container for running jq"

# Install dependencies
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    jq \
    # Cleanup
    && apt-get clean && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives

# Smoke tests
RUN set -x && \
    jq --version
