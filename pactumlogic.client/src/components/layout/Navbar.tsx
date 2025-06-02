import { useAuth } from "../../context/AuthContext";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

interface NavbarProps {
  onToggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <header className='bg-white shadow px-4 sm:px-6 py-6 flex justify-between items-center'>
      {/* Left side - Mobile menu button and welcome message */}
      <div className='flex items-center space-x-4'>
        {/* Mobile menu button */}
        <button
          onClick={onToggleSidebar}
          className='lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors'
        >
          <Bars3Icon className='h-6 w-6' />
        </button>

        {/* Welcome message - hide on small screens */}
        <div className='text-sm sm:text-lg font-semibold'>
          <span className='hidden sm:inline'>
            Vitajte späť, {user?.firstName} {user?.lastName}
          </span>
          <span className='sm:hidden'>Vitaj, {user?.firstName}</span>
        </div>
      </div>

      {/* Right side - User menu */}
      <div className='relative'>
        {/* Desktop logout button */}
        <button
          onClick={handleLogout}
          className='hidden sm:block bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors'
        >
          <span className='hidden lg:inline'>Odhlásiť sa</span>
          <span className='lg:hidden'>Odhlásenie</span>
        </button>

        {/* Mobile user menu */}
        <div className='sm:hidden'>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className='p-2 rounded-full hover:bg-gray-100 transition-colors'
          >
            <UserIcon className='h-8 w-8 text-gray-600' />
          </button>

          {/* Mobile dropdown menu */}
          {isUserMenuOpen && (
            <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50'>
              <div className='px-4 py-2 text-sm text-gray-700 border-b'>
                {user?.firstName} {user?.lastName}
              </div>
              <button
                onClick={handleLogout}
                className='block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100'
              >
                Odhlásiť sa
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
