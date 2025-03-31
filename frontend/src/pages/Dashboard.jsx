import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import api from '../services/api';
import FileList from '../components/data/FileList';
import MapView from '../components/map/MapView';
import DataStatistics from '../components/data/DataStatistics';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { darkMode } = useContext(ThemeContext);
  const [dataIds, setDataIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [geospatialData, setGeospatialData] = useState(null);
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalSize: '0 MB',
    lastUpdated: 'Never',
    blockchainStatus: 'Connected'
  });

  useEffect(() => {
    fetchDataIds();
    fetchStats();
  }, []);

  const fetchDataIds = async () => {
    try {
      setLoading(true);
      const response = await api.getDataIds(true);
      setDataIds(response.data.data_ids);
    } catch (err) {
      setError(`Error fetching data IDs: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    // Mock stats for now - replace with actual API calls
    setStats({
      totalFiles: dataIds.length,
      totalSize: '2.5 MB',
      lastUpdated: new Date().toLocaleDateString(),
      blockchainStatus: 'Connected'
    });
  };

  const handleFileSelect = (fileName) => {
    if (fileName.endsWith('.json')) {
      loadJsonData(fileName);
    }
  };

  const loadJsonData = async (fileName) => {
    try {
      const response = await fetch(`http://localhost:8001/datasets/${fileName}`);
      const data = await response.json();
      setGeospatialData(data);
    } catch (err) {
      console.error('Error loading JSON data:', err);
      setGeospatialData(null);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <div className={styles.actions}>
          <Link to="/data" className={styles.primaryButton}>
            Manage Data
          </Link>
          <Link to="/blockchain" className={styles.secondaryButton}>
            Blockchain Status
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statTitle}>Total Files</h3>
            <p className={styles.statValue}>{stats.totalFiles}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statTitle}>Total Size</h3>
            <p className={styles.statValue}>{stats.totalSize}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statTitle}>Last Updated</h3>
            <p className={styles.statValue}>{stats.lastUpdated}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statTitle}>Blockchain Status</h3>
            <p className={`${styles.statValue} ${styles.statusConnected}`}>
              {stats.blockchainStatus}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className={styles.mainGrid}>
        {/* Map Section */}
        <div className={styles.mapSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Geospatial Data Visualization</h2>
            <div className={styles.sectionActions}>
              <button className={styles.iconButton} title="Refresh">
                <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button className={styles.iconButton} title="Fullscreen">
                <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            </div>
          </div>
          <div className={styles.mapContainer}>
            <MapView data={geospatialData} />
          </div>
        </div>

        {/* Data List Section */}
        <div className={styles.dataSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Your Data</h2>
            <div className={styles.sectionActions}>
              <button className={styles.iconButton} title="Upload">
                <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </button>
            </div>
          </div>
          <div className={styles.dataContainer}>
            {loading && (
              <div className={styles.loadingState}>
                <div className={styles.spinner}></div>
                <p>Loading your data...</p>
              </div>
            )}
            {error && (
              <div className={styles.errorState}>
                <svg className={styles.errorIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>{error}</p>
              </div>
            )}
            {!loading && dataIds.length === 0 && (
              <div className={styles.emptyState}>
                <svg className={styles.emptyIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <p>No data stored on the blockchain yet</p>
                <Link to="/data" className={styles.emptyButton}>
                  Upload Data
                </Link>
              </div>
            )}
            {dataIds.length > 0 && (
              <div className={styles.dataList}>
                <FileList onFileSelect={handleFileSelect} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      {geospatialData && (
        <div className={styles.statsSection}>
          <h2 className={styles.sectionTitle}>Data Statistics</h2>
          <DataStatistics data={geospatialData} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
