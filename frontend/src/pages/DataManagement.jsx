import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import styles from './DataManagement.module.css';

const DataManagement = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [encryptedFile, setEncryptedFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [fileType, setFileType] = useState('all');
  const [useRSA, setUseRSA] = useState(false);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isStoring, setIsStoring] = useState(false);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [encryptError, setEncryptError] = useState(null);
  const [storeError, setStoreError] = useState(null);
  const fileInputRef = useRef(null);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.listFiles();
      setFiles(response.data.files || []);
    } catch (err) {
      setError(`Error fetching files: ${err.message}`);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setEncryptedFile(null);
      setUploadError(null);
      setEncryptError(null);
      setStoreError(null);
    }
  };

  const handleCustomFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      setUploadError(null);
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const response = await api.uploadFile(selectedFile);
      console.log('Upload response:', response.data);
      
      // After successful upload, encrypt the file
      await handleEncrypt(response.data.processed_file || selectedFile.name);
      
      await fetchFiles(); // Refresh the file list
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError(`Error uploading file: ${error.response?.data?.detail || error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEncrypt = async (fileName) => {
    try {
      setIsEncrypting(true);
      setEncryptError(null);
      
      const response = await api.encryptData(fileName, useRSA);
      console.log('Encryption response:', response.data);
      
      setEncryptedFile(response.data);
    } catch (error) {
      console.error('Error encrypting file:', error);
      setEncryptError(`Error encrypting file: ${error.response?.data?.detail || error.message}`);
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleStoreOnBlockchain = async () => {
    if (!encryptedFile) return;

    try {
      setIsStoring(true);
      setStoreError(null);
      
      const response = await api.storeOnBlockchain(
        encryptedFile.encrypted_file,
        encryptedFile.original_file
      );
      console.log('Blockchain storage response:', response.data);
      
      await fetchFiles(); // Refresh the file list
      
      // Reset the form after successful storage
      setSelectedFile(null);
      setEncryptedFile(null);
    } catch (error) {
      console.error('Error storing on blockchain:', error);
      setStoreError(`Error storing on blockchain: ${error.response?.data?.detail || error.message}`);
    } finally {
      setIsStoring(false);
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = fileType === 'all' || file.type === fileType;
    return matchesSearch && matchesType;
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Data Management</h1>

      <div className={styles.grid}>
        {/* Upload Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Upload Geospatial Data</h2>
          <div className={styles.fileInputContainer}>
            <label className={styles.fileInputLabel}>Select file (Excel, CSV, or JSON)</label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.csv,.json"
              onChange={handleFileSelect}
              className={styles.fileInput}
            />
            <div 
              className={styles.customFileInput}
              onClick={handleCustomFileInputClick}
            >
              <svg className={styles.fileIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className={styles.fileName}>
                {selectedFile ? selectedFile.name : 'Choose a file...'}
              </span>
            </div>
          </div>
          {uploadError && (
            <div className={styles.error}>{uploadError}</div>
          )}
          <button 
            className={styles.button}
            onClick={handleUpload}
            disabled={!selectedFile || isUploading || isEncrypting}
          >
            {isUploading ? 'Uploading...' : isEncrypting ? 'Encrypting...' : 'Upload & Encrypt'}
          </button>
        </div>

        {/* Available Files Section */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            Available Files
            <button 
              className={styles.refreshButton}
              onClick={fetchFiles}
              disabled={loading}
            >
              <svg className={styles.refreshIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search files..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className={styles.select}
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="xlsx">Excel</option>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </div>
          
          {loading && (
            <div className={styles.loading}>Loading files...</div>
          )}
          
          {error && (
            <div className={styles.error}>
              <svg className={styles.errorIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {!loading && !error && filteredFiles.length === 0 && (
            <div className={styles.emptyState}>
              No files available
            </div>
          )}

          {!loading && !error && filteredFiles.length > 0 && (
            <div className={styles.fileList}>
              {filteredFiles.map((file, index) => (
                <div key={index} className={styles.fileItem}>
                  <div className={styles.fileName}>{file.name}</div>
                  <div className={styles.fileInfo}>
                    <span>{file.type.toUpperCase()}</span>
                    <span>{formatFileSize(file.size)}</span>
                    <span>{new Date(file.modified * 1000).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Store on Blockchain Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Store on Blockchain</h2>
          <div className={styles.fileInputContainer}>
            <label className={styles.fileInputLabel}>Encrypted File</label>
            <div className={styles.customFileInput}>
              <svg className={styles.fileIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
              <span className={styles.fileName}>
                {encryptedFile ? encryptedFile.encrypted_file : 'No encrypted file'}
              </span>
            </div>
          </div>
          {encryptError && (
            <div className={styles.error}>{encryptError}</div>
          )}
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              id="useRSA"
              checked={useRSA}
              onChange={(e) => setUseRSA(e.target.checked)}
            />
            <label htmlFor="useRSA">
              Use RSA for AES key encryption (recommended for production)
            </label>
          </div>
          {storeError && (
            <div className={styles.error}>{storeError}</div>
          )}
          <button 
            className={styles.button}
            onClick={handleStoreOnBlockchain}
            disabled={!encryptedFile || isStoring}
          >
            {isStoring ? 'Storing...' : 'Store on Blockchain'}
          </button>
        </div>
      </div>
    </div>
  );
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default DataManagement;
