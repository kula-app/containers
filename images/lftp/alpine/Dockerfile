# syntax=docker/dockerfile:1

# Use an official Bitnami base image
FROM alpine:3.21

# Metadata
LABEL maintainer="kula app GmbH <opensource@kula.app>"
LABEL description="Container for running lftp based on Alpine"

# Install necessary packages
RUN apk --no-cache update && \
    apk --no-cache add lftp
