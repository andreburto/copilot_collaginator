FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY src/ ./src/
COPY .env ./
COPY init.sql ./

EXPOSE 3000

RUN npm install

# Start the application
ENTRYPOINT ["sh", "-c", "source .env && npm run start"]
