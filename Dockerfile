# Use the official Node.js image as the base image
FROM node:18

# Set the working directory
WORKDIR /apps/web

# Copy package.json and package-lock.json (or yarn.lock) first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application (if needed)
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Define environment variables (if needed)
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
