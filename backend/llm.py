import os
import sys

# Importing necessary libraries and APIs
import pinecone  # Pinecone for vector database management
from langchain.chains import ConversationalRetrievalChain  # Langchain for conversational retrieval
from langchain.document_loaders import PyPDFLoader  # Loader for PDF documents
from langchain.embeddings import HuggingFaceEmbeddings  # HuggingFace for text embeddings
from langchain.llms import Replicate  # Replicate for language models
from langchain.text_splitter import CharacterTextSplitter  # Splitter for large text documents
from langchain.vectorstores import Pinecone  # Vector store using Pinecone

# Set API tokens for Replicate and Pinecone services
# Note: API tokens should be handled securely, not hardcoded in the script.
os.environ["REPLICATE_API_TOKEN"] = "r8_e4hqHAr09jciwyXFy2jIdnsmcIaEKBU4FV5pr"
pinecone.init(api_key="5477f64d-24e7-4fbc-95c4-a78b60095b35", environment="gcp-starter")

# List of PDF files to process
pdf_files = [
    "Retningslinjer.pdf",  # Add the path(s) of your PDF files here
]

# Loading and preprocessing the PDF documents
documents = []
for pdf_file in pdf_files:
    loader = PyPDFLoader(pdf_file)  # Load each PDF file
    documents += loader.load()  # Add the loaded documents to the list

# Splitting the documents into smaller chunks
# This is necessary for efficient processing and embedding
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=24)
texts = text_splitter.split_documents(documents)

# Using HuggingFace for converting text into numerical embeddings
embeddings = HuggingFaceEmbeddings()

# Setting up Pinecone as the vector database
# This is used for storing and retrieving document embeddings
index_name = "insurence-bot"
index = pinecone.Index(index_name)
vectordb = Pinecone.from_documents(texts, embeddings, index_name=index_name)

# Initializing the Replicate Llama2 Model
# This model is used for natural language understanding and generation
llm = Replicate(
    model="a16z-infra/llama13b-v2-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5",
    input={"temperature": 0.75, "max_length": 3000},
)

# Setting up a Conversational Retrieval Chain
# This chain combines the language model with the vector database for conversational AI applications
qa_chain = ConversationalRetrievalChain.from_llm(
    llm, vectordb.as_retriever(search_kwargs={"k": 2}), return_source_documents=True
)
