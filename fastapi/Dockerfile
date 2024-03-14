# Start from a base image with Python installed
FROM python:3.8

# Set a directory for the app
WORKDIR /fastapi

# Copy requirements.txt file into the Docker image
COPY requirements.txt ./

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the source code from your host to your image filesystem.
COPY . .

# Make port 80 available to the world outside this container
EXPOSE 8000

# Run the application with uvicorn and enable hot reloading
CMD ["uvicorn", "main:app", "--reload", "--workers", "2" ]