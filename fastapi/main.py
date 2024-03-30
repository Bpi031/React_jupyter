from fastapi import FastAPI, Request
from fastapi import File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import os
from GPTresponse import AzureOpenAIRequest
from NER_spacy import DataFrameProcessor, SentenceProcessor
from Filebowser import FileBrowser
import spacy

app = FastAPI()
file_browser = FileBrowser(app)

#Rounting
origins = [
    "http://localhost:3000",  # React app
    "http://localhost:8000",  # FastAPI server (change if needed)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    

#file browser
class FileBrowser:

    @app.get("/files")
    def list_files(request: Request):
        return file_browser.list_files(request)

    @app.post("/files")
    async def upload_files(request: Request, file: UploadFile = File(...)):
        return await file_browser.upload_files(request, file)

    @app.delete("/files")
    def delete_file(file_name: str):
        return file_browser.delete_file(file_name)

    @app.put("/files")
    def rename_file(file_name, new_name):
        return file_browser.rename_file(file_name, new_name)