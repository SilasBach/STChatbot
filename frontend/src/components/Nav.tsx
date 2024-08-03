import React from 'react';
import { NavLink } from 'react-router-dom';
import { UserState } from './App'; // Make sure to import UserState from where it's defined

interface NavProps {
  user: UserState | null;
  logout: () => void;
}

// Nav component for navigation and logout functionality
function Nav({ user, logout }: NavProps) {
  return (
    // Main container for the navigation section
    <nav className="fixed left-0 right-0 top-0 border border-slate-600 bg-slate-800 bg-opacity-30 p-4 backdrop-blur-sm ">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-xl font-bold text-white">InsurEase</div>
        <div className="flex items-center">
          {user ? (
            <>
              {user.role === 'admin' ? (
                <NavLink
                  to="/admin"
                  className="mr-4 text-white hover:text-blue-300"
                >
                  Admin Dashboard
                </NavLink>
              ) : (
                <>
                  <NavLink
                    to="/update-user"
                    className="mr-4 text-white hover:text-blue-300"
                  >
                    Update Profile
                  </NavLink>
                  <NavLink
                    to="/gpt"
                    className="mr-4 text-white hover:text-blue-300"
                  >
                    GPT
                  </NavLink>
                </>
              )}
              <button
                onClick={() => logout()}
                className="text-white hover:text-blue-300"
              >
                Log out
              </button>
            </>
          ) : (
            <NavLink to="/login" className="text-white hover:text-blue-300">
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Nav;
