## Docker v2
# Docker Services Startup and Build Guide

This guide will help you build and start the Docker services defined in the `docker-compose.yml` file.

# Prerequisites

- Docker
- Docker Compose

# Services

The `docker-compose.yml` file defines the following services:

- `jupyter`: A Jupyter notebook server. Accessible at `http://localhost:8888`.
- `julia`: A Julia server. 
- `rstudio`: An RStudio server. Accessible at `http://localhost:8890`.
- `fastapi-middleware`: A middle contain NER model and dataframe process. Accessible at `http://localhost:8000`.
- `jupyter-react`: A front end web for code edit. Accessible at `http://localhost:3000`.

# Building the Services

Before starting the services, you need to build the Docker images. Navigate to the directory containing the `docker-compose.yml` file and run:

```bash
docker-compose build
```

# Start the service
```bash
docker-compose up
```

# Stopping the Services
```bash
docker-compose down
```


# Install the packages and env files v1
```
cd pip install -r requirements.txt 
cd ./jupyter_react && npm install 
```
# Start
```
chmod +x start_servers.sh 
./start_servers.sh
```
