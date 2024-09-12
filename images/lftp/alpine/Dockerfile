# syntax=docker/dockerfile:v1

# Use an official Bitnami base image
FROM alpine:3.20

# Metadata
LABEL maintainer="kula app GmbH <opensource@kula.app>"
LABEL description="Container for running lftp based on Alpine"

# Install necessary packages
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends lftp && \
    rm -rf /var/lib/apt/lists/*
