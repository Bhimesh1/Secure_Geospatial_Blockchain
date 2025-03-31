import React, { useState } from 'react';
import api from '../../services/api';

const AccessControl = () => {
  const [dataId, setDataId] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [accessResult, setAccessResult] = useState(null);

  const handleGrantAccess = async () => {
    if (!dataId || !address) {
      setError('Please provide both Data ID and Ethereum address');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.grantAccess(dataId, address);
      setSuccess(`Access granted: ${response.data.message}`);
    } catch (err) {
      setError(`Error granting access: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeAccess = async () => {
    if (!dataId || !address) {
      setError('Please provide both Data ID and Ethereum address');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.revokeAccess(dataId, address);
      setSuccess(`Access revoked: ${response.data.message}`);
    } catch (err) {
      setError(`Error revoking access: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAccess = async () => {
    if (!dataId || !address) {
      setError('Please provide both Data ID and Ethereum address');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.checkAccess(dataId, address);
      setAccessResult(response.data);
    } catch (err) {
      setError(`Error checking access: ${err.response?.data?.detail || err.message}`);
      setAccessResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Access Control</h2>

      <div className="mb-4">
        <label htmlFor="data-id" className="block text-sm font-medium text-gray-700 mb-2">
          Data ID
        </label>
        <input
          id="data-id"
          type="text"
          value={dataId}
          onChange={(e) => setDataId(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Enter data ID"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
          Ethereum Address
        </label>
        <input
          id="address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Enter Ethereum address (e.g., 0x...)"
        />
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <button
          onClick={handleGrantAccess}
          disabled={loading || !dataId || !address}
          className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                    ${loading || !dataId || !address ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          Grant Access
        </button>

        <button
          onClick={handleRevokeAccess}
          disabled={loading || !dataId || !address}
          className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                    ${loading || !dataId || !address ? 'bg-red-300' : 'bg-red-600 hover:bg-red-700'}
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
        >
          Revoke Access
        </button>

        <button
          onClick={handleCheckAccess}
          disabled={loading || !dataId || !address}
          className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                    ${loading || !dataId || !address ? 'bg-green-300' : 'bg-green-600 hover:bg-green-700'}
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
        >
          Check Access
        </button>
      </div>

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

      {accessResult && (
        <div className="mt-4">
          <h3 className="text-md font-medium text-gray-900 mb-2">Access Check Result</h3>
          <div className={`p-4 rounded-md ${accessResult.has_access ? 'bg-green-50' : 'bg-red-50'}`}>
            <p className={accessResult.has_access ? 'text-green-700' : 'text-red-700'}>
              {accessResult.has_access
                ? `Address ${accessResult.address} has access to data ID ${accessResult.data_id}`
                : `Address ${accessResult.address} does not have access to data ID ${accessResult.data_id}`
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessControl;