# syntax=docker/dockerfile:1

FROM node:24.9.0

# Metadata
LABEL org.opencontainers.image.authors="kula app GmbH <opensource@kula.app>"
LABEL org.opencontainers.image.vendor="kula app GmbH"
LABEL org.opencontainers.image.url="https://github.com/kula-app/containers"
LABEL org.opencontainers.image.source="https://github.com/kula-app/containers"
LABEL org.opencontainers.image.documentation="https://github.com/kula-app/containers"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.title="atlas-app-services-cli"
LABEL org.opencontainers.image.description="Container with atlas-app-services-cli"
LABEL org.opencontainers.image.base.name="node:24.9.0"
LABEL maintainer="kula app GmbH <opensource@kula.app>"
LABEL description="Container with atlas-app-services-cli"

# Install APT dependencies
RUN apt-get update -qq >/dev/null && apt-get upgrade -y --no-install-recommends
RUN apt-get install -y \
  jq \
  && \
  rm -rf /var/lib/apt/lists/*

# Install dependencies
RUN yarn global add atlas-app-services-cli

# Smoke tests
RUN set -x && \
  appservices --version
