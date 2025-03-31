import React, { useState } from 'react';
import api from '../../services/api';

const EncryptionForm = ({ selectedFile, onEncrypted }) => {
  const [useRsa, setUseRsa] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('Please select a file to encrypt');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.encryptData(selectedFile, useRsa);
      setSuccess(`File encrypted successfully: ${response.data.encrypted_file}`);

      if (onEncrypted) {
        onEncrypted(response.data);
      }
    } catch (err) {
      setError(`Error encrypting file: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Encrypt Data</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selected File
          </label>
          <input
            type="text"
            value={selectedFile || ''}
            readOnly
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="No file selected"
          />
        </div>

        <div className="mb-4">
          <div className="flex items-center">
            <input
              id="use-rsa"
              name="use-rsa"
              type="checkbox"
              checked={useRsa}
              onChange={(e) => setUseRsa(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="use-rsa" className="ml-2 block text-sm text-gray-900">
              Use RSA for AES key encryption (recommended for production)
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !selectedFile}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                    ${loading || !selectedFile ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {loading ? 'Encrypting...' : 'Encrypt'}
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

export default EncryptionForm;