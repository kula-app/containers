# syntax=docker/dockerfile:1

# ====================================================== VERSIONS ======================================================

# renovate: datasource=github-releases depName=node/node versioning=loose
ARG NODE_VERSION=22.20.0

# ====================================================== PRODUCT =======================================================

FROM node:${NODE_VERSION}-slim
ARG NODE_VERSION

# Metadata
LABEL org.opencontainers.image.authors="kula app GmbH <opensource@kula.app>"
LABEL org.opencontainers.image.vendor="kula app GmbH"
LABEL org.opencontainers.image.url="https://github.com/kula-app/containers"
LABEL org.opencontainers.image.source="https://github.com/kula-app/containers"
LABEL org.opencontainers.image.documentation="https://github.com/kula-app/containers"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.title="node-rbenv"
LABEL org.opencontainers.image.description="Container with rbenv and node 22 slim"
LABEL org.opencontainers.image.base.name="node:${NODE_VERSION}-slim"
LABEL maintainer="kula app GmbH <opensource@kula.app>"
LABEL description="Container with rbenv and node 22 slim"

# Update dependencies
RUN apt-get update -qq >/dev/null && apt-get upgrade -y --no-install-recommends
RUN apt-get install -y \
  autoconf \
  bison \
  build-essential \
  curl \
  git \
  libdb-dev \
  libffi-dev \
  libgdbm-dev \
  libgdbm6 \
  libncurses5-dev \
  libreadline6-dev \
  libssl-dev \
  libyaml-dev \
  uuid-dev \
  zlib1g-dev && \
  rm -rf /var/lib/apt/lists/*

# Install rbenv
RUN git clone https://github.com/sstephenson/rbenv.git /usr/local/rbenv
RUN echo '# rbenv setup' >/etc/profile.d/rbenv.sh
RUN echo 'export RBENV_ROOT=/usr/local/rbenv' >>/etc/profile.d/rbenv.sh
RUN echo 'export PATH="$RBENV_ROOT/bin:$PATH"' >>/etc/profile.d/rbenv.sh
RUN echo 'eval "$(rbenv init -)"' >>/etc/profile.d/rbenv.sh
RUN chmod +x /etc/profile.d/rbenv.sh

# Install ruby-build
RUN mkdir /usr/local/rbenv/plugins
RUN git clone https://github.com/sstephenson/ruby-build.git /usr/local/rbenv/plugins/ruby-build

# Setup rbenv shimming
ENV RBENV_ROOT=/usr/local/rbenv
ENV PATH=$RBENV_ROOT/bin:$RBENV_ROOT/shims:$PATH

# Smoke tests
RUN set -x && \
    node --version && \
    rbenv --version
