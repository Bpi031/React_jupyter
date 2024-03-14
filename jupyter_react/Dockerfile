# Build phase
# Start from a base image with Node.js installed
FROM node:16.6.1 as build

# Set a working directory for the application
WORKDIR /app

# Copy package.json and package-lock.json into the Docker image
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the React application into the Docker image
COPY . .

# Build the React application
RUN npm run build

# Run phase
# Start from a base image with Nginx installed
FROM nginx:1.19.0-alpine

# Copy the build output to replace the default nginx contents.
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]