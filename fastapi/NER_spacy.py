import pandas as pd
import spacy

class DevicePipeline:
    def __init__(self):
        # Use spacy.prefer_gpu() to use GPU if available
        if spacy.prefer_gpu(1):
            print("Using GPU!")
        else:
            print("Using CPU :(")
        self.nlp = spacy.load("en_core_web_lg")

#dataframe processing
class DataFrameProcessor:
    '''
    Process the dataframe to extract entities
    '''
    def __init__(self, nlp):
        self.nlp = nlp

    def get_entities(self, file):
        if file.endswith('.csv'):
            df = pd.read_csv(file)
        elif file.endswith('.xlsx'):
            df = pd.read_excel(file)
        else:
            df = pd.DataFrame()
        return df

    def show_entities(self, df):
        return df.head(5)

    def replace_entities(self, df):
        for column in df.columns:
            df[column] = [[ent.label_ for ent in doc.ents] for doc in self.nlp.pipe(df[column].astype(str), batch_size=5000)]
        return df

    def to_json(self, df):
        return df.to_json(orient='records')

    def process(self, file):
        df = self.get_entities(file)
        df = self.show_entities(df)
        df = self.replace_entities(df)
        df = self.to_json(df)
        return df
    
# sentence processing
class SentenceProcessor:
    '''
    Process the sentence to extract entities
    '''
    def __init__(self, nlp):
            self.nlp = nlp

    def get_entities(self, sentence):
        doc = self.nlp(sentence)
        for ent in doc.ents:
            sentence = sentence.replace(ent.text, ent.label_)
        return sentence


if __name__ == "__main__":

    import torch
    import time

    nlp = None

    def load_model(device):
        global nlp
        if device.type == "cuda":
            spacy.require_gpu(device.index)
        else:
            spacy.require_cpu()
        nlp = spacy.load("en_core_web_lg") 

    def speed_test(device, data):
        global nlp
        start_time = time.time()
        if nlp is None:
            load_model(device)
        processor = DataFrameProcessor(nlp)
        processor.process(data)
        print(f"Speed test time on {device}: ", time.time() - start_time)

    data = 'fastapi/test/biostats.csv'

    if torch.cuda.is_available() and torch.cuda.device_count() > 1:
        # Speed test on GPU 0
        speed_test(torch.device("cuda:0"), data)

        # Speed test on GPU 1
        speed_test(torch.device("cuda:1"), data)

    # Speed test on CPU
    speed_test(torch.device("cpu"), data)    