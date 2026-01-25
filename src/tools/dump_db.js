/**
 * Database Dump Utility
 * 
 * This script dumps the contents of the SQLite database for debugging purposes.
 * It displays all collages and their associated images in a readable format.
 * 
 * Usage: node src/tools/dump_db.js
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const DATABASE_FILE = process.env.DATABASE_FILE || 'data/database.sqlite';
const dbPath = path.join(__dirname, '../../', DATABASE_FILE);

// Check if database exists
if (!fs.existsSync(dbPath)) {
  console.error(`ERROR: Database file not found at ${dbPath}`);
  console.error('Make sure the server has been started at least once to create the database.');
  process.exit(1);
}

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log(`Connected to database: ${dbPath}\n`);
});

/**
 * Dump all collages
 */
const dumpCollages = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM collage ORDER BY date_created DESC', [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      
      console.log('='.repeat(80));
      console.log('COLLAGES');
      console.log('='.repeat(80));
      
      if (rows.length === 0) {
        console.log('No collages found.');
      } else {
        console.log(`Total collages: ${rows.length}\n`);
        rows.forEach((row, index) => {
          console.log(`[${index + 1}] Collage ID: ${row.id}`);
          console.log(`    Created: ${row.date_created}`);
          console.log('');
        });
      }
      
      resolve(rows);
    });
  });
};

/**
 * Dump all images for each collage
 */
const dumpImages = (collages) => {
  return new Promise((resolve, reject) => {
    console.log('='.repeat(80));
    console.log('IMAGES BY COLLAGE');
    console.log('='.repeat(80));
    
    if (collages.length === 0) {
      console.log('No collages to display images for.');
      resolve();
      return;
    }
    
    let processed = 0;
    
    collages.forEach((collage, collageIndex) => {
      db.all('SELECT * FROM image WHERE collage_id = ? ORDER BY date_created', [collage.id], (err, images) => {
        if (err) {
          reject(err);
          return;
        }
        
        console.log(`\n[Collage ${collageIndex + 1}] ${collage.id}`);
        console.log('-'.repeat(80));
        
        if (images.length === 0) {
          console.log('  No images in this collage.');
        } else {
          console.log(`  Total images: ${images.length}\n`);
          images.forEach((img, imgIndex) => {
            const position = JSON.parse(img.position);
            console.log(`  [${imgIndex + 1}] Image ID: ${img.id}`);
            console.log(`      URL: ${img.image_url}`);
            console.log(`      Position: (x: ${position.x}, y: ${position.y})`);
            console.log(`      Rotation: ${img.rotation}°`);
            console.log(`      Created: ${img.date_created}`);
            console.log('');
          });
        }
        
        processed++;
        if (processed === collages.length) {
          resolve();
        }
      });
    });
  });
};

/**
 * Get database statistics
 */
const dumpStatistics = () => {
  return new Promise((resolve, reject) => {
    Promise.all([
      new Promise((res, rej) => {
        db.get('SELECT COUNT(*) as count FROM collage', [], (err, row) => {
          if (err) rej(err);
          else res(row.count);
        });
      }),
      new Promise((res, rej) => {
        db.get('SELECT COUNT(*) as count FROM image', [], (err, row) => {
          if (err) rej(err);
          else res(row.count);
        });
      })
    ])
    .then(([collageCount, imageCount]) => {
      console.log('\n' + '='.repeat(80));
      console.log('DATABASE STATISTICS');
      console.log('='.repeat(80));
      console.log(`Total Collages: ${collageCount}`);
      console.log(`Total Images: ${imageCount}`);
      console.log(`Average Images per Collage: ${collageCount > 0 ? (imageCount / collageCount).toFixed(2) : 0}`);
      console.log('='.repeat(80));
      resolve();
    })
    .catch(reject);
  });
};

// Execute the dump
(async () => {
  try {
    const collages = await dumpCollages();
    await dumpImages(collages);
    await dumpStatistics();
    
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('\nDatabase connection closed.');
      }
    });
  } catch (error) {
    console.error('Error dumping database:', error.message);
    db.close();
    process.exit(1);
  }
})();
