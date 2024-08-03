import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  fullName: string;
  bureauAffiliation: string;
  role: string;
  accountStatus: string;
}

interface UserCollection {
  users: User[];
}

const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/users/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data: UserCollection = await response.json();
        if (Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          setError('Received invalid data format from server');
        }
      } else {
        setError('Failed to fetch users');
        if (response.status === 401) {
          navigate('/login');
        }
      }
    } catch (error) {
      setError('An error occurred while fetching users');
      console.error('An error occurred while fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="container mx-auto rounded-md bg-slate-800 bg-opacity-30 p-6">
      <h1 className="mb-6 text-3xl font-bold text-white">Admin Dashboard</h1>
      {users.length === 0 ? (
        <p className="text-white">No users found.</p>
      ) : (
        <table className="min-w-full bg-white bg-opacity-10 text-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Full Name</th>
              <th className="px-4 py-2">Bureau Affiliation</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Account Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.fullName}</td>
                <td className="border px-4 py-2">{user.bureauAffiliation}</td>
                <td className="border px-4 py-2">{user.role}</td>
                <td className="border px-4 py-2">{user.accountStatus}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEditUser(user.id)}
                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Admin;
