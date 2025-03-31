import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white';
  };

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-gray-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <span className="text-white text-xl font-semibold">GeoBlockchain</span>
            </div>
            <nav className="mt-5 flex-1 px-2 bg-gray-800 space-y-1">
              <Link to="/" className={`${isActive('/')} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}>
                Home
              </Link>
              <Link to="/dashboard" className={`${isActive('/dashboard')} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}>
                Dashboard
              </Link>
              <Link to="/data" className={`${isActive('/data')} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}>
                Data Management
              </Link>
              <Link to="/blockchain" className={`${isActive('/blockchain')} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}>
                Blockchain
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;