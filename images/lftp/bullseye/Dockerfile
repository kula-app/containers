# syntax=docker/dockerfile:1

# Use an official Bitnami base image
FROM bitnami/minideb:bullseye

# Metadata
LABEL maintainer="kula app GmbH <opensource@kula.app>" 
LABEL description="Container for running lftp"

# Install dependencies
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    # Install root certificates for HTTPS access
    ca-certificates \
    lftp \
    # Cleanup
    && apt-get clean && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives
