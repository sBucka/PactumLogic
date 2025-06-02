import { NavLink } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import PactumLogic from "./../../assets/PactumLogic.svg";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const getNavLinkClasses = ({ isActive }: { isActive: boolean }) => {
    const baseClasses =
      "block px-4 py-2 rounded-md transition-all duration-200 text-sm sm:text-base";

    if (isActive) {
      return `${baseClasses} bg-teal-600 text-white shadow-md shadow-black/70 font-bold`;
    }

    return `${baseClasses} text-gray-300 hover:text-teal-300 hover:bg-gray-700`;
  };

  const handleNavClick = () => {
    // Close sidebar on mobile when navigation link is clicked
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className='hidden lg:flex w-64 bg-gray-800 text-white p-6 flex-col'>
        <NavLink to='/' className='mb-8 flex items-center justify-center'>
          <img
            src={PactumLogic}
            alt='PactumLogic Logo'
            className='h-16 xl:h-20 w-full drop-shadow-md'
          />
        </NavLink>
        <nav className='flex flex-col space-y-2'>
          <NavLink to='/' className={getNavLinkClasses} end>
            Dashboard
          </NavLink>
          <NavLink to='/contracts' className={getNavLinkClasses}>
            Zmluvy
          </NavLink>
          <NavLink to='/clients' className={getNavLinkClasses}>
            Klienti
          </NavLink>
          <NavLink to='/advisors' className={getNavLinkClasses}>
            Účasníci
          </NavLink>
        </nav>
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white p-6 flex flex-col
        transform transition-transform duration-300 ease-in-out lg:hidden
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Close button */}
        <div className='flex items-center justify-between mb-6'>
          <NavLink
            to='/'
            className='flex items-center justify-center'
            onClick={handleNavClick}
          >
            <img
              src={PactumLogic}
              alt='PactumLogic Logo'
              className='h-16 w-full drop-shadow-md'
            />
          </NavLink>
          <button
            onClick={onClose}
            className='p-2 rounded-md hover:bg-gray-700 transition-colors'
          >
            <XMarkIcon className='h-6 w-6' />
          </button>
        </div>

        <nav className='flex flex-col space-y-2'>
          <NavLink
            to='/'
            className={getNavLinkClasses}
            onClick={handleNavClick}
            end
          >
            Dashboard
          </NavLink>
          <NavLink
            to='/contracts'
            className={getNavLinkClasses}
            onClick={handleNavClick}
          >
            Zmluvy
          </NavLink>
          <NavLink
            to='/clients'
            className={getNavLinkClasses}
            onClick={handleNavClick}
          >
            Klienti
          </NavLink>
          <NavLink
            to='/advisors'
            className={getNavLinkClasses}
            onClick={handleNavClick}
          >
            Účasníci
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
