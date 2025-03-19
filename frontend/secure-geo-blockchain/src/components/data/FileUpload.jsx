import React, { useState } from 'react';
import api from '../../services/api';

const FileUpload = ({ onFileUploaded }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const response = await api.uploadFile(file);
      setSuccess(`File uploaded and processed successfully: ${response.data.processed_file}`);
      setFile(null);

      if (onFileUploaded) {
        onFileUploaded(response.data);
      }
    } catch (err) {
      setError(`Error uploading file: ${err.response?.data?.detail || err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Geospatial Data</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select file (Excel, CSV, or JSON)
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".xlsx,.csv,.json"
            className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
          />
        </div>

        <button
          type="submit"
          disabled={uploading || !file}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                    ${uploading || !file ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {uploading ? 'Uploading...' : 'Upload'}
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

export default FileUpload;