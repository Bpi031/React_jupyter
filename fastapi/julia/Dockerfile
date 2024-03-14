# Dockerfile for Julia
# Use an official Julia runtime as a parent image
FROM julia:1.6.2

# Set the working directory in the container to /app
WORKDIR /app

# Add the current directory contents into the container at /app
ADD . /app

# Copy Project.toml into the Docker image
COPY Project.toml .

# Use Julia to install the packages from Project.toml
RUN julia --project=. -e 'using Pkg; Pkg.instantiate()'

# Make port 3000 available to the world outside this container
EXPOSE 8890

# Run Julia when the container launches
CMD ["julia"]