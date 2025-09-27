# syntax=docker/dockerfile:1

# ====================================================== VERSIONS ======================================================

# renovate: datasource=github-releases depName=node/node versioning=loose
ARG NODE_VERSION=24.9.0
# renovate: datasource=github-releases depName=ruby/ruby versioning=loose
ARG RUBY_VERSION=3.4.5

# ====================================================== PRODUCT =======================================================

FROM kula/node-rbenv:${NODE_VERSION}-slim
ARG RUBY_VERSION

# Metadata
LABEL maintainer="kula app GmbH <opensource@kula.app>"
LABEL description="Container with rbenv and node 24 slim with ruby 3"

# Install ruby versions
RUN rbenv install ${RUBY_VERSION} && rbenv global ${RUBY_VERSION}

# Install common Ruby gems
RUN gem install bundler

# Smoke tests
RUN set -x && \
    node --version && \
    rbenv --version && \
    ruby --version && \
    gem --version && \
    bundler --version
