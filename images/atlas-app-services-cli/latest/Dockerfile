# syntax=docker/dockerfile:1

FROM node:24.9.0

# Metadata
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
