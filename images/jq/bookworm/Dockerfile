# syntax=docker/dockerfile:1

# Use an official Bitnami base image
FROM bitnami/minideb:bookworm

# Metadata
LABEL maintainer="kula app GmbH <opensource@kula.app>"
LABEL description="Container for running jq"

# Install dependencies
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    jq \
    # Cleanup
    && apt-get clean && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives

# Smoke test
RUN set -x && \
    jq --version
