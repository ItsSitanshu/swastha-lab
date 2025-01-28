from langchain.prompts import PromptTemplate
from langchain_community.llms import LlamaCpp
from langchain.chains import RetrievalQA  # Correct import for RetrievalQA
from langchain_huggingface import HuggingFaceEmbeddings
from fastapi import FastAPI, Request, Form, Response
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from qdrant_client import QdrantClient
from langchain_community.vectorstores import Qdrant

import json
import time


app = FastAPI()

templates = Jinja2Templates(directory="/home/codexrajit/Desktop/RAG/Medical-RAG-using-Bio-Mistral-7B/templates")
app.mount("/static", StaticFiles(directory="/home/codexrajit/Desktop/RAG/Medical-RAG-using-Bio-Mistral-7B/static"), name="static")

local_llm = "/home/codexrajit/Desktop/RAG/BioMistral-7B.Q4_K_M.gguf"
llm = LlamaCpp(
    model_path=local_llm,
    temperature=0.3,
    max_tokens=2048,
    top_p=1
)
print("LLM Initialized...")


prompt_template = """Use the following pieces of information to answer the user's question.
If you don't know the answer, just say that you don't know, don't try to make up an answer.

Context: {context}
Question: {question}

Only return the helpful answer. Answer must be detailed and well explained.
Helpful answer:
"""
prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])

embeddings = HuggingFaceEmbeddings(model_name="NeuML/pubmedbert-base-embeddings")

url = "http://localhost:6333"
client = QdrantClient(url=url, prefer_grpc=False)

db = Qdrant(client=client, embeddings=embeddings, collection_name="vector_db")
retriever = db.as_retriever(search_kwargs={"k": 1})

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    """Render the main HTML template."""
    return templates.TemplateResponse("index.html", {"request": request})
@app.post("/get_response")
async def get_response(query: str = Form(...)):
    """
    Handle user queries and return responses from the QA chain.
    """
    try:
        chain_type_kwargs = {"prompt": prompt}
        start = time.time()
        
        qa = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=retriever,
            return_source_documents=True,
            chain_type_kwargs=chain_type_kwargs,
            verbose=True
        )

        response = qa(query)
        
        answer = response.get("result", "No answer found.")
        source_documents = response.get("source_documents", [])
        
        # Add timing info to answer
        processing_time = time.time() - start
        answer += f" [Processed in {processing_time:.2f} seconds]"

        if source_documents:
            source_document = source_documents[0].page_content
            doc = source_documents[0].metadata.get("source", "Unknown source")
        else:
            source_document = "No source document available."
            doc = "No source."

        # Return structured response
        response_data = {"answer": answer, "source_document": source_document, "doc": doc}
        return Response(content=json.dumps(response_data), media_type="application/json")
    
    except Exception as e:
        error_response = {"error": str(e)}
        return Response(content=json.dumps(error_response), media_type="application/json")
