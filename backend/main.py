import os
from typing import Optional, Union

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from llm import qa_chain

# FastAPI app
app = FastAPI()

origins = [
    "http://127.0.0.1:3000",  # React app's address
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model for request body
class Query(BaseModel):
    question: str
    chat_history: Optional[list] = []


# Define the endpoint
@app.post("/ask")
async def ask(query: Query):
    try:
        # Process the question with Conversational Retrieval Chain
        # Ensure that the question and chat history are passed correctly
        result = qa_chain(
            {"question": query.question, "chat_history": query.chat_history}
        )
        # Return the response
        return {"answer": result["answer"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
