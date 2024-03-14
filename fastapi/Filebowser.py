import os
from fastapi import HTTPException

class Filebowser:
    def __init__(self, base_dir):
        self.base_dir = base_dir

    def get_full_path(self, file_path):
        return os.path.join(self.base_dir, file_path)
    
    def read_file(self, file_path):
        try:
            with open(os.path.join(self.base_dir, file_path), 'r') as file:
                return file.read()
        except FileNotFoundError:
            raise HTTPException(status_code=404, detail="File not found")

    def add_file(self, file_path, content):
        with open(os.path.join(self.base_dir, file_path), 'w') as file:
            file.write(content)

    def delete_file(self, file_path):
        try:
            os.remove(os.path.join(self.base_dir, file_path))
        except FileNotFoundError:
            raise HTTPException(status_code=404, detail="File not found")