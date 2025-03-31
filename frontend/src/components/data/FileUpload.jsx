import React, { useState } from 'react';
import api from '../../services/api';
import styles from './FileUpload.module.css';

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
      setSuccess(`✅ Uploaded: ${response.data.processed_file}`);
      setFile(null);

      onFileUploaded?.(response.data);
    } catch (err) {
      setError(`Error: ${err.response?.data?.detail || err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Upload Geospatial Data</h2>

      <form onSubmit={handleSubmit}>
        <label className={styles.label}>
          Select file (Excel, CSV, or JSON)
        </label>
        <input
          type="file"
          accept=".xlsx,.csv,.json"
          onChange={handleFileChange}
          className={styles.fileInput}
        />

        <button
          type="submit"
          disabled={uploading || !file}
          className={`${styles.button} ${uploading || !file ? styles.disabled : ''}`}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {error && <div className={styles.errorBox}>{error}</div>}
      {success && <div className={styles.successBox}>{success}</div>}
    </div>
  );
};

export default FileUpload;
