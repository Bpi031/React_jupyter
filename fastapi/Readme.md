https://fastapi.tiangolo.com/deployment

For starting the backend 
uvicorn main:app --reload --workers 2

--workers: The number of worker processes to use, each will run a Uvicorn worker, in this case, 4 workers.
--reload: make the server restart after code changes. Only use for development.