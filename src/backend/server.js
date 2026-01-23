const express = require('express');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Load configuration from environment variables
const PORT = process.env.PORT || '3000';
const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL;
const DATABASE_FILE = process.env.DATABASE_FILE || 'database.sqlite';

// Validate required environment variables
if (!EXTERNAL_API_URL) {
  console.error('ERROR: EXTERNAL_API_URL is not defined in .env file');
  process.exit(1);
}

const app = express();
app.use(express.json());

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

/**
 * GET /list
 * Serves the list.html page
 */
app.get('/list', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/list.html'));
});

/**
 * GET /collage
 * Serves the collage.html page
 */
app.get('/collage', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/collage.html'));
});

// Initialize database
let db;
const initDatabase = () => {
  const dbPath = path.join(__dirname, '../../', DATABASE_FILE);
  const dbExists = fs.existsSync(dbPath);
  
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      process.exit(1);
    }
    
    if (!dbExists) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] Database file not found. Creating new database...`);
      
      // Read and execute init.sql
      const initSqlPath = path.join(__dirname, '../../init.sql');
      if (fs.existsSync(initSqlPath)) {
        const initSql = fs.readFileSync(initSqlPath, 'utf8');
        db.exec(initSql, (err) => {
          if (err) {
            console.error('Error initializing database:', err.message);
            process.exit(1);
          }
          console.log(`[${timestamp}] Database initialized successfully`);
        });
      } else {
        console.error('ERROR: init.sql file not found');
        process.exit(1);
      }
    } else {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] Database connected: ${dbPath}`);
    }
  });
};

initDatabase();

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
    const response = await axios.get(EXTERNAL_API_URL);
    const { link, thumb } = response.data;
    
    console.log(`[${timestamp}] API Response:`, JSON.stringify(response.data));
    
    // Return JSON with both the full image link and thumbnail URL
    res.json({ 
      link: link,
      thumb: thumb 
    });
    
  } catch (error) {
    console.error(`[${timestamp}] Error fetching image:`, error.message);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

/**
 * GET /api/collage
 * Retrieves collage data by collage_id
 */
app.get('/api/collage', (req, res) => {
  const timestamp = new Date().toISOString();
  const { collage_id } = req.query;
  
  if (!collage_id) {
    return res.status(400).json({ error: 'collage_id parameter is required' });
  }
  
  // Get collage info
  db.get('SELECT * FROM collages WHERE id = ?', [collage_id], (err, collage) => {
    if (err) {
      console.error(`[${timestamp}] Database error:`, err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!collage) {
      return res.status(404).json({ error: 'Collage not found' });
    }
    
    // Get all images for this collage
    db.all('SELECT * FROM collage_images WHERE collage_id = ? ORDER BY date_created', [collage_id], (err, images) => {
      if (err) {
        console.error(`[${timestamp}] Database error:`, err.message);
        return res.status(500).json({ error: 'Database error' });
      }
      
      // Parse position strings back to objects
      const parsedImages = images.map(img => ({
        id: img.id,
        image_url: img.image_url,
        position: JSON.parse(img.position),
        rotation: img.rotation
      }));
      
      res.json({
        collage: {
          id: collage.id,
          date_created: collage.date_created
        },
        images: parsedImages
      });
    });
  });
});

/**
 * POST /api/collage
 * Saves image data to the collage
 */
app.post('/api/collage', (req, res) => {
  const timestamp = new Date().toISOString();
  const { collage_id, image_url, position, rotation } = req.body;
  
  // Validate required fields
  if (!collage_id || !image_url || !position || rotation === undefined) {
    return res.status(400).json({ error: 'Missing required fields: collage_id, image_url, position, rotation' });
  }
  
  // Check if collage exists, if not create it
  db.get('SELECT id FROM collages WHERE id = ?', [collage_id], (err, row) => {
    if (err) {
      console.error(`[${timestamp}] Database error:`, err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    
    const saveImage = () => {
      const imageId = uuidv4();
      const now = new Date().toISOString();
      const positionStr = JSON.stringify(position);
      
      db.run(
        'INSERT INTO collage_images (id, collage_id, image_url, position, rotation, date_created) VALUES (?, ?, ?, ?, ?, ?)',
        [imageId, collage_id, image_url, positionStr, rotation, now],
        function(err) {
          if (err) {
            console.error(`[${timestamp}] Error saving image:`, err.message);
            return res.status(500).json({ error: 'Failed to save image' });
          }
          
          console.log(`[${timestamp}] Image saved: ${imageId} for collage ${collage_id}`);
          res.json({ 
            success: true, 
            image_id: imageId,
            collage_id: collage_id
          });
        }
      );
    };
    
    if (!row) {
      // Create new collage
      const now = new Date().toISOString();
      db.run(
        'INSERT INTO collages (id, date_created) VALUES (?, ?)',
        [collage_id, now],
        function(err) {
          if (err) {
            console.error(`[${timestamp}] Error creating collage:`, err.message);
            return res.status(500).json({ error: 'Failed to create collage' });
          }
          
          console.log(`[${timestamp}] New collage created: ${collage_id}`);
          saveImage();
        }
      );
    } else {
      saveImage();
    }
  });
});

/**
 * GET /api/collage/list
 * Returns a list of all collages
 */
app.get('/api/collage/list', (req, res) => {
  const timestamp = new Date().toISOString();
  
  db.all('SELECT id, date_created FROM collages ORDER BY date_created DESC', [], (err, collages) => {
    if (err) {
      console.error(`[${timestamp}] Database error:`, err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    
    console.log(`[${timestamp}] Retrieved ${collages.length} collages`);
    res.json(collages);
  });
});

/**
 * GET /api/collage/:collage_id/images
 * Returns all images for a specific collage
 */
app.get('/api/collage/:collage_id/images', (req, res) => {
  const timestamp = new Date().toISOString();
  const { collage_id } = req.params;
  
  db.all('SELECT * FROM collage_images WHERE collage_id = ? ORDER BY date_created', [collage_id], (err, images) => {
    if (err) {
      console.error(`[${timestamp}] Database error:`, err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    
    // Parse position strings back to objects
    const parsedImages = images.map(img => ({
      id: img.id,
      image_url: img.image_url,
      position: img.position,
      rotation: img.rotation
    }));
    
    console.log(`[${timestamp}] Retrieved ${parsedImages.length} images for collage ${collage_id}`);
    res.json(parsedImages);
  });
});

// Start the server
app.listen(PORT, () => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Server started on http://localhost:${PORT}`);
  console.log(`[${timestamp}] Using API endpoint: ${EXTERNAL_API_URL}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nClosing database connection...');
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});
