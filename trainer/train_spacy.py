import spacy
from spacy.training import Example
from spacy.util import minibatch, compounding
import random

def train_model(data_path, model_path, iterations=10):
    # Load the model
    nlp = spacy.load('en_core_web_lg')

    # Load the dataset
    with open(data_path, 'r') as file:
        TRAIN_DATA = [line.strip() for line in file]

    # Create Examples
    examples = [Example.from_dict(nlp.make_doc(text), {'entities': []}) for text in TRAIN_DATA]

    # Update the model
    for i in range(iterations):
        random.shuffle(examples)
        for batch in minibatch(examples, size=compounding(4.0, 32.0, 1.001)):
            nlp.update(batch)

    # Save the updated model
    nlp.to_disk(model_path)

data_path = 'path'  
model_path = 'path'  
train_model(data_path, model_path)



if __name__ == '__main__':
    def test_model(model_path, test_text):
        # Load the model
        nlp = spacy.load(model_path)

        # Test the model
        doc = nlp(test_text)
        print('Entities', [(ent.text, ent.label_) for ent in doc.ents])

    test_text = 'test text'  
    test_model(model_path, test_text)
