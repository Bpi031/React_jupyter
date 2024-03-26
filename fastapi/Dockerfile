# Start from a base image with Python installed
FROM python:3.8

# Set a directory for the app
WORKDIR /app

# Copy the requirements.txt file into the container at /app
COPY requirements.txt ./

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
RUN python -m spacy download en_core_web_lg

# Copy the current directory contents into the container at /fastapi
COPY . .

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Run the application with uvicorn and enable hot reloading
CMD ["uvicorn", "main:app", "--reload"]