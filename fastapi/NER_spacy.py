import pandas as pd
import spacy

class DevicePipeline:
    def __init__(self):
        # Use spacy.prefer_gpu() to use GPU if available
        if spacy.prefer_gpu():
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
    process = DataFrameProcessor()
    print(process.process('React_jupyter/fastapi/test/biostats.csv'))
    sentence = SentenceProcessor()
    print(sentence.get_entities('Scott is using his iPhone in the office. The office is in Glasgow.'))