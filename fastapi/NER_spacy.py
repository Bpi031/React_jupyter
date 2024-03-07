import pandas as pd
import spacy

#dataframe processing
class DataFrameProcessor:
    def __init__(self):
        self.nlp = spacy.load('en_core_web_lg')

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
            df[column] = df[column].apply(lambda x: [( ent.label_) for ent in self.nlp(str(x)).ents] if isinstance(x, str) else x)
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
    def __init__(self):
        self.nlp = spacy.load('en_core_web_lg')

    def get_entities(self, sentence):
        doc = self.nlp(sentence)
        for ent in doc.ents:
            sentence = sentence.replace(ent.text, ent.label_)
        return sentence


if __name__ == "__main__":
    process = DataFrameProcessor()
    print(process.process('fastapi/test/biostats.csv'))
    sentence = SentenceProcessor()
    print(sentence.get_entities('Scott is using his iPhone in the office. The office is in Glasgow.'))