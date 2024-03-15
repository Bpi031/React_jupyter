# Build phase
# Start from a base image with Node.js installed
FROM node:16.6.1 

# Set a working directory for the application
WORKDIR /app

# Copy package.json and package-lock.json into the Docker image
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the React application into the Docker image
COPY . .

# Expose port 80
EXPOSE 3000

# Start Nginx
CMD ["npm", "start"]