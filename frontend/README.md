# README for InsurEase Frontend Application

## Overview

InsurEase is a cutting-edge chatbot application designed for insurance professionals. This README document outlines the structure and functionality of the frontend application, built with React, Vite, and Tailwind CSS. The application's frontend is based on royrao2333/template-vite-react-ts-tailwind, a template that integrates these technologies for efficient development.

## Prerequisites

Before running the application, ensure you have the following installed:

- Node.js
- npm (Node Package Manager)

## Installation

1. Clone the repository from GitHub or download the source code.
2. Navigate to the project directory in your terminal.
3. Run `npm install` to install all the required dependencies.

## Project Structure

Below is an overview of the key files in the project:

- `app.jsx`: The main application component. It sets up routing and global state management.
- `gpt.jsx`: A component responsible for interacting with the GPT-based chatbot. It handles user queries and displays responses.
- `login.jsx` & `register.tsx`: Components for handling user authentication, including login and registration forms.
- `nav.tsx`: Navigation component that displays different options based on user authentication status.

## Key Features

### User Authentication

- Users can register a new account or log in to an existing one.
- The application securely handles user credentials and authentication tokens.

### Chatbot Interaction

- Users can interact with the GPT-based chatbot by submitting questions.
- The application displays responses from the chatbot in a user-friendly format.

### Responsive Design

- The application is styled with Tailwind CSS, ensuring a responsive and modern user interface.

### Routing

- React Router is used for navigation between different components like Login, Register, and the GPT chat interface.

## Running the Application

To start the application:

1. Run `npm run dev` in the terminal from the project directory.
2. Open a web browser and navigate to `http://localhost:3000`.

## Environment Variables

Ensure to set up the necessary environment variables (if any) for backend API endpoints and other configurations in a `.env` file.

