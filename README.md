# Developer Mode
## Install the packages and env files 
```
cd fastapi && pip install -r requirements.txt 
cd ./jupyter_react && npm install 
```
## Start
```
chmod +x start_servers.sh 
./start_servers.sh
```

# Docker deploy Mode
## Docker Services Startup and Build Guide

This guide will help you build and start the Docker services defined in the `docker-compose.yml` file.

## Prerequisites

- Docker
- Docker Compose

## Services

The `docker-compose.yml` file defines the following services:

- `jupyter`: A Jupyter notebook server. Accessible at `http://localhost:8888`.
- `python`: A Python with anaconda packages.
- `julia`: A Julia kernel. 
- `rstudio`: An RStudio kernel.
- `fastapi-middleware`: A middle contain NER model and dataframe process. Accessible at `http://localhost:8000`.
- `jupyter-react`: A front end web for code edit. Accessible at `http://localhost:3000`.

## Building the Services

Before starting the services, you need to build the Docker images. Navigate to the directory containing the `docker-compose.yml` file and run:
! select the server what you need
```bash
docker-compose build 
```
Basic servers you need to build if you don't want to build all
```bash
docker-compose build jupyter-react &
docker-compose build fastapi &
docker-compose build jupyter &
wait
```


## Start the service
```bash
docker-compose up
```

## Stopping the Services
```bash
docker-compose down
```
