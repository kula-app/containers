# syntax=docker/dockerfile:1

# Use an official base image
FROM alpine:3.21

# Metadata
LABEL maintainer="kula app GmbH <opensource@kula.app>"
LABEL description="Container for running lftp"

# Install dependencies
RUN apk --no-cache update && \
    apk --no-cache add lftp
