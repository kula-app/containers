# The kula.app containers library

[![Build Images](https://github.com/kula-app/containers/actions/workflows/build-images.yml/badge.svg)](https://github.com/kula-app/containers/actions/workflows/build-images.yml)

Various container image combinations used in projects of [kula](https://kula.app).

## Get an image

The recommended way to get any of the images is to pull the prebuilt image from the [Docker Hub Registry](https://hub.docker.com/r/kula/).

```console
$ docker pull kula/APP
```

To use a specific version, you can pull a versioned tag.

```console
$ docker pull kula/APP:[TAG]
```

If you wish, you can also build the image yourself by cloning the repository, changing to the directory containing the Dockerfile and executing the `docker build` command.

```console
$ git clone https://github.com/kula/containers.git
$ cd images/APP/VERSION/OPERATING-SYSTEM
$ docker build -t kula/APP .
```

> Remember to replace the `APP`, `VERSION` and `OPERATING-SYSTEM` placeholders in the example command above with the correct values.
