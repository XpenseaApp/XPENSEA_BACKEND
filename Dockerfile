# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.13.1

# Use the official Node.js image with Alpine for a smaller image size
FROM node:${NODE_VERSION}-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Use production node environment by default
ENV NODE_ENV=production

# Copy package.json and package-lock.json into the container
# This step is separate to take advantage of Docker caching.
COPY package*.json ./

# Install only production dependencies (ignores dev dependencies)
RUN npm ci --omit=dev

# Copy the rest of the application source code into the container
COPY . .

# Set the user to 'node' to run the application as a non-root user
USER node

# Expose the port that the application listens on
EXPOSE 3040

# Start the Node.js application
CMD ["npm", "start"]
