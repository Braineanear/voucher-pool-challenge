# Stage 1: Build the application
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Start the application
CMD ["node", "dist/main"]
