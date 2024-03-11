#!/bin/bash

# Start Jupyter server
gnome-terminal -- /bin/sh -c "jupyter server --ServerApp.allow_origin='http://127.0.0.1:3000' --ServerApp.token='123456'"

# Start React app
gnome-terminal -- /bin/sh -c "cd jupyter_react && npm start"

# Start FastAPI app
gnome-terminal -- /bin/sh -c "cd fastapi && uvicorn main:app --reload"