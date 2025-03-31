import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? styles.active : '';
  };

  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarInner}>
          <div className={styles.logo}>GeoBlockchain</div>
          <nav className={styles.nav}>
            <Link to="/" className={`${styles.link} ${isActive('/')}`}>
              Home
            </Link>
            <Link to="/dashboard" className={`${styles.link} ${isActive('/dashboard')}`}>
              Dashboard
            </Link>
            <Link to="/data" className={`${styles.link} ${isActive('/data')}`}>
              Data Management
            </Link>
            <Link to="/blockchain" className={`${styles.link} ${isActive('/blockchain')}`}>
              Blockchain
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
