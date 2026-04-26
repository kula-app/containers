# syntax=docker/dockerfile:1

# ====================================================== PRODUCT =======================================================

FROM kula/base:bookworm

# Metadata
LABEL org.opencontainers.image.title="lftp"
LABEL org.opencontainers.image.description="Container for running lftp"
LABEL org.opencontainers.image.base.name="kula/base:bookworm"
LABEL maintainer="kula app GmbH <opensource@kula.app>"
LABEL description="Container for running lftp"

# Install dependencies
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    lftp \
    # Cleanup
    && apt-get clean && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives

# Smoke tests
RUN set -x && \
    lftp --version
