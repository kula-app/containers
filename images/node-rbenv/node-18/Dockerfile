FROM node:18.20.0

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
ENV RBENV_ROOT /usr/local/rbenv
ENV PATH $RBENV_ROOT/bin:$RBENV_ROOT/shims:$PATH

# Smoke test
RUN rbenv --version
