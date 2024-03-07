from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from response import get_response
from data_process import process

app = FastAPI()

#Backend
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

@app.post("/sentence")
async def read_sentence(sentence: Sentence):
    ans = get_response("Write the code to " + sentence.sentence, "You are a data analysis programmer, don't include any explanations in your responses.")
    content = ans.choices[0].message.content
    return {"content": content}

@app.post("/dataframe")
async def process(file: str):
    df = process(file)
    return {"content": df}

if __name__ == "__main__":
    ans = get_response("give me an example of pandas import", "You are a data analysis programmer.")
    print(ans)
    