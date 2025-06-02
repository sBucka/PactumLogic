import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 z-20 bg-opacity-10 lg:hidden'
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main content */}
      <div className='flex flex-col flex-1 min-w-0'>
        <Navbar onToggleSidebar={toggleSidebar} />
        <main className='flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6'>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
