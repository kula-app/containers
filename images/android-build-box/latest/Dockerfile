# syntax=docker/dockerfile:1

FROM mingc/android-build-box:1.29.0

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

# +---------+
# | Maestro |
# +---------+
# Maestro drives the server-generated screenshot flows on the emulator. Pinned
# so the image ships a known engine; the screenshot workflow relies on this
# pre-installed binary (with a runtime install as a fallback for older images).
ARG MAESTRO_VERSION=1.39.0
RUN curl -Ls "https://get.maestro.mobile.dev" | MAESTRO_VERSION="${MAESTRO_VERSION}" bash \
  && ln -sf /root/.maestro/bin/maestro /usr/local/bin/maestro
ENV PATH="/root/.maestro/bin:$PATH"

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
  bundler --version && \
  maestro --version
