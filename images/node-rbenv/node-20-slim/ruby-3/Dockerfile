# syntax=docker/dockerfile:1

# ====================================================== VERSIONS ======================================================

# renovate: datasource=github-releases depName=node/node versioning=loose
ARG NODE_VERSION=20.19.5-slim
# renovate: datasource=github-releases depName=ruby/ruby versioning=loose
ARG RUBY_VERSION=3.4.5

# ====================================================== PRODUCT =======================================================

FROM kula/node-rbenv:${NODE_VERSION}

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
