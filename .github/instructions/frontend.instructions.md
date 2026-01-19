---
applyTo: "src/frontend/**"
description: Instructions for the frontend application of the Copilot Collaginator project.
---

## Frontend

The frontend of the Copilot Collaginator project is built using HTML5 and jQuery. It displays a collage of images fetched from the backend server using an HTML5 canvas element. The frontend will make requests to the backend server to get the image data, then draw the images onto the canvas in a collage format.

The collage layout should arrange randomly, images can overlap, but need to be evenly distributed across the canvas. The frontend should also handle loading states and errors gracefully, providing feedback to the user via `console.log` messages when images are being fetched or if an error occurs during the fetch process.

The script should request a new image every 30 seconds and update the collage accordingly.

# UI Guidelines

- The canvas should start out as large as the browser window.
- It should never reduce in size, even if the window is resized smaller. The canvas is the size it starts with and never changes.
- The 30 second interval for fetching new images should be stored in local storage so that if the user refreshes the page, the interval remains consistent. Check local storage for the value on page load and use it if it exists; otherwise, start a new interval and store it. Updating the interval in local storage will override the default value.
- The collage should always attempt to fill the entire canvas area with images, adjusting the layout as new images are added.
- The images should be drawn with a slight random rotation to create a more dynamic collage effect.
- Start with a black background for the canvas.
