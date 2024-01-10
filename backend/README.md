# README for FastAPI with Poetry - InsurEase

## Overview

This README provides detailed documentation for the FastAPI-based backend of the InsurEase application. The backend integrates MongoDB for data management and employs advanced language model chains for conversational AI capabilities. It's built using FastAPI and managed with Poetry.

## Project Structure

The application consists of three primary scripts:

- `db.py`: Handles MongoDB database configuration and user model definitions.
- `llm.py`: Manages the conversational AI aspect using language models and vector databases.
- `main.py`: The main FastAPI application script that contains all the API endpoints.

## Dependencies

- **FastAPI**: A modern, fast web framework for building APIs.
- **PyMongo and Motor**: Asynchronous MongoDB drivers.
- **Pydantic**: Data validation and settings management using Python type annotations.
- **Python-Jose**: JavaScript Object Signing and Encryption for JWTs.
- **Pinecone, Langchain**: For vector database management and conversational AI.
- **Replicate**: For leveraging AI models.

## Setup and Installation

1. **Install Poetry**: Poetry is used for dependency management. Ensure you have Poetry installed.
2. **Clone the Repository**: Clone the source code from the repository.
3. **Install Dependencies**: Run `poetry install` to install the necessary packages.

## Configuration

- **MongoDB**: Configure the MongoDB URL in `db.py`. Ensure MongoDB is running either locally or hosted.
- **Environment Variables**: Set the environment variables for API tokens used in `llm.py`.

## Running the Application

1. **Start the FastAPI server**: Use the command `uvicorn main:app --reload` to start the server.
2. **Accessing the API**: The API will be available at `http://127.0.0.1:8000`.

## API Endpoints

- `/ask` (POST): Processes questions using the chatbot.
- `/token` (POST): Handles user authentication and token generation.
- `/users/` (POST): Creates a new user.
- `/users/` (GET): Retrieves a list of all users.
- `/users/{id}` (GET): Fetches a specific user by ID.
- `/users/{id}` (PUT): Updates user information.
- `/users/{id}` (DELETE): Deletes a user.

## Security

- **JWT Authentication**: Secure endpoints using JWT tokens.
- **CORS Middleware**: Configured for safe cross-origin requests.

## Testing

- Test the endpoints using tools like Postman or Swagger UI.

## Database Models

- `UserModel`: Defines the user schema for MongoDB.
- `UpdateUserModel`: Schema for updating user details.
- `UserCollection`: A collection of user models.

## Language Model and AI

The application uses Replicate and Pinecone for advanced language processing and data retrieval.
