from fastapi import FastAPI
from fastapi import File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

from GPTresponse import AzureOpenAIRequest
from NER_spacy import DataFrameProcessor, SentenceProcessor

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
    processor = DataFrameProcessor()
    df = processor.process(file.filename)
    os.remove(file.filename) 
    return {df}

#mask by NER and return the sentence
@app.post("/sentence")
async def process_sentence(sentence: str):
    processor = SentenceProcessor()
    sentence = processor.get_entities(sentence)
    return {sentence}


#final request process
@app.post("/request")
async def combined_process(sentence:str, file: UploadFile = File(...)):
    
    # Mask the file 
    contents = await file.read()
    with open(file.filename, 'wb') as f:
        f.write(contents)
    processor = DataFrameProcessor()
    df = processor.process(file.filename)
    os.remove(file.filename) 

    # Mask the sentence
    processor = SentenceProcessor()
    sentence = processor.get_entities(sentence)

    combine_request = f"Code instruction:{sentence}\n{df}"

    # Send to GPT
    azure_request = AzureOpenAIRequest()
    ans = azure_request.get_response(combine_request, "You are a data analysis programmer, don't include any explanations in your responses.")
    content = ans.choices[0].message.content
    return {"content": content}
   
if __name__ == "__main__":
    azure_request = AzureOpenAIRequest()
    ans = azure_request.get_response("give me an example of pandas import", "You are a data analysis programmer.")
    print(ans)
