# syntax=docker/dockerfile:1

# Adapted from mingchen/docker-android-build-box 1.29.0 (MIT, see LICENSE).
# Upstream commit: a631b11aca037dfa0bc8a1a8a24e6c79188fd416
# Release-pinned Android tooling, without Flutter, Node/Yarn, or Fastlane.
ARG ANDROID_SDK_TOOLS_VERSION="13114758"
ARG NDK_VERSION="28.0.13004108"
ARG BUNDLETOOL_VERSION="1.18.1"
ARG JENV_RELEASE="0.5.6"

#----------~~~~~~~~~~**********~~~~~~~~~~~-----------#
#                PRELIMINARY STAGES
#----------~~~~~~~~~~**********~~~~~~~~~~~-----------#
# All following stages should have their root as either these two stages,
# ubuntu and base.

#----------~~~~~~~~~~*****
# build stage: ubuntu
#----------~~~~~~~~~~*****
FROM ubuntu:22.04 AS ubuntu
# Ensure ARGs are in this build context
ARG ANDROID_SDK_TOOLS_VERSION
ARG NDK_VERSION
ARG BUNDLETOOL_VERSION
ARG JENV_RELEASE

ARG DIRWORK="/tmp"
ARG FINAL_DIRWORK="/project"

ARG INSTALLED_TEMP="${DIRWORK}/.temp_version"
ARG INSTALLED_VERSIONS="/root/installed-versions.txt"

ARG SDK_PACKAGES_LIST="${DIRWORK}/packages.txt"

ENV ANDROID_HOME="/opt/android-sdk" \
    ANDROID_SDK_HOME="/opt/android-sdk" \
    ANDROID_NDK="/opt/android-sdk/ndk/latest" \
    ANDROID_NDK_ROOT="/opt/android-sdk/ndk/latest" \
    JENV_ROOT="/opt/jenv"
ENV ANDROID_SDK_MANAGER=${ANDROID_HOME}/cmdline-tools/latest/bin/sdkmanager

ENV TZ=America/Los_Angeles

# Set locale
ENV LANG="en_US.UTF-8" \
    LANGUAGE="en_US.UTF-8" \
    LC_ALL="en_US.UTF-8"

# Variables must be references after they are created
ENV ANDROID_SDK_HOME="$ANDROID_HOME"
ENV ANDROID_NDK_HOME="$ANDROID_NDK"

ENV PATH="${JENV_ROOT}/shims:${JENV_ROOT}/bin:$PATH:$ANDROID_SDK_HOME/emulator:$ANDROID_SDK_HOME/cmdline-tools/latest/bin:$ANDROID_SDK_HOME/tools:$ANDROID_SDK_HOME/platform-tools:$ANDROID_NDK"

#----------~~~~~~~~~~*****
# build stage: base
#----------~~~~~~~~~~*****
FROM ubuntu AS pre-base
ARG TERM=dumb \
    DEBIAN_FRONTEND=noninteractive

WORKDIR ${DIRWORK}

RUN uname -a && uname -m

# support amd64 and arm64
RUN JDK_PLATFORM=$(if [ "$(uname -m)" = "aarch64" ]; then echo "arm64"; else echo "amd64"; fi) && \
    echo export JDK_PLATFORM=$JDK_PLATFORM >> /etc/jdk.env && \
    echo export JAVA_HOME="/usr/lib/jvm/java-17-openjdk-$JDK_PLATFORM/" >> /etc/jdk.env && \
    echo . /etc/jdk.env >> /etc/bash.bashrc && \
    echo . /etc/jdk.env >> /etc/profile

RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections && \
    apt-get clean && \
    apt-get update -qq && \
    apt-get install -qq -y apt-utils locales && \
    locale-gen $LANG

# Installing packages
RUN apt-get update -qq > /dev/null && \
    apt-get install -qq --no-install-recommends \
        autoconf \
        build-essential \
        cmake \
        ninja-build \
        curl \
        file \
        git \
        git-lfs \
        gpg-agent \
        less \
        libc6-dev \
        libgmp-dev \
        libmpc-dev \
        libmpfr-dev \
        libxslt-dev \
        libxml2-dev \
        m4 \
        ncurses-dev \
        ocaml \
        openjdk-8-jdk \
        openjdk-11-jdk \
        openjdk-17-jdk \
        openjdk-21-jdk \
        openssh-client \
        pkg-config \
        ruby-full \
        software-properties-common \
        tzdata \
        unzip \
        vim-tiny \
        wget \
        zip \
        zipalign \
        s3cmd \
        python3-pip \
        zlib1g-dev > /dev/null && \
    git lfs install > /dev/null && \
    echo "JVM directories: `ls -l /usr/lib/jvm/`" && \
    . /etc/jdk.env && \
    echo "Java version (default):" && \
    java -version && \
    echo "set timezone" && \
    ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone && \
    apt-get -y clean && apt-get -y autoremove && rm -rf /var/lib/apt/lists/* && \
    rm -rf ${DIRWORK}/* /var/tmp/* && \
    echo 'debconf debconf/frontend select Dialog' | debconf-set-selections

# preliminary base-base stage
# Install Android SDK CLI
FROM pre-base AS base-base
RUN echo '# Installed Versions of Specified Software' >> ${INSTALLED_VERSIONS}

FROM base-base AS base-tagged
RUN echo "sdk tools ${ANDROID_SDK_TOOLS_VERSION}" && \
    wget --quiet --output-document=sdk-tools.zip \
        "https://dl.google.com/android/repository/commandlinetools-linux-${ANDROID_SDK_TOOLS_VERSION}_latest.zip" && \
    echo "ANDROID_SDK_TOOLS_VERSION=${ANDROID_SDK_TOOLS_VERSION}" >> ${INSTALLED_VERSIONS}

FROM base-tagged AS base
RUN mkdir --parents "$ANDROID_HOME" && \
    unzip -q sdk-tools.zip -d "$ANDROID_HOME" && \
    cd "$ANDROID_HOME" && \
    mv cmdline-tools latest && \
    mkdir cmdline-tools && \
    mv latest cmdline-tools && \
    rm --force ${DIRWORK}/sdk-tools.zip

# Copy sdk license agreement files.
RUN mkdir -p $ANDROID_HOME/licenses
COPY sdk/licenses/* $ANDROID_HOME/licenses/

#----------~~~~~~~~~~**********~~~~~~~~~~~-----------#
#                INTERMEDIARY STAGES
#----------~~~~~~~~~~**********~~~~~~~~~~~-----------#
# build stages used to craft the targets for deployment to production

#----------~~~~~~~~~~*****
# build stage: jenv-final
#----------~~~~~~~~~~*****
# jenv
# Add jenv to control which version of java to use, default to 17.
FROM base AS jenv-base
RUN echo '#!/usr/bin/env bash' >> ~/.bash_profile && \
    echo 'eval "$(jenv init -)"' >> ~/.bash_profile

FROM jenv-base AS jenv-tagged
RUN git clone --depth 1 --branch ${JENV_RELEASE} https://github.com/jenv/jenv.git ${JENV_ROOT} && \
    echo "JENV_RELEASE=${JENV_RELEASE}" >> ${INSTALLED_TEMP}

FROM jenv-tagged AS jenv-final
RUN . ~/.bash_profile && \
    . /etc/jdk.env && \
    java -version && \
    jenv add /usr/lib/jvm/java-8-openjdk-$JDK_PLATFORM && \
    jenv add /usr/lib/jvm/java-11-openjdk-$JDK_PLATFORM && \
    jenv add /usr/lib/jvm/java-17-openjdk-$JDK_PLATFORM && \
    jenv add /usr/lib/jvm/java-21-openjdk-$JDK_PLATFORM && \
    jenv versions && \
    jenv global 21 && \
    java -version

#----------~~~~~~~~~~*****
# build stage: stage2
#----------~~~~~~~~~~*****
# Create some jenkins required directory to allow this image run with Jenkins
FROM ubuntu AS stage2
WORKDIR ${DIRWORK}
RUN mkdir -p /var/lib/jenkins/workspace && \
    mkdir -p /home/jenkins && \
    chmod 777 /home/jenkins && \
    chmod 777 /var/lib/jenkins/workspace

#----------~~~~~~~~~~*****
# build stage: pre-minimal
#----------~~~~~~~~~~*****
FROM base AS pre-minimal
ARG DEBUG
# The `yes` is for accepting all non-standard tool licenses.
RUN mkdir --parents "$ANDROID_HOME/.android/" && \
    echo '### User Sources for Android SDK Manager' > \
        "$ANDROID_HOME/.android/repositories.cfg" && \
    . /etc/jdk.env && \
    yes | $ANDROID_SDK_MANAGER --licenses > /dev/null

# List all available packages.
# redirect to a temp file ${SDK_PACKAGES_LIST} for later use and avoid show progress
RUN . /etc/jdk.env && \
    $ANDROID_SDK_MANAGER --list > ${SDK_PACKAGES_LIST} && \
    cat ${SDK_PACKAGES_LIST} | grep -v '='

RUN echo "platform tools" && \
    . /etc/jdk.env && \
    yes | $ANDROID_SDK_MANAGER ${DEBUG:+--verbose} \
        "platform-tools" > /dev/null

#----------~~~~~~~~~~*****
# build stage: stage1-final
#----------~~~~~~~~~~*****
# installs the intended android SDKs
#
# https://developer.android.com/studio/command-line/sdkmanager.html
FROM pre-minimal AS stage1-independent-base
WORKDIR ${DIRWORK}
ARG PACKAGES_FILENAME="android-sdks.txt"

FROM stage1-independent-base AS stage1-base
RUN echo "emulator" && \
    . /etc/jdk.env && \
    yes | $ANDROID_SDK_MANAGER "emulator" > /dev/null

FROM stage1-base AS stage1-tagged
COPY tagged_sdk_packages_list.txt $PACKAGES_FILENAME

FROM stage1-tagged AS stage1-final
RUN echo "installing: $(cat $PACKAGES_FILENAME)" && \
    . /etc/jdk.env && \
    yes | ${ANDROID_SDK_MANAGER} ${DEBUG:+--verbose} --package_file=$PACKAGES_FILENAME > /dev/null

#----------~~~~~~~~~~*****
# build stage: bundletool-final
#----------~~~~~~~~~~*****
# bundletool
FROM pre-minimal AS bundletool-base
WORKDIR ${DIRWORK}
RUN echo "bundletool"

FROM bundletool-base AS bundletool-tagged
RUN wget -q https://github.com/google/bundletool/releases/download/${BUNDLETOOL_VERSION}/bundletool-all-${BUNDLETOOL_VERSION}.jar -O $ANDROID_SDK_HOME/cmdline-tools/latest/bundletool.jar && \
    echo "BUNDLETOOL_VERSION=${BUNDLETOOL_VERSION}" >> ${INSTALLED_TEMP}

FROM bundletool-tagged AS bundletool-final
RUN echo "bundletool finished"

#----------~~~~~~~~~~*****
# build stage: ndk-final
#----------~~~~~~~~~~*****
# NDK (side-by-side)
FROM pre-minimal AS ndk-base
WORKDIR ${DIRWORK}
RUN echo "NDK"

FROM ndk-base AS ndk-tagged
RUN echo "Installing ${NDK_VERSION}" && \
    . /etc/jdk.env && \
    yes | $ANDROID_SDK_MANAGER ${DEBUG:+--verbose} "ndk;${NDK_VERSION}" > /dev/null && \
    ln -sv $ANDROID_HOME/ndk/${NDK_VERSION} ${ANDROID_NDK}

FROM ndk-tagged AS ndk-final
RUN echo "NDK finished"

# Assemble only the Android tooling from upstream.
FROM pre-minimal AS complete
COPY --from=stage1-final --chmod=775 ${ANDROID_HOME} ${ANDROID_HOME}
COPY --from=stage2 /var/lib/jenkins/workspace /var/lib/jenkins/workspace
COPY --from=stage2 /home/jenkins /home/jenkins
COPY --from=bundletool-final ${ANDROID_SDK_HOME}/cmdline-tools/latest/bundletool.jar ${ANDROID_SDK_HOME}/cmdline-tools/latest/bundletool.jar
COPY --from=ndk-final --chmod=775 ${ANDROID_NDK_ROOT}/../ ${ANDROID_NDK_ROOT}/../
COPY --from=jenv-final ${JENV_ROOT} ${JENV_ROOT}
COPY --from=jenv-final /root/.bash_profile /root/.bash_profile
COPY --from=bundletool-final ${INSTALLED_TEMP} ${DIRWORK}/.bundletool_version
COPY --from=jenv-final ${INSTALLED_TEMP} ${DIRWORK}/.jenv_version
COPY LICENSE /usr/share/licenses/android-build-box/LICENSE

RUN git config --global --add safe.directory ${JENV_ROOT} && \
    cat ${DIRWORK}/.*_version >> ${INSTALLED_VERSIONS} && \
    rm -rf ${DIRWORK}/* && \
    . /etc/jdk.env && \
    ${ANDROID_SDK_MANAGER} --list_installed >> ${INSTALLED_VERSIONS}

WORKDIR ${FINAL_DIRWORK}

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
echo 'eval "$(rbenv init -)"' >> /root/.bashrc
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

# Install the application Ruby toolchain.
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

# Check the retained upstream capabilities and the intentionally removed tools.
RUN set -eu; \
    . /etc/jdk.env; \
    for version in 1.8 11 17 21; do \
      JENV_VERSION="$version" java -version; \
    done; \
    test "$(jenv global)" = "17"; \
    sdkmanager --list_installed; \
    adb version; \
    emulator -version; \
    test -x "$ANDROID_NDK_ROOT/ndk-build"; \
    java -jar "$ANDROID_HOME/cmdline-tools/latest/bundletool.jar" version; \
    git lfs version; \
    cmake --version; \
    ninja --version; \
    for tool in flutter dart node npm yarn fastlane; do \
      if command -v "$tool"; then \
        echo "Unexpected tool: $tool" >&2; exit 1; \
      fi; \
    done
