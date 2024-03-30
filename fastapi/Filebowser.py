from fastapi import FastAPI, Request, UploadFile, File
from fastapi.staticfiles import StaticFiles
import os

directory = "/home/haha/React_jupyter/fastapi/test"

class FileBrowser:
    def __init__(self, app: FastAPI):
        app.mount("/files", StaticFiles(directory=directory), name="files")

    def list_files(self, request: Request):
        files = os.listdir(directory)
        files_paths = sorted([f"{f}" for f in files])
        print(files_paths)
        return {"files": files_paths}

    async def upload_files(self, request: Request, file: UploadFile = File(...)):
        contents = await file.read()
        with open(f"{directory}/{file.filename}", "wb") as f:
            f.write(contents)
        return {"filename": file.filename}

    def delete_file(self, file_name: str):
        os.remove(f"{directory}/{file_name}")
        return {"filename": file_name}

    def rename_file(self, file_name: str, new_name: str):
        os.rename(f"{directory}/{file_name}", f"{directory}/{new_name}")
        return {"filename": new_name}