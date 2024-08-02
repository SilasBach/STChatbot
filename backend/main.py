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

# Initialize FastAPI application
app = FastAPI()

# CORS configuration for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model for query requests
class Query(BaseModel):
    question: str
    chat_history: Optional[list] = []

# Endpoint for processing questions using the chatbot
@app.post("/ask")
async def ask(query: Query):
    try:
        # Process the question with the Conversational Retrieval Chain
        result = qa_chain(
            {"question": query.question, "chat_history": query.chat_history}
        )
        # Return the answer
        return {"answer": result["answer"]}
    except Exception as e:
        # Handle exceptions
        raise HTTPException(status_code=500, detail=str(e))

# Database related configurations and endpoints

# JWT configuration for authentication
SECRET_KEY = "a_very_secret_key"
ALGORITHM = "HS256"

# OAuth2 token URL and scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Function to create JWT tokens
def create_access_token(data: dict):
    to_encode = data.copy()
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Login endpoint
@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Authenticate user
    user = await user_collection.find_one({"email": form_data.username})
    if not user or user["password"] != form_data.password:
        # Handle authentication failure
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # Generate access token
    access_token = create_access_token(data={"sub": user["email"]})
    
    # Return token, token type, and user ID
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user_id": str(user["_id"])  # Convert ObjectId to string
    }

# Endpoint to create a new user
@app.post(
    "/users/",
    response_description="Add new user",
    response_model=UserModel,
    status_code=status.HTTP_201_CREATED,
    response_model_by_alias=False,
)
async def create_user(user: UserModel = Body(...)):
    # Insert a new user into the database
    new_user = await user_collection.insert_one(
        user.model_dump(by_alias=True, exclude=["id"])
    )
    created_user = await user_collection.find_one({"_id": new_user.inserted_id})
    return created_user

# Endpoint to list all users
@app.get("/users/", response_model=UserCollection, response_model_by_alias=False)
async def list_users():
    # Retrieve all users from the database
    return UserCollection(users=await user_collection.find().to_list(1000))

# Endpoint to retrieve a single user by ID
@app.get(
    "/users/{id}",
    response_description="Get a single user",
    response_model=UserModel,
    response_model_by_alias=False,
)
async def show_user(id: str):
    # Fetch and return a specific user
    if (user := await user_collection.find_one({"_id": ObjectId(id)})) is not None:
        return user
    # Handle user not found
    raise HTTPException(status_code=404, detail=f"User {id} not found")

# Endpoint to update a user
@app.put(
    "/users/{id}",
    response_description="Update a user",
    response_model=UserModel,
    response_model_by_alias=False,
)
async def update_user(id: str, user: UpdateUserModel = Body(...)):
    # Update user fields
    user = {k: v for k, v in user.model_dump(by_alias=True).items() if v is not None}
    user["updatedAt"] = datetime.utcnow()

    # Perform the update in the database
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

    # If no fields are updated
    if (existing_user := await user_collection.find_one({"_id": id})) is not None:
        return existing_user

    raise HTTPException(status_code=404, detail=f"User {id} not found")

# Endpoint to delete a user
@app.delete("/users/{id}", response_description="Delete a user")
async def delete_user(id: str):
    # Delete a user from the database
    delete_result = await user_collection.delete_one({"_id": ObjectId(id)})

    if delete_result.deleted_count == 1:
        return Response(status_code=status.HTTP_204_NO_CONTENT)

    raise HTTPException(status_code=404, detail=f"User {id} not found")
