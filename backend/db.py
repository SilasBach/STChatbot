# mongodb_config.py
from datetime import datetime
from typing import List, Optional

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field
from pydantic.functional_validators import BeforeValidator
from typing_extensions import Annotated

MONGO_URL = "mongodb+srv://admin:admin@insurease.aclelf4.mongodb.net/"
client = AsyncIOMotorClient(MONGO_URL)
database = client["InsurEaseDB"]
user_collection = database["users"]


# Represents an ObjectId field in the database.
# It will be represented as a `str` on the model so that it can be serialized to JSON.
PyObjectId = Annotated[str, BeforeValidator(str)]


class UserModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    email: EmailStr = Field(...)
    password: str = Field(...)
    fullName: str = Field(...)
    role: str = Field(...)
    createdAt: datetime = Field(...)
    bureauAffiliation: Optional[str] = None
    updatedAt: Optional[datetime] = None
    lastLogin: Optional[datetime] = None
    accountStatus: Optional[str] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        json_schema_extra = {
            "example": {
                "email": "johndoe@example.com",
                "password": "strongpassword",
                "fullName": "John Doe",
                "role": "admin",
                "createdAt": "2022-01-01T00:00:00",
            }
        }


class UpdateUserModel(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    fullName: Optional[str] = None
    role: Optional[str] = None
    bureauAffiliation: Optional[str] = None
    updatedAt: Optional[datetime] = None
    lastLogin: Optional[datetime] = None
    accountStatus: Optional[str] = None

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        json_schema_extra = {
            "example": {
                "email": "johndoe@example.com",
                "password": "strongpassword",
                "fullName": "John Doe",
                "role": "admin",
                "createdAt": "2022-01-01T00:00:00",
            }
        }


class UserCollection(BaseModel):
    users: List[UserModel]
