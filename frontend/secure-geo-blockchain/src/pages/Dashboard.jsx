import React, { useState, useEffect } from 'react';
import api from '../services/api';
import FileList from '../components/data/FileList';
import MapView from '../components/map/MapView';

const Dashboard = () => {
  const [dataIds, setDataIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [geospatialData, setGeospatialData] = useState(null);

  useEffect(() => {
    fetchDataIds();
  }, []);

  const fetchDataIds = async () => {
    try {
      setLoading(true);
      const response = await api.getDataIds(true); // Get only owned data IDs
      setDataIds(response.data.data_ids);
    } catch (err) {
      setError(`Error fetching data IDs: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (fileName) => {
    // If it's a JSON file, try to load it for the map view
    if (fileName.endsWith('.json')) {
      loadJsonData(fileName);
    }
  };

  const loadJsonData = async (fileName) => {
    try {
      // This is a mock function - in a real implementation,
      // you would need to fetch the JSON data from your API
      const response = await fetch(`http://localhost:8001/datasets/${fileName}`);
      const data = await response.json();
      setGeospatialData(data);
    } catch (err) {
      console.error('Error loading JSON data:', err);
      setGeospatialData(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Your Data</h2>

            {loading && <p className="text-gray-500">Loading...</p>}

            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {!loading && dataIds.length === 0 && (
              <p className="text-gray-500">You don't have any data stored on the blockchain yet.</p>
            )}

            {dataIds.length > 0 && (
              <div className="mt-4">
                <h3 className="text-md font-medium text-gray-900 mb-2">Your Blockchain Data IDs</h3>
                <ul className="bg-gray-50 rounded-md divide-y divide-gray-200">
                  {dataIds.map((dataId, index) => (
                    <li key={index} className="px-4 py-3 text-sm text-gray-900">
                      {dataId}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6">

                href="/data"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Manage Data
              </a>
            </div>
          </div>

          <FileList onFileSelect={handleFileSelect} />
        </div>

        <div className="mt-6">
          <MapView data={geospatialData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;