# Dockerfile for Jupyter
# Use an official Python runtime as a parent image
FROM python:3.8-slim-buster

# Set the working directory in the container to /app
WORKDIR /app

# Add the current directory contents into the container at /app
ADD . /app

# Install Jupyter
RUN pip install jupyter

# Make port 8888 available to the world outside this container
EXPOSE 8888

# Run Jupyter server when the container launches with the specified options
CMD ["jupyter", "server", "--ServerApp.allow_origin='http://127.0.0.1:3000'","--allow-root"]