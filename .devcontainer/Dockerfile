# Dockerfile
FROM ubuntu:20.04

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    libssl-dev \
    libffi-dev \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Python 3.11
RUN apt-get update && apt-get install -y \
    software-properties-common \
    && add-apt-repository ppa:deadsnakes/ppa \
    && apt-get update \
    && apt-get install -y python3.11 python3.11-venv python3.11-dev

# Set the working directory
WORKDIR /stchatbot

# Copy backend files
COPY ./backend /backend

# Create a virtual environment in the backend directory
RUN python3 -m venv /backend/venv

# Activate the virtual environment
ENV PATH="/backend/venv/bin:$PATH"

# Install poetry in the virtual environment
RUN curl -sSL https://install.python-poetry.org | python3 -

# Add poetry to PATH
ENV PATH="/root/.local/bin:$PATH"

# Install backend dependencies
RUN cd /backend \
    && poetry install

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs

# Copy frontend files
COPY ./frontend /frontend

# Install frontend dependencies
RUN cd /frontend \
    && npm install

# Expose port 3000
EXPOSE 3000