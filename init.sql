-- Initialize SQLite database schema for Copilot Collaginator

-- Create collage table
CREATE TABLE IF NOT EXISTS collage (
  id VARCHAR PRIMARY KEY,
  date_created DATETIME NOT NULL
);

-- Create image table
CREATE TABLE IF NOT EXISTS image (
  id VARCHAR PRIMARY KEY,
  collage_id VARCHAR NOT NULL,
  image_url VARCHAR NOT NULL,
  position VARCHAR NOT NULL,
  rotation INTEGER NOT NULL,
  date_created DATETIME NOT NULL,
  FOREIGN KEY (collage_id) REFERENCES collage(id)
);
