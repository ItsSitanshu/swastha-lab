import os
import time
import google.generativeai as genai
from flask_cors import CORS
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from utils import * 

load_dotenv()

model = genai.GenerativeModel('gemini-1.5-flash-8b')

app = Flask(__name__)
CORS(app)

API_KEYS = [
  os.getenv("API_KEY1"),
  os.getenv("API_KEY2"),
  os.getenv("API_KEY3"),
  os.getenv("API_KEY4"),
  os.getenv("API_KEY5"),
]

api_index = 0  

app = Flask(__name__)
CORS(app)

def get_next_api_key():
  global api_index
  api_key = API_KEYS[api_index]
  api_index = (api_index + 1) % len(API_KEYS)
  return api_key

pre_prompt = """
"""

@app.route("/api/rllm", methods=["POST"])
def rllm():
    global model
    user_input = request.json.get("query")
    history = request.json.get("history", "")

    start = time.time()

    if not user_input:
        return jsonify({
            "code": HTTP_BAD_REQUEST,
            "response": "No query provided",
            "time": time.time() - start,
        })

    api_key = get_next_api_key()
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash-8b')

    relevant_docs = retrieve_relevant_docs(user_input, top_k=3)

    print(relevant_docs[0][0])

    retrieved_knowledge = "\n".join(relevant_docs[0])

    full_prompt = f"{pre_prompt.replace('[Interactions]', history)}\n"
    full_prompt = f"{pre_prompt.replace('[Relevant Knowledge]', retrieved_knowledge)}\n"
    full_prompt += f"Query:\n{user_input}\n\n"

    print(full_prompt)

    raw_response = model.generate_content(full_prompt)

    return jsonify({
        "code": HTTP_OK,
        "response": raw_response.text,
        "time": time.time() - start,
    })

if __name__ == "__main__":
  app.run(debug=True)