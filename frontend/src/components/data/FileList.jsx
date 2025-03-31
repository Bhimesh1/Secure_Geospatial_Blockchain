import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import styles from './FileList.module.css';

const FileList = ({ onFileSelect }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState('all');

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
    onFileSelect?.(file.name);
  };

  const getFileIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'xlsx': return '📊';
      case 'csv': return '📋';
      case 'json': return '📝';
      case 'enc': return '🔒';
      case 'key': return '🔑';
      case 'meta': return 'ℹ️';
      default: return '📄';
    }
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (fileTypeFilter === 'all' || file.type === fileTypeFilter)
  );

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp) => new Date(timestamp * 1000).toLocaleString();

  const fileTypes = ['all', ...new Set(files.map(file => file.type))];

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Available Files</h2>
        <span onClick={fetchFiles} className={styles.refresh}>Refresh</span>
      </div>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search files..."
          className={styles.input}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={fileTypeFilter}
          onChange={(e) => setFileTypeFilter(e.target.value)}
          className={styles.select}
        >
          {fileTypes.map(type => (
            <option key={type} value={type}>
              {type === 'all' ? 'All Types' : type.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading files...</p>}
      {error && <div className={styles.errorBox}>{error}</div>}

      {!loading && filteredFiles.length === 0 && (
        <p>{files.length === 0 ? 'No files available' : 'No files match your search criteria'}</p>
      )}

      {!loading && filteredFiles.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.th}>File</th>
                <th className={styles.th}>Size</th>
                <th className={styles.th}>Modified</th>
                <th className={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file, index) => (
                <tr
                  key={index}
                  className={`${styles.tr} ${selectedFile === file.name ? styles.selected : ''}`}
                >
                  <td className={styles.td}>
                    <div className={styles.nameCell}>
                      <span>{getFileIcon(file.type)}</span>
                      <span className={styles.nameText}>{file.name}</span>
                    </div>
                  </td>
                  <td className={styles.td}>{formatFileSize(file.size)}</td>
                  <td className={styles.td}>{formatDate(file.modified)}</td>
                  <td className={styles.td}>
                    <span
                      onClick={() => handleFileSelect(file)}
                      className={styles.selectButton}
                    >
                      Select
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FileList;
