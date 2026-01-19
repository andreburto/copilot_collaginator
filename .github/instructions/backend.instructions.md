---
applyTo: "src/backend/server.js"
description: Instructions for the backend server of the Copilot Collaginator project.
---

# Backend Server Instructions

The backend of the Copilot Collaginator project is built using Node.js. It is mostly a proxy server that handles requests from the frontend and communicates with one external API endpoint.

The endpoint URL is: `https://afoyu5tqu4.execute-api.us-east-1.amazonaws.com/yvonne/random`

It returns JSON data in the following format:

```json
{
  "link": "http://mytrapster.yvonneshow.xyz/20180307020357.png", 
  "thumb": "http://mytrapster.yvonneshow.xyz/th_20180307020357.png"
}
```

The backend server will call these endpoint, retrieve the JSON data, and fetch the image from the "thumb" URL, then return the image data to the frontend in PNG format.

Log the JSON response from the external API to the console for debugging purposes. Include a timestamp with each log entry.

# Code Guidelines for Backend Server

- Use modern JavaScript (ES6+) features such as `const`, `let`, arrow functions, template literals, and destructuring for cleaner and more efficient code.
- Ensure proper error handling for all asynchronous operations, especially when making external API calls. Use `try/catch` blocks or `.catch()` methods to handle promise rejections.
- Implement logging for important events, such as successful API calls, errors, and server start-up. Use a logging library like `winston` or `morgan` for structured logging.
- Write modular code by separating different functionalities into distinct functions or modules. This improves readability and maintainability.
- Use environment variables for configuration settings such as API endpoints, ports, and any sensitive information. Utilize the `dotenv` package to manage these variables.
- Follow RESTful principles for any API endpoints you create, ensuring that they are intuitive and adhere to standard HTTP methods (GET, POST, PUT, DELETE).
- Include comments where necessary to explain complex logic or decisions made in the code. However, avoid over-commenting obvious code.
- Maintain consistent code formatting and style throughout the codebase. Consider using a linter like ESLint to enforce coding standards.