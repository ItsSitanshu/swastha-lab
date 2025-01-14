import streamlit as st
import os
import logging
from langchain.vectorstores import Chroma
from langchain_ollama import OllamaEmbeddings
from langchain_ollama import ChatOllama
from langchain.prompts import ChatPromptTemplate
from langchain.chains import RetrievalQA
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts.chat import ChatPromptTemplate
import ollama
import time
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import CharacterTextSplitter


logging.basicConfig(level=logging.INFO)

# Constants
MODEL_NAME = "llama3.2"
EMBEDDING_MODEL = "nomic-embed-text"
VECTOR_STORE_NAME = "simple-prompt-rag"
PERSIST_DIRECTORY = "./chroma_prompt_db"
PDF_PATH = "meidtations.pdf"

# Streamlit Page-
st.set_page_config(page_title="Medical Chatbot", page_icon="💊", layout="centered")

# style after rajit-
st.markdown(
    """
    <style>
    .main { background-color: #F3F4F6; padding-top: 20px; }
    .title { text-align: center; font-size: 30px !important; color: #3B82F6; font-weight: bold; }
    .response-box { background-color: #FFFFFF; padding: 15px; border-radius: 10px; border: 1px solid #3B82F6; margin-top: 15px; }
    </style>
    """,
    unsafe_allow_html=True,
)

@st.cache_resource
def load_vector_db():
    """Load or create the vector database."""
    ollama.pull(EMBEDDING_MODEL)
    embedding = OllamaEmbeddings(model=EMBEDDING_MODEL)
    if os.path.exists(PERSIST_DIRECTORY):
        vector_db = Chroma(persist_directory=PERSIST_DIRECTORY, embedding_function=embedding)
        logging.info("Loaded existing vector database.")
    else:
        vector_db = Chroma(
            embedding_function=embedding,
            collection_name=VECTOR_STORE_NAME,
            persist_directory=PERSIST_DIRECTORY,
        )
        logging.info("New vector database created and persisted.")

        loader = PyPDFLoader(PDF_PATH)
        documents = loader.load()

        text_splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=100)  # Smaller chunk size
        split_documents = text_splitter.split_documents(documents)

        for doc in split_documents:
            print(doc.page_content)
        
        vector_db.add_documents(split_documents)

        vector_db.persist()

        logging.info("Cancer knowledge added to vector database.")

    return vector_db


def create_chain(vector_db, llm):
    """Create a RetrievalQA chain."""
    retriever = vector_db.as_retriever(search_kwargs={"k": 5})

    # Define a prompt template
    template = """Answer the following question using the provided context:
    {context}
    Question: {question}"""
    prompt = ChatPromptTemplate.from_template(template)

    # Load a question-answering chain
    qa_chain = load_qa_chain(llm, chain_type="stuff", prompt=prompt)

    # Create RetrievalQA with the loaded QA chain
    chain = RetrievalQA(
        retriever=retriever,
        combine_documents_chain=qa_chain,
        return_source_documents=True,
    )

    return chain
def main():
    st.markdown('<p class="title">💉 Medical Knowledge Chatbot</p>', unsafe_allow_html=True)

    user_prompt = st.text_input("Enter your prompt below:", "")

    if user_prompt:
        with st.spinner("Processing your prompt..."):
            try:
                llm = ChatOllama(model=MODEL_NAME)
                vector_db = load_vector_db()

                if vector_db is None:
                    st.error("Failed to load or create the vector database.")
                    return

                chain = create_chain(vector_db, llm)
                
                start_time = time.time()

                response = chain.invoke({"query": user_prompt})

                end_time = time.time()

                response_time = end_time - start_time

                st.markdown('<div class="response-box">', unsafe_allow_html=True)
                st.markdown(f"**Response:** {response['result']} response time:** {response_time}")
                st.markdown('</div>', unsafe_allow_html=True)
            except Exception as e:
                st.error(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    main()