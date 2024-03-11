https://fastapi.tiangolo.com/deployment

## For starting the backend 
```
pip install -r requirements.txt <br/>
uvicorn main:app --reload --workers 2 <br/>
```
--workers: The number of worker processes to use, each will run a Uvicorn worker, in this case, 4 workers. <br/>
--reload: make the server restart after code changes. Only use for development.