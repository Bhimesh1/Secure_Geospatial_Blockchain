import React, { useState } from 'react';
import api from '../../services/api';

const BlockchainStorage = ({ encryptedData, onStored }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!encryptedData || !encryptedData.encrypted_file) {
      setError('Please encrypt a file first');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.storeOnBlockchain(
        encryptedData.encrypted_file,
        encryptedData.original_file
      );

      setSuccess(`Data reference stored on blockchain with ID: ${response.data.data_id}`);

      if (onStored) {
        onStored(response.data);
      }
    } catch (err) {
      setError(`Error storing on blockchain: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Store on Blockchain</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Encrypted File
          </label>
          <input
            type="text"
            value={encryptedData?.encrypted_file || ''}
            readOnly
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="No encrypted file"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Original File
          </label>
          <input
            type="text"
            value={encryptedData?.original_file || ''}
            readOnly
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="No original file"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !encryptedData?.encrypted_file}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                    ${loading || !encryptedData?.encrypted_file ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {loading ? 'Storing...' : 'Store on Blockchain'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md">
          {success}
        </div>
      )}
    </div>
  );
};

export default BlockchainStorage;