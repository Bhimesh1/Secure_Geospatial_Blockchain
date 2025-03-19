import React from 'react';
import DataRetrieval from '../components/blockchain/DataRetrieval';
import AccessControl from '../components/blockchain/AccessControl';

const BlockchainManagement = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Blockchain Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DataRetrieval />
          <AccessControl />
        </div>
      </div>
    </div>
  );
};

export default BlockchainManagement;