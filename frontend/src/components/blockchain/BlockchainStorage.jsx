import React, { useState } from 'react';
import api from '../../services/api';
import styles from './BlockchainStorage.module.css';

const BlockchainStorage = ({ encryptedData, onStored }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!encryptedData || !encryptedData.encrypted_file) {
      setError('Please encrypt a file first');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.storeOnBlockchain(
        encryptedData.encrypted_file,
        encryptedData.original_file
      );

      setSuccess(`✅ Stored on blockchain with ID: ${response.data.data_id}`);

      if (onStored) {
        onStored(response.data);
      }
    } catch (err) {
      setError(`Error storing on blockchain: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || !encryptedData?.encrypted_file;

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Store on Blockchain</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className={styles.label}>Encrypted File</label>
          <input
            type="text"
            value={encryptedData?.encrypted_file || ''}
            readOnly
            className={styles.input}
            placeholder="No encrypted file"
          />
        </div>

        <div className="mb-4">
          <label className={styles.label}>Original File</label>
          <input
            type="text"
            value={encryptedData?.original_file || ''}
            readOnly
            className={styles.input}
            placeholder="No original file"
          />
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className={`${styles.button} ${isDisabled ? styles.disabled : ''}`}
        >
          {loading ? 'Storing...' : 'Store on Blockchain'}
        </button>
      </form>

      {error && <div className={styles.errorBox}>{error}</div>}
      {success && <div className={styles.successBox}>{success}</div>}
    </div>
  );
};

export default BlockchainStorage;
