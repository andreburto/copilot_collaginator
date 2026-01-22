# Copilot Instructions

## About

This document contains coding instructions and guidelines for the Copilot Collaginator project. The project consists of a backend server built with Node.js and a frontend application built with HTML5 and jQuery. The purpose of the project is to fetch images from an external API and display them in a collage format on the frontend using HTML5 canvas.

## Project Structure

- `src/backend/`: Contains the backend server code. See: .github/instructions/backend.instructions.md for detailed instructions.
- `src/frontend/`: Contains the frontend application code. See: .github/instructions/frontend.instructions.md for detailed instructions.
- `src/tools/`: Contains utility scripts for development and deployment.
  - `dump_db.js`: Script to dump the contents of the SQLite database for debugging purposes.
- `.env`: Environment variables for configuration.
- `.gitignore`: See .github/instructions/gitignore.instructions.md for detailed instructions.
- `init.sql`: SQL script to initialize the SQLite database schema.
  See: .github/instructions/sqlite.instructions.md for detailed instructions.
- `package.json`: Contains project dependencies and scripts.
- `README.md`: This file is for project overview and setup instructions. See: .github/instructions/readme.instructions.md for detailed instructions.
- `Dockerfile`: Configuration for containerizing the application. See: .github/instructions/dockerfile.instructions.md for detailed instructions.
- Start up scripts that run `docker build` and `docker run` commands:
  - `start.bat`: Windows batch script to start the server.
  - `start.sh`: Shell script to start the server on Unix-based systems.
  - Each script builds the Docker image and runs the container, mapping port 3000.

## Instructions

- Backend Server Instructions: See `.github/instructions/backend.instructions.md`
- Frontend Application Instructions: See `.github/instructions/frontend.instructions.md`
- README Instructions: See `.github/instructions/readme.instructions.md`
- Settings like API endpoint and server port are configured via environment variables in the `.env` file.
- If `.env` exists, never overwrite it; only create it if it does not exist.