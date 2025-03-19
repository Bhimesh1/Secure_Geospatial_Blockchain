import React, { useState } from 'react';
import api from '../../services/api';

const DataRetrieval = () => {
  const [dataId, setDataId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retrievedData, setRetrievedData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dataId) {
      setError('Please enter a data ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.retrieveFromBlockchain(dataId);
      setRetrievedData(response.data);
    } catch (err) {
      setError(`Error retrieving data: ${err.response?.data?.detail || err.message}`);
      setRetrievedData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Retrieve from Blockchain</h2>

      <form onSubmit={handleSubmit}>
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

        <button
          type="submit"
          disabled={loading || !dataId}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                    ${loading || !dataId ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {loading ? 'Retrieving...' : 'Retrieve'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {retrievedData && (
        <div className="mt-4">
          <h3 className="text-md font-medium text-gray-900 mb-2">Retrieved Data</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-sm font-medium text-gray-500">Data ID</div>
              <div className="text-sm text-gray-900">{retrievedData.data_id}</div>

              <div className="text-sm font-medium text-gray-500">Cipher Hash</div>
              <div className="text-sm text-gray-900 truncate" title={retrievedData.cipher_hash}>
                {retrievedData.cipher_hash}
              </div>

              <div className="text-sm font-medium text-gray-500">Metadata Hash</div>
              <div className="text-sm text-gray-900 truncate" title={retrievedData.metadata_hash}>
                {retrievedData.metadata_hash}
              </div>

              <div className="text-sm font-medium text-gray-500">Timestamp</div>
              <div className="text-sm text-gray-900">{retrievedData.timestamp_readable}</div>

              <div className="text-sm font-medium text-gray-500">Owner</div>
              <div className="text-sm text-gray-900 truncate" title={retrievedData.owner}>
                {retrievedData.owner}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataRetrieval;