# syntax=docker/dockerfile:1

FROM bitnami/minideb:bookworm

LABEL maintainer="kula app GmbH <opensource@kula.app>" \
    description="Container for running lftp based on Bitnami's OS Shell"

RUN apt-get update -y && \
    apt-get install -y --no-install-recommends \
    lftp \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives
