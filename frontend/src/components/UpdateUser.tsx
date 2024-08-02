import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UpdateUserProps {
  userId: string;
}

interface UserData {
  email: string;
  fullName: string;
  bureauAffiliation: string;
  role: string;
  accountStatus: string;
}

const UpdateUser: React.FC<UpdateUserProps> = ({ userId }) => {
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [bureauAffiliation, setBureauAffiliation] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/users/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setFullName(data.fullName || '');
        setBureauAffiliation(data.bureauAffiliation || '');
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('An error occurred while fetching user data:', error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: fullName || undefined,
          password: password || undefined,
          bureauAffiliation: bureauAffiliation || undefined,
        }),
      });

      if (response.ok) {
        console.log('User updated successfully');
        navigate('/gpt');
      } else {
        console.error('Update failed');
      }
    } catch (error) {
      console.error('An error occurred during update:', error);
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="relative rounded-md border border-slate-600 bg-slate-800 bg-opacity-30 p-8 shadow-lg backdrop-blur-lg backdrop-filter">
        <h1 className="mb-6 text-center text-4xl font-bold">Update User</h1>
        <form onSubmit={handleSubmit}>
          <div className="relative my-4">
            <input
              type="text"
              className="peer block w-72 appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-white focus:border-blue-600 focus:text-white focus:outline-none focus:ring-0 dark:focus:border-blue-500"
              placeholder="Full Name"
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
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label
              htmlFor=""
              className="top-3 -z-10 origin-[0] scale-75 transform text-sm duration-300 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
            >
              New Password (leave blank to keep current)
            </label>
          </div>
          <div className="relative my-4">
            <input
              type="text"
              className="peer block w-72 appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-white focus:border-blue-600 focus:text-white focus:outline-none focus:ring-0 dark:focus:border-blue-500"
              placeholder="Bureau Affiliation"
              value={bureauAffiliation}
              onChange={(e) => setBureauAffiliation(e.target.value)}
            />
            <label
              htmlFor=""
              className="top-3 -z-10 origin-[0] scale-75 transform text-sm duration-300 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
            >
              Bureau Affiliation
            </label>
          </div>
          <button
            type="submit"
            className="mb-4 mt-6 w-full rounded bg-blue-500 py-2 text-[18px] transition-colors duration-300 hover:bg-blue-600"
          >
            Update
          </button>
        </form>
        <div className="mt-8">
          <h2 className="mb-2 text-xl font-bold">Current User Data:</h2>
          <p>Email: {userData.email}</p>
          <p>Full Name: {userData.fullName}</p>
          <p>Bureau Affiliation: {userData.bureauAffiliation}</p>
          <p>Account Status: {userData.accountStatus}</p>
        </div>
      </div>
    </div>
  );
};
export default UpdateUser;
