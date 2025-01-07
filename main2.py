import streamlit as st
import os
import logging
from langchain.vectorstores import Chroma
from langchain_ollama import OllamaEmbeddings
from langchain_ollama import ChatOllama
from langchain.prompts import ChatPromptTemplate
from langchain.chains import RetrievalQA
from langchain.chains.question_answering import load_qa_chain
from langchain.document_loaders import PyPDFLoader
import ollama

logging.basicConfig(level=logging.INFO)

# Constants
MODEL_NAME = "llama3.2"
EMBEDDING_MODEL = "nomic-embed-text"
VECTOR_STORE_NAME = "simple-prompt-rag"
PERSIST_DIRECTORY = "./chroma_prompt_db"
PDF_PATH = "pdf24_merged.pdf"  # Path to the PDF file

# Streamlit Page
st.set_page_config(page_title="Medical Chatbot", page_icon="💊", layout="centered")

@st.cache_resource
def load_vector_db():
    """Load or create the vector database."""
    ollama.pull(EMBEDDING_MODEL)
    embedding = OllamaEmbeddings(model=EMBEDDING_MODEL)

    if os.path.exists(PERSIST_DIRECTORY):
        vector_db = Chroma(
            embedding_function=embedding,
            collection_name=VECTOR_STORE_NAME,
            persist_directory=PERSIST_DIRECTORY,
        )
        logging.info("Loaded existing vector database.")
    else:
        vector_db = Chroma(
            embedding_function=embedding,
            collection_name=VECTOR_STORE_NAME,
            persist_directory=PERSIST_DIRECTORY,
        )
        logging.info("New vector database created and persisted.")

        # Extract text from PDF and add to the vector database using PyPDFLoader
        loader = PyPDFLoader(PDF_PATH)
        documents = loader.load()
        vector_db.add_documents(documents)
        vector_db.persist()

    return vector_db


def create_chain(vector_db):
    """Create a RetrievalQA chain."""
    retriever = vector_db.as_retriever(search_kwargs={"k": 3})  # Limit retrieved documents

    prompt = ChatPromptTemplate.from_template(
        "Use the following context to answer concisely:\n{context}\nQuestion: {question}"
    )
    llm = ChatOllama(model=MODEL_NAME)
    qa_chain = load_qa_chain(llm, chain_type="stuff", prompt=prompt)

    return RetrievalQA(
        retriever=retriever,
        combine_documents_chain=qa_chain,
        return_source_documents=False,
    )


def main():
    st.title("💉 Medical Knowledge Chatbot")

    # Load vector database (cached)
    with st.spinner("Loading knowledge database..."):
        vector_db = load_vector_db()

    # Create RetrievalQA chain (not cached to avoid hashing issues)
    chain = create_chain(vector_db)

    # Input prompt from user
    user_prompt = st.text_input("Enter your prompt:", "")

    if user_prompt:
        with st.spinner("Processing your request..."):
            try:
                response = chain.invoke({"query": user_prompt})
                st.markdown(f"### Response:\n{response['result']}")
            except Exception as e:
                st.error(f"An error occurred: {str(e)}")


if __name__ == "__main__":
    main()