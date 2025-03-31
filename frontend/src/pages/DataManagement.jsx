import React, { useState } from 'react';
import FileUpload from '../components/data/FileUpload';
import FileList from '../components/data/FileList';
import EncryptionForm from '../components/data/EncryptionForm';
import BlockchainStorage from '../components/blockchain/BlockchainStorage';
import styles from './DataManagement.module.css';

const DataManagement = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [encryptedData, setEncryptedData] = useState(null);
  const [blockchainData, setBlockchainData] = useState(null);

  const handleFileSelect = (fileName) => {
    setSelectedFile(fileName);
  };

  const handleFileUploaded = (data) => {
    if (data && data.processed_file) {
      setSelectedFile(data.processed_file);
    }
  };

  const handleEncrypted = (data) => {
    setEncryptedData(data);
  };

  const handleStored = (data) => {
    setBlockchainData(data);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Data Management</h1>

      <div className={styles.grid}>
        <div className={styles.section}>
          <FileUpload onFileUploaded={handleFileUploaded} />
          <div className={styles.sectionMargin}>
            <EncryptionForm selectedFile={selectedFile} onEncrypted={handleEncrypted} />
          </div>
        </div>

        <div className={styles.section}>
          <FileList onFileSelect={handleFileSelect} />
        </div>

        <div className={styles.section}>
          <BlockchainStorage encryptedData={encryptedData} onStored={handleStored} />

          {blockchainData && (
            <div className={`${styles.resultCard} ${styles.sectionMargin}`}>
              <h2 className={styles.resultTitle}>Blockchain Storage Result</h2>
              <div className={styles.resultBox}>
                <div className={styles.resultGrid}>
                  <div className={styles.label}>Data ID</div>
                  <div className={styles.value}>{blockchainData.data_id}</div>

                  <div className={styles.label}>Transaction Hash</div>
                  <div className={styles.value} title={blockchainData.transaction_hash}>
                    {blockchainData.transaction_hash}
                  </div>

                  <div className={styles.label}>Block Number</div>
                  <div className={styles.value}>{blockchainData.block_number}</div>

                  <div className={styles.label}>Gas Used</div>
                  <div className={styles.value}>{blockchainData.gas_used}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataManagement;
