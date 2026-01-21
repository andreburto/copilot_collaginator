#!/bin/bash

echo "Building Docker image..."
docker build -t copilot-collaginator .

if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

echo "Starting container..."
docker run -p 3000:3000 copilot-collaginator
