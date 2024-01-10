import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Gpt from './gpt';
import Nav from './Nav';

export interface UserState {
  token: string;
}
function App() {
  const [user, setUser] = useState<UserState | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token });
    }
  }, []);

  const handleLogin = (userData: any) => {
    localStorage.setItem('token', userData.token); // Store the token in local storage
    setUser(userData);
  };

  const handleRegistration = (userData: { token: string }) => {
    localStorage.setItem('token', userData.token); // Store the token in local storage
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from local storage
    setUser(null);
  };

  return (
    <Router>
      <div
        className="flex w-full bg-cover text-white"
        style={{ backgroundImage: 'url(../src/assets/background1.png)' }}
      >
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
