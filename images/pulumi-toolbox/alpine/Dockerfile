# syntax=docker/dockerfile:1

# ======================================================================================================================

#region -- Download Base --
FROM alpine AS dl
ARG TARGETARCH
WORKDIR /tmp

RUN apk add --no-cache curl unzip
#endregion

# ======================================================================================================================

#region -- Download: aws-cli --
FROM dl AS dl-awscli
# noop - installed with apk instead
#endregion

# ======================================================================================================================

#region -- Download: kubectl --
FROM dl AS dl-kubectl
RUN <<EOT ash
if [ "${TARGETARCH}" = "amd64" ]; then
  curl -LO --fail "https://dl.k8s.io/release/v1.30.0/bin/linux/amd64/kubectl"
elif [ "${TARGETARCH}" = "arm64" ]; then
  curl -LO --fail "https://dl.k8s.io/release/v1.30.0/bin/linux/arm64/kubectl"
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
  curl -L --fail "https://get.pulumi.com/releases/sdk/pulumi-v3.144.1-linux-x64.tar.gz" -o pulumi.tar.gz
elif [ "${TARGETARCH}" = "arm64" ]; then
  curl -L --fail "https://get.pulumi.com/releases/sdk/pulumi-v3.144.1-linux-arm64.tar.gz" -o pulumi.tar.gz
else
  echo "Unsupported target architecture: ${TARGETARCH}"
  exit 1
fi
EOT
#endregion

# ======================================================================================================================

#region -- Product --
FROM alpine:3.20 AS main

# Metadata
LABEL maintainer="kula app GmbH <opensource@kula.app>"
LABEL description="Container with CLI utilities used with Pulumi based on Alpine"

# Install AWS CLI
RUN apk add --no-cache aws-cli

# Install git
RUN apk add --no-cache git

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

# +-------------+
# | Smoke Tests |
# +-------------+

RUN set -x && \
  aws --version && \
  git --version && \
  kubectl version --client=true && \
  pulumi about
#endregion

# ======================================================================================================================
