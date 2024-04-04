DIR=$(dirname "$0")

# Function to stop servers
stop_servers() {
    kill %1 %2 %3
}

# Trap SIGINT signal and stop servers
trap stop_servers SIGINT

# Activate the virtual environment
source "$DIR/fastapi/env/bin/activate"

# Start React app
(cd "$DIR/jupyter_react" && npm start) &

# Start FastAPI app
(cd "$DIR/fastapi" && echo "Current directory: $(pwd)" && echo "Python path: $(which python3)" && python3 -m uvicorn main:app --reload) &
# Start Jupyter server
jupyter server --ServerApp.allow_origin='http://localhost:3000' --ServerApp.token='123456' &