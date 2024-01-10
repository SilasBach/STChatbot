from datetime import datetime
from typing import Optional

import jwt 
from db import ObjectId, UpdateUserModel, UserCollection, UserModel, user_collection
from fastapi import Body, Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from llm import qa_chain
from pydantic import BaseModel
from pymongo import ReturnDocument

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


# DB endpoints

# JWT secret and algorithm
SECRET_KEY = "a_very_secret_key"
ALGORITHM = "HS256"

# OAuth2 token URL
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def create_access_token(data: dict):
    to_encode = data.copy()
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# Login Endpoint
@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await user_collection.find_one({"email": form_data.username})
    if not user or user["password"] != form_data.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}


@app.post(
    "/users/",
    response_description="Add new user",
    response_model=UserModel,
    status_code=status.HTTP_201_CREATED,
    response_model_by_alias=False,
)
async def create_user(user: UserModel = Body(...)):
    """
    Insert a new user record.

    A unique `id` will be created and provided in the response.
    """
    # user.createdAt = datetime.utcnow()
    # user.updatedAt = datetime.utcnow()
    # user.lastLogin = datetime.utcnow()
    # user.accountStatus = "active"

    new_user = await user_collection.insert_one(
        user.model_dump(by_alias=True, exclude=["id"])
    )
    created_user = await user_collection.find_one({"_id": new_user.inserted_id})
    return created_user


@app.get("/users/", response_model=UserCollection, response_model_by_alias=False)
async def list_users():
    """
    List all of the user data in the database.

    The response is unpaginated and limited to 1000 results.
    """
    return UserCollection(users=await user_collection.find().to_list(1000))


@app.get(
    "/users/{id}",
    response_description="Get a single user",
    response_model=UserModel,
    response_model_by_alias=False,
)
async def show_user(id: str):
    """
    Get the record for a specific user, looked up by `id`.
    """
    if (user := await user_collection.find_one({"_id": ObjectId(id)})) is not None:
        return user

    raise HTTPException(status_code=404, detail=f"User {id} not found")


@app.put(
    "/users/{id}",
    response_description="Update a user",
    response_model=UserModel,
    response_model_by_alias=False,
)
async def update_user(id: str, user: UpdateUserModel = Body(...)):
    """
    Update individual fields of an existing user record.

    Only the provided fields will be updated.
    Any missing or `null` fields will be ignored.
    """
    user = {k: v for k, v in user.model_dump(by_alias=True).items() if v is not None}

    # Set the updatedAt field to the current datetime
    user["updatedAt"] = datetime.utcnow()

    if len(user) >= 1:
        update_result = await user_collection.find_one_and_update(
            {"_id": ObjectId(id)},
            {"$set": user},
            return_document=ReturnDocument.AFTER,
        )
        if update_result is not None:
            return update_result
        else:
            raise HTTPException(status_code=404, detail=f"User {id} not found")

    # The update is empty, but we should still return the matching document:
    if (existing_user := await user_collection.find_one({"_id": id})) is not None:
        return existing_user

    raise HTTPException(status_code=404, detail=f"User {id} not found")


@app.delete("/users/{id}", response_description="Delete a user")
async def delete_user(id: str):
    """
    Remove a single user record from the database.
    """
    delete_result = await user_collection.delete_one({"_id": ObjectId(id)})

    if delete_result.deleted_count == 1:
        return Response(status_code=status.HTTP_204_NO_CONTENT)

    raise HTTPException(status_code=404, detail=f"User {id} not found")
