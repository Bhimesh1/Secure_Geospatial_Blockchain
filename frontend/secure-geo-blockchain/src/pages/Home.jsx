import React from 'react';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-10">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Secure Blockchain-Based Storage & Transmission of Encrypted Geospatial Data
            </h1>

            <p className="text-lg text-gray-500">
              This application provides a secure platform for storing and managing geospatial data using
              AES & RSA encryption combined with blockchain technology.
            </p>

            <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50">
              <p className="text-gray-700">
                Geospatial data security is critical for many applications including navigation,
                logistics, disaster management, and smart city planning.
              </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900">Key Features</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">AES-256 & RSA Encryption</h3>
                <p className="text-gray-700">Advanced encryption to secure your geospatial data before storage.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">Blockchain Storage</h3>
                <p className="text-gray-700">Immutable, decentralized storage of encrypted data references.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">Access Control</h3>
                <p className="text-gray-700">Granular permissions management for your sensitive location data.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">Data Visualization</h3>
                <p className="text-gray-700">Interactive maps and visualizations for your geospatial data.</p>
              </div>
            </div>

            <div className="mt-6">

                href="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;