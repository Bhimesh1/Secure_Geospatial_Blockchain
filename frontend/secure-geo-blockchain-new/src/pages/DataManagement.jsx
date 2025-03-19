import React, { useState } from 'react';
import FileUpload from '../components/data/FileUpload';
import FileList from '../components/data/FileList';
import EncryptionForm from '../components/data/EncryptionForm';
import BlockchainStorage from '../components/blockchain/BlockchainStorage';

const DataManagement = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [encryptedData, setEncryptedData] = useState(null);
  const [blockchainData, setBlockchainData] = useState(null);

  const handleFileSelect = (fileName) => {
    setSelectedFile(fileName);
  };

  const handleFileUploaded = (data) => {
    if (data && data.processed_file) {
      setSelectedFile(data.processed_file);
    }
  };

  const handleEncrypted = (data) => {
    setEncryptedData(data);
  };

  const handleStored = (data) => {
    setBlockchainData(data);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Data Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <FileUpload onFileUploaded={handleFileUploaded} />
            <div className="mt-6">
              <EncryptionForm selectedFile={selectedFile} onEncrypted={handleEncrypted} />
            </div>
          </div>

          <div>
            <FileList onFileSelect={handleFileSelect} />
          </div>

          <div>
            <BlockchainStorage encryptedData={encryptedData} onStored={handleStored} />

            {blockchainData && (
              <div className="mt-6 bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Blockchain Storage Result</h2>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm font-medium text-gray-500">Data ID</div>
                    <div className="text-sm text-gray-900">{blockchainData.data_id}</div>

                    <div className="text-sm font-medium text-gray-500">Transaction Hash</div>
                    <div className="text-sm text-gray-900 truncate" title={blockchainData.transaction_hash}>
                      {blockchainData.transaction_hash}
                    </div>

                    <div className="text-sm font-medium text-gray-500">Block Number</div>
                    <div className="text-sm text-gray-900">{blockchainData.block_number}</div>

                    <div className="text-sm font-medium text-gray-500">Gas Used</div>
                    <div className="text-sm text-gray-900">{blockchainData.gas_used}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;