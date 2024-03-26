from dotenv import load_dotenv
from openai import AzureOpenAI
import re
import os

load_dotenv()
# Azure openAI request
# Parameters
class AzureOpenAIRequest:
    def __init__(self):
        self.client = AzureOpenAI(
            azure_endpoint = "https://hkust.azure-api.net",
            api_version = "2024-02-01",
            api_key = os.getenv('AZURE_OPENAI_API_KE') # Replace with your Azure OpenAI API key https://hkust.developer.azure-api.net
        )

    def get_response(self,file_name, docstring):
        '''
        file_name: the path of the file
        docstring: process of the function
        '''
        init_prompt = "You are a Python expert who can implement the given function."
        load_csv = "import pandas as pd\n df = pd.read_csv('{file_name}.csv')\n"
        definition = f"def "
        prompt = f"Read this incomplete Python code:\npython\n{load_csv}{definition}\n"
        prompt += "\n"
        prompt += f"Complete the Python code that follows this instruction: '{docstring}'. Your response must start with code block '```python'."

        response = self.client.chat.completions.create(
            model = 'gpt-35-turbo',
            temperature = 1,
            messages = [
                {"role": "system", "content": init_prompt},
                {"role": "user", "content": prompt}
            ]
        )
        return response
    
    # Extract the code block
    def extract_code_block(self, response):
        message_content = response.choices[0].message.content
        code_block = re.search('```python\n(.*?)```|```\n(.*?)```', message_content, re.DOTALL)
        print(message_content+'\n')
        if code_block:
            if code_block.group(1):
                return code_block.group(1)
            elif code_block.group(2):
                return code_block.group(2)
        else:
            return "No code block found in the response."
        