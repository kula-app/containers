FROM node:18.20.8

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
  zlib1g-dev \
  \
  # cleanup
  && rm -rf /var/lib/apt/lists/* && apt-get clean

# Install rbenv
RUN <<EOF
git clone https://github.com/rbenv/rbenv.git /usr/local/rbenv
echo '# rbenv setup' >/etc/profile.d/rbenv.sh
echo 'export RBENV_ROOT=/usr/local/rbenv' >>/etc/profile.d/rbenv.sh
echo 'export PATH="$RBENV_ROOT/bin:$PATH"' >>/etc/profile.d/rbenv.sh
echo 'eval "$(rbenv init -)"' >>/etc/profile.d/rbenv.sh
chmod +x /etc/profile.d/rbenv.sh
EOF

# Install ruby-build
RUN <<EOF
mkdir /usr/local/rbenv/plugins
git clone https://github.com/rbenv/ruby-build.git /usr/local/rbenv/plugins/ruby-build
PREFIX=/usr/local /usr/local/rbenv/plugins/ruby-build/install.sh
EOF

# Setup rbenv shimming
ENV RBENV_ROOT /usr/local/rbenv
ENV PATH $RBENV_ROOT/bin:$RBENV_ROOT/shims:$PATH

# Smoke test
RUN rbenv --version
