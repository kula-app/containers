FROM kula/node-rbenv:16.20.0

ENV RUBY_VERSION 3.2.0

# Install ruby versions
RUN rbenv install $RUBY_VERSION
RUN rbenv global $RUBY_VERSION

# smoke test
RUN ruby --version

# Install common Ruby gems
RUN gem install bundler

# smoke test
RUN bundler --version
