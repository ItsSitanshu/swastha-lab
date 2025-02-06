import os
import time
import google.generativeai as genai
from flask_cors import CORS
from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup 
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

def get_next_api_key():
  global api_index
  api_key = API_KEYS[api_index]
  api_index = (api_index + 1) % len(API_KEYS)
  return api_key

def get_next_api_key():
  global api_index
  api_key = API_KEYS[api_index]
  api_index = (api_index + 1) % len(API_KEYS)
  return api_key

pre_prompt = """
You are a professional medical assistant designed to help doctors with accurate and efficient diagnosis. Your primary goal is to 
ensure that the doctor has considered all necessary factors before finalizing a diagnosis. Before responding, follow these steps:

Cross-Check for Completeness:
- Review the patient's symptoms, medical history, lab reports, and any other available data.
- Identify any missing information that might be critical for diagnosis.
- Suggest additional tests or inquiries if necessary.
Reference Medical Guidelines:
- Compare the provided symptoms against established medical guidelines and differential diagnoses.
- Highlight any inconsistencies or overlooked conditions that match the symptoms.
Memory Recall & Cognitive Support:
- Remind the doctor of rare but possible conditions related to the symptoms.
- List similar past cases and their outcomes to help in decision-making.
Error Prevention & Second Opinion:
- Identify potential misdiagnoses based on similar symptoms with different underlying causes.
- Suggest alternative explanations and cross-checks to minimize errors.
- Clear, Concise, and Actionable Advice:

Provide a structured breakdown of possible diagnoses ranked by likelihood.
Offer relevant treatment options, precautions, and next steps.
Always prioritize patient safety, scientific accuracy, and real-time clinical best practices in your response. 
Formally only do your work, discourage any other behaviour unless its the wellbeing of the doctor

Further, you also have the assistance of a librarian. The librarian gives you small gists of her books, they could be 
used to help the doctor, if there is no content related to the question, you can ignore it.

[RAG]

Patient History:
[History]

Doctor's Question:
"""

@app.route("/api/nmc", methods=["GET"])
def nmc_search():
    nmc_number = request.args.get("nmc_no")
    
    if not nmc_number:
        return jsonify({
            "code": HTTP_BAD_REQUEST,
            "response": "Sorry Practitioner you searched for not found.",
        })
    
    base_url = "https://www.nmc.org.np/searchPractitioner?"
    query_params = {}

    if nmc_number:
        query_params["nmc_no"] = nmc_number

    query_params["name"] = ""
    query_params["degree"] = "" 

    try:
        response = requests.get(base_url, params=query_params)

        if 'text/html' in response.headers.get('Content-Type', ''):
            soup = BeautifulSoup(response.text, 'html.parser')
            
            table = soup.find('table')  
        
            if table:
                rows = table.find_all('tr')
                table_data = {}

                for row in rows:
                    columns = row.find_all('td')
                    if len(columns) == 2:  
                        key = columns[0].text.strip().replace(" :", "").replace(":", "")
                        value = columns[1].text.strip()
                        table_data[key] = value

                return jsonify({
                    "code": HTTP_OK,
                    "response": table_data,     
                })
            else:
                return jsonify({
                    "code": HTTP_INTERNAL_SERVER_ERROR,
                    "response": "No table found in the HTML response.",
                })
        
        if 'application/json' in response.headers.get('Content-Type', ''):
            data = response.json()
        else:
            data = {"error": "Received unexpected response format", "details": response.text}

        return jsonify({
            "code": HTTP_OK,
            "response": data,
        })
    except requests.exceptions.RequestException as e:
        print(f"Error during NMC API request: {e}")
        return jsonify({
            "code": HTTP_INTERNAL_SERVER_ERROR,
            "response": f"An error occurred while fetching data: {str(e)}",
        })

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

    full_prompt = f"{pre_prompt.replace('[HISTORY]', history)}\n"
    full_prompt = f"{pre_prompt.replace('[RAG]', retrieved_knowledge)}\n"
    full_prompt += f"Query:\n{user_input}\n\n"

    print(full_prompt)

    raw_response = model.generate_content(full_prompt)

    return jsonify({
        "code": HTTP_OK,
        "response": raw_response.text,
        "time": time.time() - start,
    })

if __name__ == "__main__":
  app.run(debug=True, port=5000)
