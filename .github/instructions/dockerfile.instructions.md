---
applyTo: './Dockerfile'
description: This file contains instructions for creating and managing the Dockerfile for the Copilot Collaginator project.
---

# Dockerfile Instructions for Copilot Collaginator

The Dockerfile is used to containerize the Copilot Collaginator application, allowing it to run consistently across different environments. Below are the instructions for setting up and managing the Dockerfile.

## Dockerfile Content

```Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY src/ ./src/
COPY .env ./
COPY init.sql ./init.sql

EXPOSE 3000

RUN npm install

ENTRYPOINT ["sh", "-c", "source .env && npm run start"]
```