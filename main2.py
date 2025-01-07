import streamlit as st
import os
import logging
import time  # Import the time module
from langchain_community.vectorstores import Chroma
from langchain_ollama import OllamaEmbeddings, ChatOllama
from langchain.prompts import ChatPromptTemplate
from langchain.chains import RetrievalQA
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import CharacterTextSplitter
import ollama

logging.basicConfig(level=logging.INFO)

# Constants
MODEL_NAME = "llama3.2"
EMBEDDING_MODEL = "nomic-embed-text"
VECTOR_STORE_NAME = "simple-prompt-rag"
PERSIST_DIRECTORY = "./chroma_prompt_db"
PDF_PATH = "meidtations.pdf"

# Streamlit Page
st.set_page_config(page_title="Medical Chatbot", page_icon="💊", layout="centered")

@st.cache_resource
def load_vector_db():
    """Load or create the vector database."""
    ollama.pull(EMBEDDING_MODEL)
    embedding = OllamaEmbeddings(model=EMBEDDING_MODEL)

    # Check if vector store exists and is already cached
    if os.path.exists(PERSIST_DIRECTORY):
        vector_db = Chroma(
            embedding_function=embedding,
            collection_name=VECTOR_STORE_NAME,
            persist_directory=PERSIST_DIRECTORY,
        )
        logging.info("Loaded existing vector database.")
        print("LOADED EXISTING?")
    else:
        vector_db = Chroma(
            embedding_function=embedding,
            collection_name=VECTOR_STORE_NAME,
            persist_directory=PERSIST_DIRECTORY,
        )
        logging.info("New vector database created and persisted.")

        # Load and process PDF once
        loader = PyPDFLoader(PDF_PATH)
        documents = loader.load()

        text_splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=100)  # Smaller chunk size
        split_documents = text_splitter.split_documents(documents)

        vector_db.add_documents(split_documents)
        vector_db.persist()
        print("not LOADED EXISTING?")

    return vector_db

def create_chain(vector_db, llm):
    """Create a RetrievalQA chain."""
    retriever = vector_db.as_retriever(search_kwargs={"k": 3})  # Limit retrieved documents

    # Define a prompt template
    template = """Answer the following question using the provided context:
    {context}
    Question: {question}"""
    prompt = ChatPromptTemplate.from_template(template)

    # Create a question-answering chain
    qa_chain = RetrievalQA(
        retriever=retriever,
        llm=llm,
        return_source_documents=True,
        combine_documents_chain=None,  # Default chain to combine documents
        prompt=prompt,
        chain_type="stuff",  # Directly use the chain type
    )

    return qa_chain

def main():
    st.markdown('<p class="title">💉 Medical Knowledge Chatbot</p>', unsafe_allow_html=True)

    user_prompt = st.text_input("Enter your prompt below:", "")

    if user_prompt:
        with st.spinner("Processing your prompt..."):
            try:
                # Initialize the language model
                llm = ChatOllama(model=MODEL_NAME)

                # Load vector database
                vector_db = load_vector_db()

                if vector_db is None:
                    st.error("Failed to load or create the vector database.")
                    return

                # Create the RetrievalQA chain
                chain = create_chain(vector_db, llm)

                # Record the start time
                start_time = time.time()

                # Invoke the chain with the user query
                response = chain.invoke({"query": user_prompt})

                # Record the end time
                end_time = time.time()

                # Calculate the time taken to process the response
                response_time = end_time - start_time

                # Display the response
                st.markdown('<div class="response-box">', unsafe_allow_html=True)
                st.markdown(f"**Response:** {response['result']}")
                st.markdown(f"**Time taken:** {response_time:.2f} seconds")
                st.markdown('</div>', unsafe_allow_html=True)
                
            except Exception as e:
                st.error(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    main()
