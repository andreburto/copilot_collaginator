# Copilot Collaginator

## About

A web application that fetches random images from an external API and displays them in a dynamic collage format using HTML5 canvas.

**Disclaimer**: This project was created with the assistance of GitHub Copilot.

## Features

- **Backend Server**: Node.js/Express server that acts as a proxy to fetch images from an external API
- **Dynamic Collage**: HTML5 canvas-based collage that continuously updates with new images
- **Auto-refresh**: Automatically fetches new images every 30 seconds
- **Persistent Timing**: Uses localStorage to maintain consistent fetch intervals across page refreshes
- **Random Layout**: Images are placed randomly with slight rotation for a dynamic effect
- **Responsive Canvas**: Canvas starts at browser window size and never shrinks

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
├── package.json                # Dependencies
└── README.md                   # This file
```

## Setup

1. **Install Dependencies**

```bash
npm install
```

2. **Configure Environment** (Required)

The `.env` file must contain the following configuration:
- `PORT`: Server port (e.g., 3000)
- `API_ENDPOINT`: External API endpoint for fetching images

Example `.env` file:
```
PORT=3000
API_ENDPOINT=https://afoyu5tqu4.execute-api.us-east-1.amazonaws.com/yvonne/random
```

3. **Start the Server**

```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

4. **Open in Browser**

Navigate to `http://localhost:3000` to view the collage.

## How It Works

### Backend
- Express server proxies requests to the external API
- Validates required environment variables on startup
- Fetches JSON data containing image URLs
- Retrieves the thumbnail image and returns it as PNG
- Logs all API responses with timestamps

### Frontend
- jQuery-based application with HTML5 canvas
- Requests a new image every 30 seconds
- Places images randomly across the canvas with slight rotation
- Images can overlap for a collage effect
- Uses localStorage to maintain consistent timing across refreshes

## API Endpoint

The application fetches images from an external API.

Response format:
```json
{
  "link": "http://mytrapster.yvonneshow.xyz/20180307020357.png",
  "thumb": "http://mytrapster.yvonneshow.xyz/th_20180307020357.png"
}
```

## Technologies Used

- **Backend**: Node.js, Express, Axios
- **Frontend**: HTML5, CSS3, jQuery, Canvas API
- **Environment**: dotenv for configuration

## UPDATE LOG


## Update Log

* **2026-01-18**: Updated README to include About section with GitHub Copilot disclaimer, removed specific API URL, and added Update Log section.
* **2026-01-18**: Initial project setup with backend server, frontend collage application, and documentation.
* **2026-01-18**: Updated environment variable handling to require PORT and API_ENDPOINT in .env file with validation. Updated .gitignore to include package-lock.json and dist/ directory.
