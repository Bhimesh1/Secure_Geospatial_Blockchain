import React, { useState } from 'react';
import api from '../../services/api';
import styles from './EncryptionForm.module.css';

const EncryptionForm = ({ selectedFile, onEncrypted }) => {
  const [useRsa, setUseRsa] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('Please select a file to encrypt');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.encryptData(selectedFile, useRsa);
      setSuccess(`✅ Encrypted: ${response.data.encrypted_file}`);
      onEncrypted?.(response.data);
    } catch (err) {
      setError(`Error: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || !selectedFile;

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Encrypt Data</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className={styles.label}>Selected File</label>
          <input
            type="text"
            value={selectedFile || ''}
            readOnly
            className={styles.input}
            placeholder="No file selected"
          />
        </div>

        <div className="mb-4">
          <div className={styles.checkboxWrapper}>
            <input
              id="use-rsa"
              name="use-rsa"
              type="checkbox"
              checked={useRsa}
              onChange={(e) => setUseRsa(e.target.checked)}
              className={styles.checkbox}
            />
            <label htmlFor="use-rsa" className={styles.checkboxLabel}>
              Use RSA for AES key encryption (recommended for production)
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className={`${styles.button} ${isDisabled ? styles.disabled : ''}`}
        >
          {loading ? 'Encrypting...' : 'Encrypt'}
        </button>
      </form>

      {error && <div className={styles.errorBox}>{error}</div>}
      {success && <div className={styles.successBox}>{success}</div>}
    </div>
  );
};

export default EncryptionForm;
