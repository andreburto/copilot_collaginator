const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

// Load configuration from environment variables
const PORT = process.env.PORT;
const API_ENDPOINT = process.env.API_ENDPOINT;

// Validate required environment variables
if (!PORT) {
  console.error('ERROR: PORT is not defined in .env file');
  process.exit(1);
}

if (!API_ENDPOINT) {
  console.error('ERROR: API_ENDPOINT is not defined in .env file');
  process.exit(1);
}

const app = express();

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Middleware to log requests
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

/**
 * GET /api/image
 * Fetches a random image from the external API and returns it as PNG
 */
app.get('/api/image', async (req, res) => {
  const timestamp = new Date().toISOString();
  
  try {
    // Fetch JSON data from external API
    const response = await axios.get(API_ENDPOINT);
    const { link, thumb } = response.data;
    
    console.log(`[${timestamp}] API Response:`, JSON.stringify(response.data));
    
    // Fetch the image from the thumb URL
    const imageResponse = await axios.get(thumb, {
      responseType: 'arraybuffer'
    });
    
    // Set content type and send image data
    res.set('Content-Type', 'image/png');
    res.send(Buffer.from(imageResponse.data));
    
  } catch (error) {
    console.error(`[${timestamp}] Error fetching image:`, error.message);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

// Start the server
app.listen(PORT, () => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Server started on http://localhost:${PORT}`);
  console.log(`[${timestamp}] Using API endpoint: ${API_ENDPOINT}`);
});
