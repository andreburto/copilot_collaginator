-- Initialize SQLite database schema for Copilot Collaginator

-- Create collages table
CREATE TABLE IF NOT EXISTS collages (
  id VARCHAR PRIMARY KEY,
  date_created DATETIME NOT NULL
);

-- Create collage_images table
CREATE TABLE IF NOT EXISTS collage_images (
  id VARCHAR PRIMARY KEY,
  collage_id VARCHAR NOT NULL,
  image_url VARCHAR NOT NULL,
  position VARCHAR NOT NULL,
  rotation INTEGER NOT NULL,
  date_created DATETIME NOT NULL,
  FOREIGN KEY (collage_id) REFERENCES collages(id)
);
