import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router, // Importing Router components from 'react-router-dom' for navigation
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Login from './Login'; // Importing Login component
import Register from './Register'; // Importing Register component
import Gpt from './gpt'; // Importing Gpt component for chatbot interface
import Nav from './Nav'; // Importing Nav component for navigation bar

// TypeScript interface to define the shape of user state
export interface UserState {
  token: string;
}

function App() {
  // State to store user information, initially null
  const [user, setUser] = useState<UserState | null>(null);

  // Effect hook to check for token in localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (token) {
      setUser({ token }); // If token exists, update the user state
    }
  }, []);

  // Handler for successful login
  const handleLogin = (userData: any) => {
    localStorage.setItem('token', userData.token); // Store the token in localStorage
    setUser(userData); // Update user state with login details
  };

  // Handler for successful registration
  const handleRegistration = (userData: { token: string }) => {
    localStorage.setItem('token', userData.token); // Store the token in localStorage
    setUser(userData); // Update user state with registration details
  };

  // Handler for logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    setUser(null); // Reset user state to null
  };

  return (
    // Setting up router for navigating between different routes
    <Router>
      <div
        className="flex w-full bg-cover text-white"
        style={{ backgroundImage: 'url(../src/assets/background1.png)' }}
      >
        {/* Navigation bar component */}
        <Nav user={user} logout={handleLogout} />
        {/* Rest of the content */}
      </div>
      <div
        className="flex h-[100vh] items-center justify-center bg-cover text-white"
        style={{
          backgroundImage: 'url(../src/assets/background3.png)',
          backgroundPosition: 'center',
        }}
      >
        {/* Routes to handle navigation and redirection based on user state */}
        <Routes>
          <Route
            path="/login"
            element={
              !user ? (
                <Login onLogin={handleLogin} login={handleLogin} />
              ) : (
                <Navigate to="/gpt" />
              )
            }
          />
          <Route
            path="/register"
            element={
              !user ? (
                <Register onRegistration={handleRegistration} />
              ) : (
                <Navigate to="/gpt" />
              )
            }
          />
          <Route
            path="/gpt"
            element={user ? <Gpt /> : <Navigate to="/login" />}
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
