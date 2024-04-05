# Project Introduction

This project focuses on enhancing data security in data analysis processes. It achieves this by:

Utilizing a Named Entity Recognition (NER) model to pixelate sensitive information in dataframes, thereby ensuring data privacy and security.

Leveraging the Language Model (LLM) to provide robust and efficient data processing capabilities. This combination of NER and LLM allows for secure, efficient, and accurate data analysis.

Offering a significant improvement in data analysis coding speed for the traditional finance industry. With the power of LLM, financial analysts can code faster without worrying about data leakage.

The project includes:

A FastAPI server for handling requests.
A Jupyter notebook server for data analysis and model training.
A front-end web application for code editing and interaction.
The project can be run in a development environment or deployed using Docker for scalability and ease of use. It is an excellent choice for anyone looking to perform secure data analysis while maintaining the privacy and security of the underlying data.


# Developer Mode
## Install the packages and env files 
```bash
cd fastapi 
chmod +x start_servers.sh 
./install_venv.sh

cd ../jupyter_react && npm install 
```
## Add .env file in ./fastapi with
```
AZURE_OPENAI_API_KEY = replace_with_your_api
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

```bash
docker-compose build 
```
Alternative
```bash
docker-compose build --parallel
```

## Start the service
```bash
docker-compose up
```

## Stopping the Services
```bash
docker-compose down
```
