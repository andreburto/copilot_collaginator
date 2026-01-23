# Copilot Collaginator

## About

A web application that fetches random images from an external API and displays them in a dynamic collage format using HTML5 canvas.

**Disclaimer**: This project was created with the assistance of GitHub Copilot.

## Features

- **Backend Server**: Node.js/Express server that acts as a proxy to fetch images from an external API
- **SQLite Database**: Persistent storage for collage data and image metadata
- **Dynamic Collage**: HTML5 canvas-based collage that continuously updates with new images
- **Collage Sessions**: Each browser session maintains a unique collage ID for data persistence
- **Auto-refresh**: Automatically fetches new images every 30 seconds
- **Persistent Timing**: Uses localStorage to maintain consistent fetch intervals across page refreshes
- **Random Layout**: Images are placed randomly with slight rotation for a dynamic effect
- **Responsive Canvas**: Canvas starts at browser window size and never shrinks
- **REST API**: Full REST API for retrieving and saving collage data

## Project Structure

```
copilot_collaginator/
├── src/
│   ├── backend/
│   │   └── server.js          # Express server
│   └── frontend/
│       ├── index.html          # Main HTML file
│       ├── style.css           # Styles
│       └── app.js              # Frontend logic
├── .env                        # Environment variables
├── Dockerfile                  # Docker configuration
├── init.sql                    # Database schema initialization
├── start.bat                   # Windows startup script
├── start.sh                    # Unix/Linux/Mac startup script
├── package.json                # Dependencies
└── README.md                   # This file
```

## Setup

### Option 1: Docker (Recommended)

The easiest way to run the application is using the provided startup scripts:

**Windows:**
```bash
start.bat
```

**Unix/Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

These scripts will automatically:
- Build the Docker image
- Run the container with the application on port 3000

**Manual Docker Commands:**
```bash
docker build -t copilot-collaginator .
docker run -p 3000:3000 copilot-collaginator
```

### Option 2: Local Installation

1. **Install Dependencies**

```bash
npm install
```

2. **Configure Environment** (Required)

The `.env` file must contain the following configuration:
- `PORT`: Server port (default: 3000)
- `EXTERNAL_API_URL`: External API endpoint for fetching images
- `DATABASE_FILE`: SQLite database filename (default: database.sqlite)

Example `.env` file:
```
PORT=3000
EXTERNAL_API_URL=<your-api-endpoint-url>
DATABASE_FILE=database.sqlite
```

3. **Start the Server**

```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

### Access the Application

Navigate to `http://localhost:3000` to view the collage.

## How It Works

### Backend
- Express server proxies requests to the external API
- Validates required environment variables on startup
- Fetches JSON data containing image URLs
- Returns the thumbnail URL to the frontend
- Stores collage data (image URLs, positions, rotations) in SQLite database
- Logs all API responses with timestamps
- Automatically initializes the database from init.sql if it doesn't exist

### Frontend
- jQuery-based application with HTML5 canvas
- Creates a unique collage session ID stored in localStorage
- Requests a new image every 30 seconds
- Places images randomly across the canvas with slight rotation
- Images can overlap for a collage effect
- Sends image metadata to backend for persistence
- Uses localStorage to maintain consistent timing across refreshes

### Database
- SQLite database for persistent storage
- `collage` table: Stores collage metadata with unique IDs and creation timestamps
- `image` table: Stores image metadata including URLs, positions, rotations, and references to collages

## API Endpoint

The application fetches images from an external API.

Response format:
```json
{
  "link": "<url-to-full-image>",
  "thumb": "<url-to-thumbnail-image>"
}
```

## Technologies Used

- **Backend**: Node.js, Express, Axios, SQLite3, UUID
- **Frontend**: HTML5, CSS3, jQuery, Canvas API
- **Deployment**: Docker

## Update Log

* **2026-01-22**: Enhanced database functionality with proper table naming (collages/collage_images). Added list.html and collage.html pages for viewing saved collages. Added new backend endpoints (/list, /collage, /api/collage/list, /api/collage/:collage_id/images). Updated frontend to generate new collage session ID on each page load. Fixed Dockerfile to include init.sql file.
* **2026-01-21**: Added SQLite database integration for persistent collage storage. Added REST API endpoints for saving and retrieving collage data. Frontend now tracks collage sessions and saves image metadata to backend.
* **2026-01-20**: Added Docker support with Dockerfile and startup scripts (start.bat, start.sh) for easy deployment.
* **2026-01-18**: Updated README to include About section with GitHub Copilot disclaimer, removed specific API URL, and added Update Log section.
* **2026-01-18**: Updated environment variable handling to require PORT and API_ENDPOINT in .env file with validation. Updated .gitignore to include package-lock.json and dist/ directory.
* **2026-01-18**: Initial project setup with backend server, frontend collage application, and documentation.
