---
applyTo: "src/frontend/**"
description: Instructions for the frontend application of the Copilot Collaginator project.
---

## Frontend

The frontend of the Copilot Collaginator project is built using HTML5 and jQuery. It displays a collage of images fetched from the backend server using an HTML5 canvas element. The frontend will make requests to the backend server to get the image data, then draw the images onto the canvas in a collage format.

The collage layout should arrange randomly, images can overlap, but need to be evenly distributed across the canvas. The frontend should also handle loading states and errors gracefully, providing feedback to the user via `console.log` messages when images are being fetched or if an error occurs during the fetch process.

The script should request a new image every 30 seconds and update the collage accordingly.

When the page loads, the frontend should make a GET request to the backend server's `/api/image` endpoint to fetch the initial image data. The response will be in JSON format, containing the image URL and thumbnail URL. The frontend should then load the image from the provided thumbnail URL and draw it onto the canvas.

Once the image is successfully drawn onto the canvas, log a message to the console indicating that the image has been added to the collage, along with a timestamp. Send a POST request to the backend server's `/api/collage` endpoint to save the image data, including its position and rotation, along with a unique `collage_id` that identifies the current collage session.

Send the following JSON payload in the POST request:

```json
{
  "collage_id": "unique-collage-id-1234",
  "image_url": "http://example.com/image.png",
  "position": {"x": 100, "y": 150},
  "rotation": 15
}
```

# UI Guidelines

- Never set img.crossOrigin to 'anonymous' when loading images.
- The canvas should start out as large as the browser window.
- It should never reduce in size, even if the window is resized smaller. The canvas is the size it starts with and never changes.
- The 30 second interval for fetching new images should be stored in local storage so that if the user refreshes the page, the interval remains consistent. Check local storage for the value on page load and use it if it exists; otherwise, start a new interval and store it. Updating the interval in local storage will override the default value.
- The collage should always attempt to fill the entire canvas area with images, adjusting the layout as new images are added.
- The images should be drawn with a slight random rotation to create a more dynamic collage effect.
- Start with a black background for the canvas.
