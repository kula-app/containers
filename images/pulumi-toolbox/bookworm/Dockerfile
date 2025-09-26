# syntax=docker/dockerfile:1

# ====================================================== VERSIONS ======================================================

# renovate: datasource=github-releases depName=golang/go versioning=loose
ARG GO_VERSION=1.25.0
# renovate: datasource=github-releases depName=kubernetes/kubernetes versioning=loose
ARG KUBECTL_VERSION=1.30.0
# renovate: datasource=github-releases depName=pulumi/pulumi versioning=loose
ARG PULUMI_VERSION=3.144.1

# ==================================================== DOWNLOAD BASE ===================================================

FROM alpine AS dl
ARG TARGETARCH

WORKDIR /tmp

RUN apk add --no-cache curl unzip

# ================================================== DOWNLOAD: AWS CLI =================================================

FROM dl AS dl-awscli
RUN <<EOT ash
if [ "${TARGETARCH}" = "amd64" ]; then
  curl -L --fail https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip -o awscli.zip
elif [ "${TARGETARCH}" = "arm64" ]; then
  curl -L --fail https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip -o awscli.zip
else
  echo "Unsupported target architecture: ${TARGETARCH}"
  exit 1
fi
EOT

# =================================================== DOWNLOAD: KUBECTL ================================================

FROM dl AS dl-kubectl
RUN <<EOT ash
if [ "${TARGETARCH}" = "amd64" ]; then
  curl -LO --fail "https://dl.k8s.io/release/v${KUBECTL_VERSION}/bin/linux/amd64/kubectl"
elif [ "${TARGETARCH}" = "arm64" ]; then
  curl -LO --fail "https://dl.k8s.io/release/v${KUBECTL_VERSION}/bin/linux/arm64/kubectl"
else
  echo "Unsupported target architecture: ${TARGETARCH}"
  exit 1
fi
EOT

#= ================================================= DOWNLOAD: PULUMI ==================================================

FROM dl AS dl-pulumi
RUN <<EOT ash
if [ "${TARGETARCH}" = "amd64" ]; then
  curl -L --fail "https://get.pulumi.com/releases/sdk/pulumi-v${PULUMI_VERSION}-linux-x64.tar.gz" -o pulumi.tar.gz
elif [ "${TARGETARCH}" = "arm64" ]; then
  curl -L --fail "https://get.pulumi.com/releases/sdk/pulumi-v${PULUMI_VERSION}-linux-arm64.tar.gz" -o pulumi.tar.gz
else
  echo "Unsupported target architecture: ${TARGETARCH}"
  exit 1
fi
EOT

# ==================================================== DOWNLOAD: GO ====================================================

FROM dl AS dl-go
RUN <<EOT ash
if [ "${TARGETARCH}" = "amd64" ]; then
  curl -L --fail "https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz" -o go.tar.gz
elif [ "${TARGETARCH}" = "arm64" ]; then
  curl -L --fail "https://go.dev/dl/go${GO_VERSION}.linux-arm64.tar.gz" -o go.tar.gz
else
  echo "Unsupported target architecture: ${TARGETARCH}"
  exit 1
fi
EOT

# ==================================================== PRODUCT =========================================================

FROM bitnami/minideb:bookworm AS main

# Metadata
LABEL maintainer="kula app GmbH <opensource@kula.app>"
LABEL description="Container with CLI utilities used with Pulumi based on Alpine"

# Install common utilities
RUN apt-get update -y && apt-get install -y --no-install-recommends \
  # Install root certificates for HTTPS access
  ca-certificates \
  unzip \
  # Cleanup
  && apt-get clean && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives

# Install AWS CLI
COPY --from=dl-awscli /tmp/awscli.zip .
RUN unzip -q awscli.zip && \
  ./aws/install && \
  rm -rf awscli.zip aws

# Install curl
RUN apt-get update -y && apt-get install -y --no-install-recommends \
  curl \
  # Cleanup
  && apt-get clean && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives

# Install git and supporting utilities
RUN apt-get update -y && apt-get install -y --no-install-recommends \
  git \
  git-lfs \
  gpg \
  less \
  patch \
  perl \
  # Cleanup
  && apt-get clean && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives

# Install kubectl
COPY --from=dl-kubectl /tmp/kubectl .
RUN install \
  -o root \
  -g root \
  -m 0755 \
  kubectl /usr/local/bin/kubectl && \
  rm -f kubectl

# Install Pulumi
COPY --from=dl-pulumi /tmp/pulumi.tar.gz .
RUN tar -xvzf pulumi.tar.gz && \
  for file in $(find pulumi -type f); do \
  install -o root -g root -m 0755 "${file}" "/usr/local/bin/${file#pulumi/}"; \
  done && \
  rm -rf pulumi.tar.gz pulumi

# Install Go
COPY --from=dl-go /tmp/go.tar.gz .
RUN tar -xvzf go.tar.gz && \
  mv -vT go /usr/local/go && \
  rm -rf go.tar.gz
ENV PATH="/usr/local/go/bin:${PATH}"

# Smoke tests
RUN set -x && \
  aws --version && \
  curl --version && \
  git --version && \
  git lfs version && \
  gpg --version && \
  less --version && \
  patch --version && \
  perl --version && \
  kubectl version --client=true && \
  pulumi about && \
  go version
