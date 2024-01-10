import { NavLink } from 'react-router-dom';
import { UserState } from './App';

// TypeScript interface for the component's props
interface NavProps {
  user: UserState | null; // User state to determine if a user is logged in
  logout: () => void; // Function to handle logout
}

// Nav component for navigation and logout functionality
function Nav({ user, logout }: NavProps) {
  return (
    // Main container for the navigation section
    <section className="flex w-full justify-between p-0">
      {/* Other nav links can go here */}
      {user ? (
        // If a user is logged in, show the logout button
        <button
          onClick={() => logout()} // Call the logout function when clicked
          className="fixed mb-4 rounded pl-4 pt-2 text-[18px] transition-colors duration-300 hover:text-blue-600"
        >
          Log out
        </button>
      ) : null}{' '}
      // If no user is logged in, do not display the logout button
    </section>
  );
}

export default Nav;
