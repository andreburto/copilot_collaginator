---
applyTo: 'init.sql'
description: 'Instructions for initializing the SQLite database schema and data.'
---

# SQLite Initialization Instructions

Create `init.sql` file with the following SQL commands to set up the database schema and initial data.

# COLLAGE TABLE
Create a table named `collage` with the following columns:
- `id`: A varchar column that serves as the primary key.
- `date_created`: A datetime column that cannot be null.

# IMAGE TABLE
Create a table named `image` with the following columns:
- `id`: A varchar column that serves as the primary key.
- `collage_id`: A varchar column that cannot be null and references the `id` column in the `collage` table.
- `image_url`: A varchar column that cannot be null.
- `position`: An varchar column that cannot be null.
- `rotation`: An integer column that cannot be null.
- `date_created`: A datetime column that cannot be null.