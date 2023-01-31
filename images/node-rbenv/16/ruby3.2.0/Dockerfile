FROM kula/node-rbenv:16.16

# Install ruby versions
RUN rbenv install 3.2.0
RUN rbenv global 3.2.0

# smoke test
RUN ruby --version

# Install common Ruby gems
RUN gem install bundler

# smoke test
RUN bundler --version
