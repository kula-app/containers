FROM kula/node-rbenv:18.19.1

ENV RUBY_VERSION 3.3.7

# Install ruby versions
RUN rbenv install $RUBY_VERSION && rbenv global $RUBY_VERSION

# smoke test
RUN ruby --version

# Install common Ruby gems
RUN gem install bundler

# smoke test
RUN bundler --version
