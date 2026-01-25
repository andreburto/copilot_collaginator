---
applyTo: "src/backend/server.js"
description: Instructions for the backend server of the Copilot Collaginator project.
---

# Backend Server Instructions

The backend of the Copilot Collaginator project is built using Node.js. It is mostly a proxy server that handles requests from the frontend and communicates with one external API endpoint.

When the server starts up, it listens on a port defined in the environment variable `PORT`, defaulting to `3000` if not set. Check to id the database file defined by the environment variable `DATABASE_FILE` exists in the project root directory. If it does not exist, create the data directory if needed, create a new SQLite database file and set up the necessary tables. Defsult to `data/database.sqlite` if the variable is not set.

# External API Interaction

## GET: /

This is the root endpoint of the backend server. It serves THE `index.html` file located in the `src/frontend/` directory. This file contains the frontend application that interacts with the backend server.

## GET: /list

This endpoint returns the `list.html` file located in the `src/frontend/` directory. This file displays a list of existing collages stored in the SQLite database.

## GET: /collage

This endpoint returns the `collage.html` file located in the `src/frontend/` directory. This file displays a specific collage based on the `collage_id` query parameter.

## GET: /api/image

The endpoint URL is definhed in the environment variable `EXTERNAL_API_URL`. This endpoint returns image data in JSON format.

It returns JSON data in the following format:

```json
{
  "link": "http://mytrapster.yvonneshow.xyz/20180307020357.png", 
  "thumb": "http://mytrapster.yvonneshow.xyz/th_20180307020357.png"
}
```

The backend server will call these endpoint, retrieve the JSON data, and fetch the image from the "thumb" URL, then return the image data to the frontend in PNG format.

Log the JSON response from the external API to the console for debugging purposes. Include a timestamp with each log entry.

## GET: /api/collage

This endpoint accepts a GET request with a query parameter `collage_id`, which is a UUID string that uniquely identifies the collage. It returns a JSON array of collage and image data for the specified collage. The JSON response has the following format:

```json
{
  "collage": {
    "id": "collage-uuid-1234",
    "date_created": "2024-01-01T12:00:00Z"
  },
  "images": [
    {
      "id": "unique-image-id-1",
      "image_url": "http://example.com/image1.png",
      "position": {"x": 100, "y": 150},
      "rotation": 15
    },
    {
      "id": "unique-image-id-2",
      "image_url": "http://example.com/image2.png",
      "position": {"x": 200, "y": 250},
      "rotation": -10
    }
    // More image entries can follow
  ]
}
```

- `id`: Unique identifier for the image entry
- `collage_id`: UUID string that uniquely identifies the collage
- `image_url`: URL to the image
- `position`: Integer representing the position of the image in the collage
- `rotation`: Integer representing the rotation angle of the image in degrees

## POST: /api/collage

This endpoint accepts a POST request with a JSON body containing a two fields:

- `image_url`, which is a URL to an image
- `position`, which is an varchar representing the position of the image in the collage in the format `{"x":100,"y":150}`.
- `rotation`, which is an integer representing the rotation angle of the image in degrees
- `collage_id`, which is a UUID string that uniquely identifies the collage.

The backend server will take these and insert them into a SQLite database table named `image`. The table has the following schema:

```sql
CREATE TABLE image (
  id VARCHAR PRIMARY KEY,
  collage_id VARCHAR NOT NULL,
  image_url VARCHAR NOT NULL,
  position VARCHAR NOT NULL,
  rotation INTEGER NOT NULL,
  date_created DATETIME NOT NULL
);
```

When a new image is added to a collage, generate a unique UUID for the `id` field and set the `date_created` field to the current date and time.

Check if the `collage_id` already exists in the database. If it does not exist, create a new entry in a separate `collage` table with the following schema:

```sql
CREATE TABLE collage (
  id VARCHAR PRIMARY KEY,
  date_created DATETIME NOT NULL
);
```

## GET: /api/collage/list

This endpoint returns a JSON array of all existing collages in the database. Each collage entry includes its unique `id` and `date_created` timestamp. The JSON response has the following format:

```json
[
  {
    "id": "collage-uuid-1234",
    "date_created": "2024-01-01T12:00:00Z"
  },
  {
    "id": "collage-uuid-5678",
    "date_created": "2024-01-02T15:30:00Z"
  }
  // More collage entries can follow
]
```

## GET: /api/collage/<collage_id>/images

This endpoint retrieves all images associated with a specific collage identified by the `collage_id` parameter in the URL. It returns a JSON array of image entries, each containing its unique `id`, `image_url`, `position`, and `rotation`. The JSON response has the following format:

```json
[
  {
    "id": "unique-image-id-1",
    "image_url": "http://example.com/image1.png",
    "position": {"x": 100, "y": 150},
    "rotation": 15
  },
  {
    "id": "unique-image-id-2",
    "image_url": "http://example.com/image2.png",
    "position": {"x": 200, "y": 250},
    "rotation": -10
  }
  // More image entries can follow
]
```

# Code Guidelines for Backend Server

- Use modern JavaScript (ES6+) features such as `const`, `let`, arrow functions, template literals, and destructuring for cleaner and more efficient code.
- Ensure proper error handling for all asynchronous operations, especially when making external API calls. Use `try/catch` blocks or `.catch()` methods to handle promise rejections.
- Implement logging for important events, such as successful API calls, errors, and server start-up. Use a logging library like `winston` or `morgan` for structured logging.
- Write modular code by separating different functionalities into distinct functions or modules. This improves readability and maintainability.
- Use environment variables for configuration settings such as API endpoints, ports, and any sensitive information. Utilize the `dotenv` package to manage these variables.
- Follow RESTful principles for any API endpoints you create, ensuring that they are intuitive and adhere to standard HTTP methods (GET, POST, PUT, DELETE).
- Include comments where necessary to explain complex logic or decisions made in the code. However, avoid over-commenting obvious code.
- Maintain consistent code formatting and style throughout the codebase. Consider using a linter like ESLint to enforce coding standards.