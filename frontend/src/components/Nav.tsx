import { NavLink } from 'react-router-dom';
import { UserState } from './App';

interface NavProps {
  user: UserState | null;
  logout: () => void;
}

function Nav({ user, logout }: NavProps) {
  return (
    <section className="flex w-full justify-between p-0">
      {/* Other nav links can go here */}
      {user ? (
        <button
          onClick={() => logout()}
          className="fixed mb-4 rounded pl-4 pt-2 text-[18px] transition-colors duration-300 hover:text-blue-600"
        >
          Log out
        </button>
      ) : null}
    </section>
  );
}

export default Nav;
