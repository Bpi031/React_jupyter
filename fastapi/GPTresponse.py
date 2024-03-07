from openai import AzureOpenAI

# Azure openAI request
# Parameters
client = AzureOpenAI(
  azure_endpoint = "https://hkust.azure-api.net",
  api_version = "2023-05-15",
  api_key = "f0f00b34e41f4bb4b68ad79231843c9e" #put your api key here
)


def get_response(message, instruction):
    response = client.chat.completions.create(
		model = 'gpt-35-turbo',
        temperature = 1,
        messages = [
            {"role": "system", "content": instruction},
            {"role": "user", "content": message}
        ]
    )
    return response
