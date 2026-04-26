# syntax=docker/dockerfile:1

FROM mingc/android-build-box:1.29.0

# Metadata
LABEL org.opencontainers.image.authors="kula app GmbH <opensource@kula.app>"
LABEL org.opencontainers.image.vendor="kula app GmbH"
LABEL org.opencontainers.image.url="https://github.com/kula-app/containers"
LABEL org.opencontainers.image.source="https://github.com/kula-app/containers"
LABEL org.opencontainers.image.documentation="https://github.com/kula-app/containers"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.title="android-build-box"
LABEL org.opencontainers.image.description="Container with Android SDK and build tools, Java 17, Ruby 3 via rbenv, based on mingc/android-build-box"
LABEL org.opencontainers.image.base.name="mingc/android-build-box:1.29.0"
LABEL maintainer="kula app GmbH <opensource@kula.app>"
LABEL description="Container with Android SDK and build tools, Java 17, Ruby 3 via rbenv, based on mingc/android-build-box"

# Pre-Requisites
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -

# Install required tools
RUN apt-get update -y && apt-get install -y \
  python3-pip \
  imagemagick \
  jq \
  # Install dependencies for rbenv
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
  \
  # clean up
  && rm -rf /var/lib/apt/lists/* && apt-get clean

# Configure Java Environment
RUN jenv global 17

# Install Python dependencies
RUN pip3 install cookiecutter

## Install rbenv
RUN git clone https://github.com/rbenv/rbenv.git /root/.rbenv
ENV PATH="/root/.rbenv/bin:$PATH"
RUN <<EOF
echo 'eval "$(rbenv init -)"' >> /root/.bashric
echo 'eval "$(rbenv init -)"' >> /root/.profile
EOF

## Install ruby-build
RUN <<EOF
git clone https://github.com/rbenv/ruby-build.git /root/ruby-build
PREFIX=/usr/local /root/ruby-build/install.sh
EOF

# Setup global rbenv shimming
ENV RBENV_ROOT=/usr/local/rbenv
ENV PATH="$RBENV_ROOT/bin:$RBENV_ROOT/shims:$PATH"

# Install each supported version as its own layer after the default one in reverse order
# Add additional versions on at the end to keep previous layers
RUN RUBY_CONFIGURE_OPTS=--disable-install-doc rbenv install 3.4.6

# Install default global version with default gems
RUN <<EOF
rbenv global 3.4.6
gem update --system
gem install bundler
EOF

# +-------------+
# | Smoke Tests |
# +-------------+

RUN set -x && \
  pip3 --version && \
  cookiecutter --version && \
  convert --version && \
  jq --version && \
  rbenv --version && \
  rbenv install --list-all && \
  ruby --version && \
  bundler --version
