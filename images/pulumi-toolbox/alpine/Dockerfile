# syntax=docker/dockerfile:1

# ======================================================================================================================

#region -- Download Base --
FROM alpine AS dl
ARG TARGETARCH

# -- Versions --
# renovate: datasource=github-releases depName=golang/go versioning=loose
ARG GO_VERSION=1.25.0
# renovate: datasource=github-releases depName=kubernetes/kubernetes versioning=loose
ARG KUBECTL_VERSION=1.30.0
# renovate: datasource=github-releases depName=pulumi/pulumi versioning=loose
ARG PULUMI_VERSION=3.144.1

WORKDIR /tmp

RUN apk add --no-cache curl unzip
#endregion

# ======================================================================================================================

#region -- Download: kubectl --
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
#endregion

# ======================================================================================================================

#region -- Download: pulumi --
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
#endregion

# ======================================================================================================================

#region -- Download: go --
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
#endregion

# ======================================================================================================================

#region -- Product --
FROM alpine:3.22 AS main

# Metadata
LABEL maintainer="kula app GmbH <opensource@kula.app>"
LABEL description="Container with CLI utilities used with Pulumi based on Alpine"

# Install AWS CLI
RUN apk add --no-cache aws-cli

# Install curl
RUN apk add --no-cache curl

# Install git and supporting utilities
RUN apk add --no-cache git git-lfs gpg less openssh patch perl && \
  git lfs install

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
  rm -rf pulumi.tar.gz aws

# Install Go
COPY --from=dl-go /tmp/go.tar.gz .
RUN tar -xvzf go.tar.gz && \
  mv -vT go /usr/local/go && \
  rm -rf go.tar.gz
ENV PATH="/usr/local/go/bin:${PATH}"

# +-------------+
# | Smoke Tests |
# +-------------+

RUN set -x && \
  aws --version && \
  curl --version && \
  git lfs version && \
  gpg --version && \
  less --version && \
  patch --version && \
  perl --version && \
  kubectl version --client=true && \
  pulumi about && \
  go version
#endregion

# ======================================================================================================================
