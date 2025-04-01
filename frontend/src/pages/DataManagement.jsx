import React, { useState, useRef } from 'react';
import styles from './DataManagement.module.css';

const DataManagement = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [encryptedFile, setEncryptedFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [fileType, setFileType] = useState('all');
  const [useRSA, setUseRSA] = useState(false);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setEncryptedFile(null); // Reset encrypted file when new file is selected
    }
  };

  const handleCustomFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      // Here you would implement the actual file upload logic
      console.log('Uploading file:', selectedFile);
      
      // After successful upload, you might want to encrypt the file
      await handleEncrypt();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleEncrypt = async () => {
    if (!selectedFile) return;

    try {
      setIsEncrypting(true);
      // Here you would implement the actual encryption logic
      console.log('Encrypting file with RSA:', useRSA);

      // Simulate encryption process
      const encryptedData = new File(
        [selectedFile], 
        `encrypted_${selectedFile.name}`,
        { type: selectedFile.type }
      );
      
      setEncryptedFile(encryptedData);
    } catch (error) {
      console.error('Error encrypting file:', error);
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleStoreOnBlockchain = async () => {
    if (!encryptedFile) return;

    try {
      // Here you would implement the actual blockchain storage logic
      console.log('Storing on blockchain:', encryptedFile);
    } catch (error) {
      console.error('Error storing on blockchain:', error);
    }
  };

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
          <button 
            className={styles.button}
            onClick={handleUpload}
            disabled={!selectedFile || isEncrypting}
          >
            {isEncrypting ? 'Encrypting...' : 'Upload & Encrypt'}
          </button>
        </div>

        {/* Available Files Section */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            Available Files
            <button className={styles.refreshButton}>
              <svg className={styles.refreshIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
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
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </div>
          <div className={styles.error}>
            <svg className={styles.errorIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Error fetching files: Network Error
          </div>
          <div className={styles.emptyState}>
            No files available
          </div>
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
                {encryptedFile ? encryptedFile.name : 'No encrypted file'}
              </span>
            </div>
          </div>
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
          <button 
            className={styles.button}
            onClick={handleStoreOnBlockchain}
            disabled={!encryptedFile}
          >
            Store on Blockchain
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;
