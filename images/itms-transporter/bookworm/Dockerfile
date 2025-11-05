# syntax=docker/dockerfile:1

# ====================================================== VERSIONS ======================================================

ARG TRANSPORTER_URL="https://itunesconnect.apple.com/WebObjects/iTunesConnect.woa/ra/resources/download/public/Transporter__Linux/bin"

# ==================================================== DOWNLOAD BASE ===================================================

FROM alpine AS dl
ARG TARGETARCH

WORKDIR /tmp

RUN apk add --no-cache curl unzip

# ================================================== DOWNLOAD: ITMS TRANSPORTER ========================================

FROM dl AS dl-itms-transporter
ARG TRANSPORTER_URL

RUN curl -L --fail ${TRANSPORTER_URL} -o transporter_install.sh && \
    chmod +x transporter_install.sh && \
    sh transporter_install.sh --target transporter --accept --noexec

# ==================================================== PRODUCT =========================================================

FROM buildpack-deps:bookworm AS main

# Metadata
LABEL maintainer="kula app GmbH <opensource@kula.app>"
LABEL description="Container with ITMS Transporter for uploading media assets to the Apple App Store"

# Install common utilities
RUN apt-get update -y && apt-get install -y --no-install-recommends \
  # Install root certificates for HTTPS access
  ca-certificates \
  # Cleanup
  && apt-get clean && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives

# Install ITMS Transporter
COPY --from=dl-itms-transporter /tmp/transporter/itms /usr/local/
ENV PATH="/usr/local/itms/bin:${PATH}"

# Smoke tests
RUN set -x && \
  iTMSTransporter -version
