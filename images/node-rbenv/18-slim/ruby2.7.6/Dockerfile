FROM kula/node-rbenv:18.13-slim

# Install ruby versions
RUN rbenv install 2.7.6
RUN rbenv global 2.7.6

# smoke test
RUN ruby --version

# Install common Ruby gems
RUN gem install bundler

# smoke test
RUN bundler --version
