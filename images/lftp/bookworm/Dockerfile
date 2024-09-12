# syntax=docker/dockerfile:v1

# Use an official Bitnami base image
FROM bitnami/os-shell:12-debian-12-r30

# Metadata
LABEL maintainer="kula app GmbH <opensource@kula.app>"
LABEL description="Container for running lftp based on Bitnami's OS Shell"

# Install necessary packages
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends lftp && \
    rm -rf /var/lib/apt/lists/*
