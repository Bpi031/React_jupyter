
## Get start

jupyter server --ServerApp.allow_origin='http://127.0.0.1:3000' --ServerApp.token='123456'

cd jupyter_react
npm start

cd fastapi
uvicorn main:app --reload
