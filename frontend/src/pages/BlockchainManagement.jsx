import React from 'react';
import DataRetrieval from '../components/blockchain/DataRetrieval';
import AccessControl from '../components/blockchain/AccessControl';
import styles from './BlockchainManagement.module.css';

const BlockchainManagement = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Blockchain Management</h1>

      <div className={styles.grid}>
        <DataRetrieval />
        <AccessControl />
      </div>
    </div>
  );
};

export default BlockchainManagement;
