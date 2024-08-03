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
import UpdateUser from './UpdateUser'; // Importing UpdateUser component for updating user details
import Admin from './Admin';

// TypeScript interface to define the shape of user state
export interface UserState {
  token: string;
  userId: string;
  role: string;
}

function App() {
  // State to store user information, initially null
  const [user, setUser] = useState<UserState | null>(null);

  // Effect hook to check for token in localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
    const role = localStorage.getItem('role'); // Retrieve role from localStorage
    if (token && userId && role) {
      setUser({ token, userId, role }); // Update user state with token, userId and role
    }
  }, []);

  // Handler for successful login
  const handleLogin = (userData: UserState) => {
    localStorage.setItem('token', userData.token); // Store the token in localStorage
    localStorage.setItem('userId', userData.userId); // Store the userId in localStorage
    localStorage.setItem('role', userData.role); // Store the role in localStorage
    setUser(userData); // Update user state with login details
  };

  // Handler for successful registration
  const handleRegistration = (userData: UserState) => {
    localStorage.setItem('token', userData.token); // Store the token in localStorage
    localStorage.setItem('userId', userData.userId); // Store the userId in localStorage
    localStorage.setItem('role', userData.userId); // Store the role in localStorage
    setUser(userData); // Update user state with registration details
  };

  // Handler for logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    localStorage.removeItem('userId'); // Remove the userId from localStorage

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
      </div>
      <div
        className="flex h-[100vh] items-center justify-center bg-cover pt-16 text-white"
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
              !user ? <Login onLogin={handleLogin} /> : <Navigate to="/gpt" />
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
          <Route
            path="/update-user"
            element={
              user ? (
                <UpdateUser userId={user.userId} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/admin"
            element={
              user && user.role === 'admin' ? (
                <Admin />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
