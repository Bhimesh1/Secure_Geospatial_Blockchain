import React from 'react';
import DataRetrieval from '../components/blockchain/DataRetrieval';
import AccessControl from '../components/blockchain/AccessControl';
import styles from './BlockchainManagement.module.css';

const BlockchainManagement = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Blockchain Management</h1>
        <p className={styles.subtitle}>
          Securely manage your geospatial data on the blockchain with advanced encryption and access control
        </p>
      </div>

      <div className={styles.grid}>
        <DataRetrieval />
        <AccessControl />
      </div>
    </div>
  );
};

export default BlockchainManagement;
