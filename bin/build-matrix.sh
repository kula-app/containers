#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if matrix.json exists
if [ ! -f "matrix.json" ]; then
    print_error "matrix.json not found in current directory"
    exit 1
fi

# Check if jq is available
if ! command -v jq &> /dev/null; then
    print_error "jq is required but not installed. Please install jq first."
    print_warning "On macOS: brew install jq"
    print_warning "On Ubuntu/Debian: sudo apt-get install jq"
    exit 1
fi

# Check if docker buildx is available
if ! docker buildx version &> /dev/null; then
    print_error "docker buildx is not available. Please ensure Docker Desktop is running with buildx support."
    exit 1
fi

print_status "Starting build process for all images in matrix.json"

# Get the total number of images to build
total_images=$(jq '.include | length' matrix.json)
print_status "Found $total_images images to build"

# Counter for progress
current=0

# Read matrix.json and process each entry
jq -c '.include[]' matrix.json | while read -r item; do
    current=$((current + 1))

    # Extract values from JSON
    image=$(echo "$item" | jq -r '.image')
    context=$(echo "$item" | jq -r '.context')
    tags_raw=$(echo "$item" | jq -r '.tags')

    print_status "[$current/$total_images] Building image: $image"
    print_status "Context: images/$context"

    # Convert newline-separated tags to array
    IFS=$'\n' read -rd '' -a tags_array <<< "$tags_raw" || true

    # Build the docker command
    docker_cmd="docker buildx build"
    docker_cmd="$docker_cmd --platform linux/amd64,linux/arm64"
    docker_cmd="$docker_cmd --pull"
    docker_cmd="$docker_cmd --push"

    # Add all tags
    for tag in "${tags_array[@]}"; do
        if [ -n "$tag" ]; then
            docker_cmd="$docker_cmd -t $tag"
            print_status "  Tag: $tag"
        fi
    done

    # Add context
    docker_cmd="$docker_cmd images/$context"

    print_status "Executing: $docker_cmd"
    echo ""

    # Execute the command
    if eval "$docker_cmd"; then
        print_success "Successfully built and pushed images for $context"
    else
        print_error "Failed to build images for $context"
        exit 1
    fi

    echo ""
    print_status "Completed [$current/$total_images]"
    echo "----------------------------------------"
done

print_success "All images have been built and pushed successfully!"
