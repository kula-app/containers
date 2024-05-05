FROM kula/node-rbenv:16.20.2-slim

ENV RUBY_VERSION 3.3.1

# Install ruby versions
RUN rbenv install $RUBY_VERSION && rbenv global $RUBY_VERSION

# Install common Ruby gems
RUN gem install bundler

# smoke test
RUN set -x && \
    ruby --version && \
    bundler --version
