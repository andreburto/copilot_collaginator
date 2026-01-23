---
applyTo: "src/frontend/**"
description: Instructions for the frontend application of the Copilot Collaginator project.
---

# Frontend

## index.html

The frontend of the Copilot Collaginator project is built using HTML5 and jQuery. It displays a collage of images fetched from the backend server using an HTML5 canvas element. The frontend will make requests to the backend server to get the image data, then draw the images onto the canvas in a collage format.

The collage layout should arrange randomly, images can overlap, but need to be evenly distributed across the canvas. The frontend should also handle loading states and errors gracefully, providing feedback to the user via `console.log` messages when images are being fetched or if an error occurs during the fetch process.

The script should request a new image every 30 seconds and update the collage accordingly.

When the page loads, the frontend should make a GET request to the backend server's `/api/image` endpoint to fetch the initial image data. The response will be in JSON format, containing the image URL and thumbnail URL. The frontend should then load the image from the provided thumbnail URL and draw it onto the canvas.

Once the image is successfully drawn onto the canvas, log a message to the console indicating that the image has been added to the collage, along with a timestamp. Send a POST request to the backend server's `/api/collage` endpoint to save the image data, including its position and rotation, along with a unique `collage_id` that identifies the current collage session.

The value of `image_url` in the JSON payload should be the thumbnail URL provided by the backend.

Send the following JSON payload in the POST request:

```json
{
  "collage_id": "unique-collage-id-1234",
  "image_url": "http://example.com/thumb.png",
  "position": {"x": 100, "y": 150},
  "rotation": 15
}
```

## list.html

The `list.html` file displays a list of existing collages stored in the SQLite database. When the page loads, it should make a GET request to the backend server's `/api/collage/list` endpoint to fetch the list of collages.

Display the collages in a table format, showing the `collage_id` and `date_created` for each collage. Each `collage_id` should be a clickable link that navigates to a `collage.html` page, passing the `collage_id` as a query parameter. The link should open a new tab when clicked.

## collage.html

Display the `collage_id` passed as a query parameter in the page header. Call the backend server's `/api/collage/<collage_id>/images` endpoint with the `collage_id` to fetch the collage and image data. Display the collage on an HTML5 canvas element, drawing each image at its specified position and rotation. Delay loading each image by 10000 milliseconds to create a staggered effect.

The position data received from the backend is already in JSON format, so there is no need to parse it again.

# UI Guidelines

- Never set img.crossOrigin to 'anonymous' when loading images.
- The canvas should start out as large as the browser window.
- It should never reduce in size, even if the window is resized smaller. The canvas is the size it starts with and never changes.
- The 30 second interval for fetching new images should be stored in local storage so that if the user refreshes the page, the interval remains consistent.
- When the page loads, create a unique collage session ID (UUID). Refreshing the page should generate a new ID. This ID should be used for all image POST requests during that session.
- The collage should always attempt to fill the entire canvas area with images, adjusting the layout as new images are added.
- The images should be drawn with a slight random rotation to create a more dynamic collage effect.
- Start with a black background for the canvas.
