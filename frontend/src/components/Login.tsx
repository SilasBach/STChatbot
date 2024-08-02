import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// TypeScript interface for the component's props
interface LoginProps {
  onLogin: (userData: { token: string; userId: string }) => void;
}

// Login component definition
const Login: React.FC<LoginProps> = ({ onLogin }) => {
  // State hooks for email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Function to handle navigation to the registration page
  const handleRegisterClick = () => {
    navigate('/register'); // Redirects user to the register page
  };

  // Function to handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevents the default form submission behavior

    try {
      // Sending a POST request to the server for authentication
      const response = await fetch('http://127.0.0.1:8000/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: email, // Sending email as username
          password: password, // Sending password
        }),
      });

      // Handling the server's response
      if (response.ok) {
        // If authentication is successful
        const data = await response.json();
        localStorage.setItem('token', data.access_token); // Store token in localStorage
        console.log('Login successful');
        onLogin({ token: data.access_token, userId: data.user_id }); // Invoke the onLogin prop function
        navigate('/gpt'); // Navigate to the Gpt page
      } else {
        // If authentication fails
        console.error('Login failed');
      }
    } catch (error) {
      // Handling any errors during the fetch request
      console.error('An error occurred during login:', error);
    }
  };

  return (
    <div>
      <div className="relative rounded-md border border-slate-600 bg-slate-800 bg-opacity-30 p-8 shadow-lg backdrop-blur-lg backdrop-filter">
        <h1 className="mb-6 text-center text-4xl font-bold">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="relative my-4">
            <input
              type="text"
              className="peer block w-72 appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-white focus:border-blue-600 focus:text-white focus:outline-none focus:ring-0 dark:focus:border-blue-500"
              placeholder="mail@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label
              htmlFor=""
              className="top-3 -z-10 origin-[0] scale-75 transform text-sm duration-300 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
            >
              E-Mail
            </label>
          </div>
          <div className="relative my-4">
            <input
              type="password"
              className="peer block w-72 appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-white focus:border-blue-600 focus:text-white focus:outline-none focus:ring-0 dark:focus:border-blue-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label
              htmlFor=""
              className="top-3 -z-10 origin-[0] scale-75 transform text-sm duration-300 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
            >
              Your Password
            </label>
          </div>
          <button
            type="submit"
            className="mb-4 mt-6 w-full rounded bg-blue-500 py-2 text-[18px] transition-colors duration-300 hover:bg-blue-600"
          >
            Login
          </button>
          <button
            type="button"
            className="mb-4 w-full rounded py-2 text-[18px] transition-colors duration-300 hover:text-blue-600"
            onClick={handleRegisterClick}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
