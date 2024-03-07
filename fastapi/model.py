from transformers import  pipeline

# Machine leaning model
# Initialize the NER pipeline
ner = pipeline('ner', grouped_entities=True)
#test sentence
sentence = 'Scott is using his iPhone in the office. The office is in Glasgow.'

def get_entities(sentence):
    ner_results = ner(sentence)
    for i in ner_results:
        sentence = sentence.replace(i['word'], i['entity_group'])
    return sentence


#test
if __name__ == "__main__":
    print(get_entities(sentence))