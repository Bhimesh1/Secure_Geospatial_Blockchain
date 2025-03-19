import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="bg-white shadow">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Secure Geospatial Blockchain
            </h1>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;