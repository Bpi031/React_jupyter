# Start Jupyter server
jupyter server --ServerApp.allow_origin='http://localhost:3000' --ServerApp.token='123456' &

# Start React app
cd jupyter_react && npm start &

# Start FastAPI app
cd fastapi && uvicorn main:app --reload &

# Wait for all background processes to finish
wait