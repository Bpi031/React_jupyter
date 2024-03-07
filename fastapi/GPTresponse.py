from openai import AzureOpenAI
import re

# Azure openAI request
# Parameters
class AzureOpenAIRequest:
    def __init__(self):
        self.client = AzureOpenAI(
            azure_endpoint = "https://hkust.azure-api.net",
            api_version = "2023-05-15",
            api_key = "f0f00b34e41f4bb4b68ad79231843c9e" 
        )

    def get_response(self, message, instruction):
        response = self.client.chat.completions.create(
            model = 'gpt-35-turbo',
            temperature = 1,
            messages = [
                {"role": "system", "content": instruction},
                {"role": "user", "content": message}
            ]
        )
        return response
    
    # Extract the code block
    def extract_code_block(response):
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
        
if __name__ == "__main__":
    # Test
    request = AzureOpenAIRequest()
    response = request.get_response("Write some python code", "You are a helpful assistant. [no prose] Assistant will output only and only code as a response.")

    # Extract the code block
    code_block = AzureOpenAIRequest.extract_code_block(response)