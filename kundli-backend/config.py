# config.py
# Set this to 'api' for API-based kundli, or 'swisseph' for local calculation
# 0 = API, 1 = swisseph
KUNDLI_MODE_NUM = 0 # 0 for API, 1 for swisseph

# Do not edit below
KUNDLI_MODE = 'swisseph' if KUNDLI_MODE_NUM == 1 else 'api'

# If using API, set your API endpoint and key here
API_URL = 'https://json.freeastrologyapi.com/planets'
API_KEY = 'j0J5EihxQ39BbKOJxcI0M5WcJ0FxfgAZ1bf7lLw5'

# OpenAI API Key
import os
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")  # Load from environment variable
