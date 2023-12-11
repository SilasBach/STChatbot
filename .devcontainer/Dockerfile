# Start from the official Python image
FROM python:3.9-slim

# Install Node.js
RUN apt-get update && apt-get install -y curl gnupg \
    && curl -sL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get install -y git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry for Python dependency management
RUN curl -sSL https://install.python-poetry.org | python3 -

# Add Poetry to the PATH
ENV PATH="/root/.local/bin:$PATH"

# # Set up the frontend environment
WORKDIR /workspace/frontend
COPY frontend/package*.json ./
RUN npm install

# Set up the backend environment
WORKDIR /workspace/backend
COPY backend/pyproject.toml backend/poetry.lock* ./
RUN poetry config virtualenvs.create false && poetry install

# Copy the rest of your application code
COPY . /workspace

# Set the default working directory back to /workspace
WORKDIR /workspace
