# syntax=docker/dockerfile:1

# ======================================================================================================================

#region -- Product --
FROM kula/pulumi-toolbox:bookworm
#endregion

#region -- Install rbenv --
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
#endregion

#region -- Install Ruby --
RUN rbenv install 3.4.1

RUN rbenv install 3.4.2
RUN rbenv global 3.4.2

RUN gem install bundler
#endregion

#region -- Smoke Tests --
RUN set -x && \
    rbenv --version && \
    ruby --version && \
    gem --version && \
    bundler --version
#endregion

# # ======================================================================================================================
