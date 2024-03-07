from fastapi import FastAPI
from fastapi import File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import re
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
async def combined_process(sentence: str = Form(...), file: UploadFile = File(...)):
    
    # Mask the sentence
    processor = SentenceProcessor()
    entities = processor.get_entities(sentence)
    
    # Mask the file 
    contents = await file.read()
    with open(file.filename, 'wb') as f:
        f.write(contents)
    processor = DataFrameProcessor()
    df = processor.process(file.filename)
    os.remove(file.filename) 

    combine_request = "Code instruction:{}\n{}".format(entities, df)

    # Send to GPT
    azure_request = AzureOpenAIRequest()
    ans = azure_request.get_response(combine_request, "You are a data analysis programmer, don't include any explanations in your responses.")
    content = ans.choices[0].message.content
    #match = re.search('```.*?\n(.*?)```', content, re.DOTALL)
    #result = match.group(1).strip() if match else None
    return {"content": content, "masked": combine_request}
   
