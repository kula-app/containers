# syntax=docker/dockerfile:1

# ====================================================== VERSIONS ======================================================

# renovate: datasource=github-releases depName=ruby/ruby versioning=loose
ARG RUBY_VERSION=3.4.5

# ====================================================== PRODUCT =======================================================

FROM kula/pulumi-toolbox:bookworm
ARG RUBY_VERSION

# Metadata
LABEL maintainer="kula app GmbH <opensource@kula.app>"
LABEL description="Container with CLI utilities used with Pulumi based on Bookworm with rbenv"

# Install dependencies of rbenv
# Reference: https://github.com/rbenv/ruby-build/wiki#ubuntudebianmint
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    autoconf \
    patch \
    build-essential \
    rustc \
    libssl-dev \
    libyaml-dev \
    libreadline6-dev \
    zlib1g-dev \
    libgmp-dev \
    libncurses5-dev \
    libffi-dev \
    libgdbm6 \
    libgdbm-dev \
    libdb-dev \
    uuid-dev \
    # Cleanup
    && apt-get clean && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives

# Install rbenv
RUN git clone https://github.com/sstephenson/rbenv.git /usr/local/rbenv
RUN echo '# rbenv setup' >/etc/profile.d/rbenv.sh
RUN echo 'export RBENV_ROOT=/usr/local/rbenv' >>/etc/profile.d/rbenv.sh
RUN echo 'export PATH="$RBENV_ROOT/bin:$PATH"' >>/etc/profile.d/rbenv.sh
RUN echo 'eval "$(rbenv init -)"' >>/etc/profile.d/rbenv.sh
RUN chmod +x /etc/profile.d/rbenv.sh

# Install ruby-build
RUN mkdir /usr/local/rbenv/plugins && \
    git clone https://github.com/sstephenson/ruby-build.git /usr/local/rbenv/plugins/ruby-build

# Setup rbenv shimming
ENV RBENV_ROOT=/usr/local/rbenv
ENV PATH=$RBENV_ROOT/bin:$RBENV_ROOT/shims:$PATH

# Install ruby
RUN rbenv install ${RUBY_VERSION} && rbenv global ${RUBY_VERSION}

RUN gem install bundler

# Smoke tests
RUN set -x && \
    rbenv --version && \
    ruby --version && \
    gem --version && \
    bundler --version
