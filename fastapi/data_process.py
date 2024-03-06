import pandas as pd

import spacy


# get csv or excel file to the dataframe
def get_entities(file):
    if file.endswith('.csv'):
        df = pd.read_csv(file)
    elif file.endswith('.xlsx'):
        df = pd.read_excel(file)
    else:
        df = pd.DataFrame()
    return df

#show dataframe first 5 lines
def show_entities(df):
    return df.head(5)

nlp = spacy.load('en_core_web_sm')

def replace_entities(df):
    for column in df.columns:
        df[column] = df[column].apply(lambda x: [( ent.label_) for ent in nlp(str(x)).ents] if isinstance(x, str) else x)
    return df

# to json
def to_json(df):
    return df.to_json(orient='records')

def process(file):
    df = get_entities(file)
    df = show_entities(df)
    df = replace_entities(df)
    return df


if __name__ == "__main__":
    main('fastapi/test/biostats.csv')