import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const FileList = ({ onFileSelect }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await api.listFiles();
      setFiles(response.data.files);
    } catch (err) {
      setError(`Error fetching files: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file.name);
    if (onFileSelect) {
      onFileSelect(file.name);
    }
  };

  const getFileIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'xlsx':
        return '📊';
      case 'csv':
        return '📋';
      case 'json':
        return '📝';
      case 'enc':
        return '🔒';
      case 'key':
        return '🔑';
      case 'meta':
        return 'ℹ️';
      default:
        return '📄';
    }
  };

  // Format file size in human-readable format
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Available Files</h2>
        <button
          onClick={fetchFiles}
          className="text-blue-600 hover:text-blue-800"
        >
          Refresh
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading files...</p>}

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {!loading && files.length === 0 && (
        <p className="text-gray-500">No files available</p>
      )}

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modified</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {files.map((file, index) => (
              <tr
                key={index}
                className={selectedFile === file.name ? 'bg-blue-50' : ''}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="mr-2">{getFileIcon(file.type)}</span>
                    <span className="text-sm font-medium text-gray-900">{file.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatFileSize(file.size)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(file.modified)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleFileSelect(file)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileList;