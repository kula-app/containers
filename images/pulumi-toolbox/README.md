# Pulumi Toolbox

The Pulumi Toolbox is a collection of utilities and tools that are required by Pulumi to operate.

The following CLI tools are included in the Pulumi Toolbox:

- `kubectl` - Kubernetes CLI
- `aws` - AWS CLI

## Usage

To use the Pulumi Toolbox container image, you can run it with Docker. Here are some examples of how to use it:

### Running the Container

```sh
docker run --rm -it pulumi-toolbox:latest
```

This command will start the container and open an interactive shell.

### Using `kubectl`

To use `kubectl` inside the container, you can run:

```sh
docker run --rm -it pulumi-toolbox:latest kubectl version
```

This will display the version of `kubectl` included in the container.

### Using `aws`

To use the AWS CLI inside the container, you can run:

```sh
docker run --rm -it pulumi-toolbox:latest aws --version
```

This will display the version of the AWS CLI included in the container.

For more information on using Docker, refer to the [Docker documentation](https://docs.docker.com/).
