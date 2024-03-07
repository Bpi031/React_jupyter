from fastapi import FastAPI
from fastapi import File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

from GPTresponse import get_response
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

#get input in <CustomInput> and return the result in <CustomOutput>
class Sentence(BaseModel):
    sentence: str

@app.post("/GPTresponsse")
async def read_sentence(sentence: Sentence):
    ans = get_response("Write the code to " + sentence.sentence, "You are a data analysis programmer, don't include any explanations in your responses.")
    content = ans.choices[0].message.content
    return {"content": content}

#upload file and mask by NER then return the dataframe
@app.post("/dataframe")
async def process_data(file: UploadFile = File(...)):
    contents = await file.read()
    with open(file.filename, 'wb') as f:
        f.write(contents)
    processor = DataFrameProcessor()
    df = processor.process(file.filename)
    os.remove(file.filename)  # remove the file after processing
    return {"content": df}

#mask by NER and return the sentence
@app.post("/sentence")
async def process_sentence(sentence: Sentence):
    processor = SentenceProcessor()
    sentence = processor.get_entities(sentence.sentence)
    return {"content": sentence}

if __name__ == "__main__":
    ans = get_response("give me an example of pandas import", "You are a data analysis programmer.")
    print(ans)
    