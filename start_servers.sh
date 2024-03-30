# Function to stop servers
stop_servers() {
    kill %1 %2 %3
}

# Trap SIGINT signal and stop servers
trap stop_servers SIGINT

# Change to jupyter_react directory and start React app
cd jupyter_react && npm start &

# Change to fastapi directory and start FastAPI app
cd ./fastapi && uvicorn main:app --reload &

# Change to parent directory
#cd ..

# Start Jupyter server
jupyter server --ServerApp.allow_origin='http://localhost:3000' --ServerApp.token='123456' &

# Wait for all background processes to finish
wait