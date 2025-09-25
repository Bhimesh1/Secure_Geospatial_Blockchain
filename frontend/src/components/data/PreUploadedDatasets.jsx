import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import styles from './PreUploadedDatasets.module.css';

const PreUploadedDatasets = ({ onFileSelect }) => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    try {
      setLoading(true);
      const response = await api.listPreUploadedDatasets();
      setDatasets(response.data.datasets || []);
    } catch (err) {
      setError('Error loading pre-uploaded datasets');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (dataset) => {
    try {
      setLoading(true);
      setSelectedFile(dataset.name);
      
      // Fetch the dataset content
      const response = await api.getDatasetContent(dataset.name);
      const geospatialData = {
        data: response.data,
        metadata: {
          name: dataset.name,
          type: dataset.type,
          size: dataset.size
        }
      };
      
      // Pass the data to the parent component
      onFileSelect?.(geospatialData);
    } catch (err) {
      setError(`Error loading dataset: ${dataset.name}`);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
      case 'xlsx': return '📊';
      case 'csv': return '📋';
      case 'json': return '📝';
      default: return '📄';
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Loading datasets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <svg className={styles.errorIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>{error}</p>
      </div>
    );
  }

  if (datasets.length === 0) {
    return (
      <div className={styles.emptyState}>
        <svg className={styles.emptyIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <p>No pre-uploaded datasets available</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Available Datasets</h3>
      </div>
      <div className={styles.datasetList}>
        {datasets.map((dataset, index) => (
          <div
            key={index}
            className={`${styles.datasetItem} ${selectedFile === dataset.name ? styles.selected : ''}`}
            onClick={() => handleSelect(dataset)}
          >
            <div className={styles.datasetIcon}>{getFileIcon(dataset.name)}</div>
            <div className={styles.datasetInfo}>
              <div className={styles.datasetName}>{dataset.name}</div>
              <div className={styles.datasetMeta}>
                {dataset.type} • {dataset.size}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreUploadedDatasets; 