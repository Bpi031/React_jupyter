from fastapi import FastAPI
from fastapi import File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from GPTresponse import AzureOpenAIRequest
from NER_spacy import DataFrameProcessor, SentenceProcessor
from Filebowser import Filebowser 
import spacy

app = FastAPI()

#Rounting
origins = [
    "http://localhost:3000",  # React app
    "http://localhost:8000",  # FastAPI server (change if needed)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model when the application starts
class transformer:
    nlp = None
    def load_model():
        global nlp
        if spacy.prefer_gpu():
            print("Using GPU!")
        else:
            print("Using CPU :(")
        nlp = spacy.load("en_core_web_lg")

    load_model()  

    #get GPT response
    @app.post("/GPTresponse")
    async def response(sentence: str):
        azure_request = AzureOpenAIRequest()
        ans = azure_request.get_response("Write the code to " + sentence, "You are a data analysis programmer, don't include any explanations in your responses.")
        content = ans.choices[0].message.content
        return {content}

    #upload file and mask by NER then return the dataframe
    @app.post("/dataframe")
    async def process_data(file: UploadFile = File(...)):
        contents = await file.read()
        with open(file.filename, 'wb') as f:
            f.write(contents)
        df_processor = DataFrameProcessor(nlp)
        df = df_processor.process(file.filename)
        os.remove(file.filename) 
        return {df}

    #mask by NER and return the sentence
    @app.post("/sentence")
    async def process_sentence(sentence: str):
        sentence_processor = SentenceProcessor(nlp)
        sentence = sentence_processor.get_entities(sentence)
        return {sentence}

    #final request process
    @app.post("/request")
    async def combined_process(sentence: str = Form(...), file: UploadFile = File(...)):
        
        # Mask the sentence
        sentence_processor = SentenceProcessor(nlp)
        entities = sentence_processor.get_entities(sentence)
        
        # Mask the file 
        contents = await file.read()
        with open(file.filename, 'wb') as f:
            f.write(contents)
        df_processor = DataFrameProcessor(nlp)
        df = df_processor.process(file.filename)
        os.remove(file.filename) 

        combine_request = "Code instruction:{}\n{}".format(entities, df)

        # Send to GPT
        azure_request = AzureOpenAIRequest()
        ans = azure_request.get_response(file_name='example.csv',docstring='combine_request')
        content = azure_request.extract_code_block(ans)
        return {"content": content, "masked": combine_request}



# Read, insert, delete local files
class FileManager:
    def __init__(self):
        self.file_manager = Filebowser('/path/to/your/base/dir')

    @app.get("/files/{file_path:path}")
    async def get_file(self, file_path: str):
        try:
            return {"content": self.file_manager.read_file(file_path)}
        except HTTPException:
            raise HTTPException(status_code=404, detail="File not found")

    @app.post("/files/{file_path:path}")
    async def add_file(self, file_path: str, content: str):
        self.file_manager.add_file(file_path, content)
        return {"message": "File added successfully"}

    @app.delete("/files/{file_path:path}")
    async def delete_file(self, file_path: str):
        try:
            self.file_manager.delete_file(file_path)
            return {"message": "File deleted successfully"}
        except HTTPException:
            raise HTTPException(status_code=404, detail="File not found")