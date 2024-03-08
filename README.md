# New terminal
jupyter server --ServerApp.allow_origin='http://127.0.0.1:3000' --ServerApp.token='123456'

# New terminal
cd jupyter_react && npm start

# New terminal
cd fastapi && uvicorn main:app --reload

