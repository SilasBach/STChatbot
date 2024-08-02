import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// TypeScript interface for component props
interface RegisterProps {
  onRegistration: (userData: { token: string }) => void; // Function to handle post-registration actions
}

const Register: React.FC<RegisterProps> = ({ onRegistration }) => {
  // State hooks for user inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [bureauAffiliation, setBureau] = useState('');

  const navigate = useNavigate(); // Hook for programmatic navigation

  // Function to navigate to the login page
  const handleRegisterClick = () => {
    navigate('/login'); // Redirects user to the login page
  };

  // Function to handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevents default form submission behavior

    try {
      // Sending a POST request to the server for user registration
      const registerResponse = await fetch('http://127.0.0.1:8000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          bureauAffiliation,
          fullName,
        }),
      });

      // Check if registration was successful
      if (!registerResponse.ok) {
        console.error('Registration failed');
        return; // Stop further execution in case of failure
      }

      // Retrieving token after successful registration
      const tokenResponse = await fetch('http://127.0.0.1:8000/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
      });

      // Check if token retrieval was successful
      if (!tokenResponse.ok) {
        console.error('Token retrieval failed');
        return; // Stop further execution in case of failure
      }

      // Handling the token after successful retrieval
      const data = await tokenResponse.json();
      localStorage.setItem('token', data.access_token); // Store token in localStorage
      console.log('Registration and token retrieval successful');
      onRegistration({ token: data.access_token }); // Invoke onRegistration with the token
      navigate('/gpt'); // Navigate to the Gpt page
    } catch (error) {
      // Handle errors during the fetch process
      console.error('An error occurred:', error);
    }
  };
  return (
    <div>
      <div className="relative rounded-md border border-slate-600 bg-slate-800 bg-opacity-30 p-8 shadow-lg backdrop-blur-lg backdrop-filter">
        <h1 className="mb-6 text-center text-4xl font-bold">Register</h1>
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
          <div className="relative my-4">
            <input
              type="text"
              className="peer block w-72 appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-white focus:border-blue-600 focus:text-white focus:outline-none focus:ring-0 dark:focus:border-blue-500"
              placeholder="Jens Lars Larsen"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <label
              htmlFor=""
              className="top-3 -z-10 origin-[0] scale-75 transform text-sm duration-300 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
            >
              Full Name
            </label>
          </div>
          <div className="relative my-4">
            <input
              type="password"
              className="peer block w-72 appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-white focus:border-blue-600 focus:text-white focus:outline-none focus:ring-0 dark:focus:border-blue-500"
              placeholder="!!!Change to dropdown!!! (ex Tryk forsikring)"
              value={bureauAffiliation}
              onChange={(e) => setBureau(e.target.value)}
            />
            <label
              htmlFor=""
              className="top-3 -z-10 origin-[0] scale-75 transform text-sm duration-300 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
            >
              Selvskab
            </label>
          </div>
          <button
            type="submit"
            className="mb-4 mt-6 w-full rounded bg-blue-500 py-2 text-[18px] transition-colors duration-300 hover:bg-blue-600"
          >
            Register
          </button>
          <button
            type="button"
            className="mb-4 w-full rounded py-2 text-[18px] transition-colors duration-300 hover:text-blue-600"
            onClick={handleRegisterClick}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
