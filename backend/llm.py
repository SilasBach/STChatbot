import os
import sys

import pinecone
from langchain.chains import ConversationalRetrievalChain
from langchain.document_loaders import PyPDFLoader
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.llms import Replicate
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import Pinecone

# Replicate API token and Pinecone API key
os.environ["REPLICATE_API_TOKEN"] = "r8_e4hqHAr09jciwyXFy2jIdnsmcIaEKBU4FV5pr"
pinecone.init(api_key="5477f64d-24e7-4fbc-95c4-a78b60095b35", environment="gcp-starter")

# Specify your PDF files
pdf_files = [
    "top_danmark_bil.pdf",
]  # Add your PDF file paths here

# Load and preprocess the PDF documents
documents = []
for pdf_file in pdf_files:
    loader = PyPDFLoader(pdf_file)
    documents += loader.load()

# Split the documents into smaller chunks for processing
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=24)
texts = text_splitter.split_documents(documents)

# Use HuggingFace embeddings for transforming text into numerical vectors
embeddings = HuggingFaceEmbeddings()

# Set up the Pinecone vector database
index_name = "insurence-bot"
index = pinecone.Index(index_name)
vectordb = Pinecone.from_documents(texts, embeddings, index_name=index_name)

# Initialize Replicate Llama2 Model
llm = Replicate(
    model="a16z-infra/llama13b-v2-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5",
    input={"temperature": 0.75, "max_length": 3000},
)

# Set up the Conversational Retrieval Chain
qa_chain = ConversationalRetrievalChain.from_llm(
    llm, vectordb.as_retriever(search_kwargs={"k": 2}), return_source_documents=True
)
