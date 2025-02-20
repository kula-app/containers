FROM kula/node-rbenv:18.20.6

ENV RUBY_VERSION 3.3.4

# Install ruby versions
RUN rbenv install $RUBY_VERSION && rbenv global $RUBY_VERSION

# smoke test
RUN ruby --version

# Install common Ruby gems
RUN gem install bundler

# smoke test
RUN bundler --version
