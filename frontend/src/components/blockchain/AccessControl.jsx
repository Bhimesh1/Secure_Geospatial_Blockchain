import React, { useState } from 'react';
import api from '../../services/api';
import styles from './AccessControl.module.css';

const AccessControl = () => {
  const [dataId, setDataId] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [accessResult, setAccessResult] = useState(null);

  const isDisabled = loading || !dataId || !address;

  const handleGrantAccess = async () => {
    if (isDisabled) return;
    setStateReset();
    try {
      const response = await api.grantAccess(dataId, address);
      setSuccess(`Access granted: ${response.data.message}`);
    } catch (err) {
      setError(`Error granting access: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeAccess = async () => {
    if (isDisabled) return;
    setStateReset();
    try {
      const response = await api.revokeAccess(dataId, address);
      setSuccess(`Access revoked: ${response.data.message}`);
    } catch (err) {
      setError(`Error revoking access: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAccess = async () => {
    if (isDisabled) return;
    setStateReset();
    try {
      const response = await api.checkAccess(dataId, address);
      setAccessResult(response.data);
    } catch (err) {
      setError(`Error checking access: ${err.response?.data?.detail || err.message}`);
      setAccessResult(null);
    } finally {
      setLoading(false);
    }
  };

  const setStateReset = () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Access Control</h2>

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

      <div className="mb-4">
        <label htmlFor="address" className={styles.label}>Ethereum Address</label>
        <input
          id="address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={styles.input}
          placeholder="Enter Ethereum address (e.g., 0x...)"
        />
      </div>

      <div className={styles.grid}>
        <button
          onClick={handleGrantAccess}
          disabled={isDisabled}
          className={`${styles.button} ${styles.grant} ${isDisabled ? styles.disabled : ''}`}
        >
          Grant Access
        </button>

        <button
          onClick={handleRevokeAccess}
          disabled={isDisabled}
          className={`${styles.button} ${styles.revoke} ${isDisabled ? styles.disabled : ''}`}
        >
          Revoke Access
        </button>

        <button
          onClick={handleCheckAccess}
          disabled={isDisabled}
          className={`${styles.button} ${styles.check} ${isDisabled ? styles.disabled : ''}`}
        >
          Check Access
        </button>
      </div>

      {error && <div className={styles.errorBox}>{error}</div>}
      {success && <div className={styles.successBox}>{success}</div>}

      {accessResult && (
        <div className={`${styles.resultBox} ${accessResult.has_access ? styles.green : styles.red}`}>
          <p>
            {accessResult.has_access
              ? `✅ Address ${accessResult.address} has access to Data ID ${accessResult.data_id}`
              : `❌ Address ${accessResult.address} does NOT have access to Data ID ${accessResult.data_id}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default AccessControl;
