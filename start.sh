#!/bin/bash

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Docker is not running. Starting application with npm..."
    if [ -f .env ]; then
        set -a
        source .env
        set +a
    fi
    npm run start
    exit $?
fi

echo "Building Docker image..."
docker build -t copilot-collaginator .

if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

echo "Starting container..."
docker run -p 3000:3000 -v "$(pwd)/data:/app/data" copilot-collaginator
