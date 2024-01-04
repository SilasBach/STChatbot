from typing import Optional

from db import UserCollection, user_collection
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from llm import qa_chain
from pydantic import BaseModel

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


@app.get("/users/", response_model=UserCollection, response_model_by_alias=False)
async def list_users():
    """
    List all of the student data in the database.

    The response is unpaginated and limited to 1000 results.
    """
    return UserCollection(users=await user_collection.find().to_list(1000))
