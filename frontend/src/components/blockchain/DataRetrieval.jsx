import React, { useState } from 'react';
import api from '../../services/api';
import styles from './DataRetrieval.module.css';

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

  const isDisabled = loading || !dataId;

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Retrieve from Blockchain</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="data-id" className={styles.label}>Data ID</label>
          <input
            id="data-id"
            type="text"
            value={dataId}
            onChange={(e) => setDataId(e.target.value)}
            className={styles.input}
            placeholder="Enter data ID"
          />
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className={`${styles.button} ${isDisabled ? styles.disabled : ''}`}
        >
          {loading ? 'Retrieving...' : 'Retrieve'}
        </button>
      </form>

      {error && <div className={styles.errorBox}>{error}</div>}

      {retrievedData && (
        <div className="mt-4">
          <h3 className={styles.title}>Retrieved Data</h3>
          <div className={styles.successBox}>
            <div className={styles.grid}>
              <div className={styles.labelText}>Data ID</div>
              <div className={styles.valueText}>{retrievedData.data_id}</div>

              <div className={styles.labelText}>Cipher Hash</div>
              <div className={styles.valueText} title={retrievedData.cipher_hash}>
                {retrievedData.cipher_hash}
              </div>

              <div className={styles.labelText}>Metadata Hash</div>
              <div className={styles.valueText} title={retrievedData.metadata_hash}>
                {retrievedData.metadata_hash}
              </div>

              <div className={styles.labelText}>Timestamp</div>
              <div className={styles.valueText}>{retrievedData.timestamp_readable}</div>

              <div className={styles.labelText}>Owner</div>
              <div className={styles.valueText} title={retrievedData.owner}>
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
