# Go Toolbox

The Go Toolbox is a collection of essential tools and utilities for building Go applications in CI/CD workflows.

The following CLI tools are included in the Go Toolbox:

- `go` - Go compiler and toolchain
- `make` - Build automation tool
- `gcc` / `g++` - C/C++ compilers for CGO support
- `git` - Git version control system
- `bash` - Bash shell (bookworm variant only)
- `curl` - Command-line HTTP client
- `pkg-config` - Package configuration tool (bookworm variant only)

## Variants

### Bookworm (Recommended)

Based on Debian Bookworm with bash and full build tools.

```sh
docker pull kula/golang-toolbox:latest
docker pull kula/golang-toolbox:bookworm
```

### Alpine

Minimal Alpine-based image for smaller footprint.

```sh
docker pull kula/golang-toolbox:alpine
```

## Usage

To use the Go Toolbox container image, you can run it with Docker. Here are some examples of how to use it:

### Running the Container

```sh
docker run --rm -it kula/golang-toolbox:latest
```

This command will start the container and open an interactive shell.

### Building a Go Project

To build a Go project inside the container, you can run:

```sh
docker run --rm -v $(pwd):/workspace kula/golang-toolbox:latest go build ./...
```

This will build all packages in the current directory.

### Running Tests

To run Go tests inside the container, you can run:

```sh
docker run --rm -v $(pwd):/workspace kula/golang-toolbox:latest go test ./...
```

This will run all tests in your project.

### Using Make

To use `make` inside the container, you can run:

```sh
docker run --rm -v $(pwd):/workspace kula/golang-toolbox:latest make build
```

This will execute the build target from your Makefile.

### GitHub Actions Example

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    container: kula/golang-toolbox:latest
    steps:
      - uses: actions/checkout@v6
      - name: Build
        run: make build
      - name: Test
        run: go test -v ./...
```

For more information on using Docker, refer to the [Docker documentation](https://docs.docker.com/).
