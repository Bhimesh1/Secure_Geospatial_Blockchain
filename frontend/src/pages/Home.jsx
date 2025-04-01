import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import styles from './Home.module.css';

const Home = () => {
  const { darkMode } = useContext(ThemeContext);

  const features = [
    {
      title: 'AES-256 & RSA Encryption',
      description: 'Advanced encryption to secure your geospatial data before storage.',
      icon: (
        <svg className={styles.featureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
    {
      title: 'Blockchain Storage',
      description: 'Immutable, decentralized storage of encrypted data references.',
      icon: (
        <svg className={styles.featureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: 'Access Control',
      description: 'Granular permissions management for your sensitive location data.',
      icon: (
        <svg className={styles.featureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      ),
    },
    {
      title: 'Data Visualization',
      description: 'Interactive maps and visualizations for your geospatial data.',
      icon: (
        <svg className={styles.featureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={`${styles.hero} ${darkMode ? styles.dark : ''}`}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Secure Geospatial Data on the Blockchain
          </h1>
          <p className={styles.heroDescription}>
            A powerful platform for storing and managing geospatial data with advanced encryption
            and blockchain technology. Protect your location data with military-grade security.
          </p>
          <div className={styles.heroButtons}>
            <Link to="/dashboard" className={styles.primaryButton}>
              Get Started
            </Link>
            <Link to="/learn-more" className={styles.secondaryButton}>
              Learn More
            </Link>
          </div>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.mapContainer}>
            {/* Placeholder for map visualization */}
            <div className={styles.mapPlaceholder}>
              <svg className={styles.mapIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresHeader}>
          <h2 className={styles.featuresTitle}>Key Features</h2>
          <p className={styles.featuresDescription}>
            Everything you need to securely manage your geospatial data
          </p>
        </div>
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>
                {feature.icon}
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={`${styles.cta} ${darkMode ? styles.dark : ''}`}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to Secure Your Geospatial Data?</h2>
          <p className={styles.ctaDescription}>
            Join us in revolutionizing geospatial data security with blockchain technology.
          </p>
          <Link to="/dashboard" className={styles.ctaButton}>
            Start Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
