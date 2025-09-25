import React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { account, connectWallet, disconnectWallet, isConnected, error } = useWeb3();

  const handleWalletClick = async () => {
    if (isConnected) {
      disconnectWallet();
    } else {
      await connectWallet();
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">Secure Geospatial Blockchain</Link>
      </div>
      <div className={styles.navLinks}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/data-management">Data Management</Link>
        <Link to="/blockchain-management">Blockchain Management</Link>
      </div>
      <div className={styles.walletSection}>
        {error && <span className={styles.error}>{error}</span>}
        <button 
          className={`${styles.walletButton} ${isConnected ? styles.connected : ''}`} 
          onClick={handleWalletClick}
        >
          {isConnected ? formatAddress(account) : 'Connect Wallet'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 