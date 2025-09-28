import React, { useState, useEffect, useContext } from 'react';
import styles from './LearnMore.module.css';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';

const LearnMore = () => {
  const [stats, setStats] = useState({
    filesProcessed: 0,
    dataPoints: 0,
    usersConnected: 0,
    blockchainTransactions: 0
  });

  const [activeDemo, setActiveDemo] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    // Animate stats on component mount
    const timer = setTimeout(() => {
      setStats({
        filesProcessed: 1247,
        dataPoints: 89456,
        usersConnected: 342,
        blockchainTransactions: 567
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const demoSteps = [
    {
      title: "Upload Geospatial Data",
      description: "Drag and drop your Excel, CSV, or JSON files",
      icon: "📁"
    },
    {
      title: "AES-256 Encryption",
      description: "Your data is encrypted with military-grade security",
      icon: "🔐"
    },
    {
      title: "Blockchain Storage",
      description: "Encrypted references stored on Ethereum",
      icon: "⛓️"
    },
    {
      title: "Interactive Visualization",
      description: "View your data on interactive maps",
      icon: "🗺️"
    }
  ];

  const geospatialUseCases = [
    { icon: '🧭', title: 'Navigation', desc: 'Turn‑by‑turn routing and ETA calculations.' },
    { icon: '🚚', title: 'Logistics', desc: 'Fleet tracking and route optimization.' },
    { icon: '🆘', title: 'Disaster Response', desc: 'Live hazard maps and resource allocation.' },
  ];

  const practiceSteps = [
    { title: 'Upload', description: 'Import .xlsx, .csv, or .json with coordinates.', icon: '📤' },
    { title: 'Clean & Transform', description: 'Normalize columns and convert to a consistent JSON schema.', icon: '🧹' },
    { title: 'Encrypt', description: 'Protect content with AES-256; optionally wrap keys with RSA.', icon: '🔐' },
    { title: 'Anchor on-chain', description: 'Store hashes/metadata immutably on Ethereum.', icon: '⛓️' },
    { title: 'Manage Access', description: 'Smart contracts control who can decrypt and view.', icon: '🛂' },
    { title: 'Visualize', description: 'Explore on interactive maps with filters and layers.', icon: '🗺️' },
    { title: 'Retrieve & Decrypt', description: 'Authorized users can fetch and decrypt securely.', icon: '🔓' }
  ];

  const keyFeatures = [
    {
      icon: '🔐',
      title: 'End-to-End Security',
      description: 'AES-256 data encryption with optional RSA key wrapping and on-chain integrity.'
    },
    {
      icon: '⛓️',
      title: 'Blockchain Anchoring',
      description: 'Tamper-proof references stored on Ethereum with verifiable hashes.'
    },
    {
      icon: '🗺️',
      title: 'Geospatial Visualization',
      description: 'Leaflet-powered interactive maps with markers, heatmaps, and layers.'
    },
    {
      icon: '🛂',
      title: 'Granular Access Control',
      description: 'Smart contracts manage who can decrypt and view each dataset.'
    },
    {
      icon: '⚡',
      title: 'Efficient Workflow',
      description: 'Client-side processing reduces gas costs and keeps sensitive data private.'
    },
    {
      icon: '🧩',
      title: 'Modular Architecture',
      description: 'React frontend, FastAPI backend, and Solidity contracts for clean separation.'
    }
  ];

  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={`${styles.container} ${darkMode ? styles.containerDark : ''}`}>
      {/* Hero Section */}
      <section className={`${styles.hero} ${darkMode ? styles.heroDark : ''}`}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              <span className={styles.titleMain}>Secure Geospatial</span>
              <span className={styles.titleAccent}>Blockchain</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Revolutionizing geospatial data management with cutting-edge blockchain technology, 
              military-grade encryption, and interactive visualization.
            </p>
            <div className={styles.heroButtons}>
              <Link to="/dashboard" className={styles.primaryButton}>Get Started</Link>
              <button type="button" onClick={openModal} className={styles.secondaryButton}>Watch Demo</button>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.floatingCard}>
              <div className={styles.cardIcon}>🗺️</div>
              <div className={styles.cardText}>Geospatial Data</div>
            </div>
            <div className={styles.floatingCard}>
              <div className={styles.cardIcon}>🔐</div>
              <div className={styles.cardText}>AES-256</div>
            </div>
            <div className={styles.floatingCard}>
              <div className={styles.cardIcon}>⛓️</div>
              <div className={styles.cardText}>Blockchain</div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{stats.filesProcessed.toLocaleString()}</div>
            <div className={styles.statLabel}>Files Processed</div>
            <div className={styles.statIcon}>📊</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{stats.dataPoints.toLocaleString()}</div>
            <div className={styles.statLabel}>Data Points</div>
            <div className={styles.statIcon}>📍</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{stats.usersConnected}</div>
            <div className={styles.statLabel}>Active Users</div>
            <div className={styles.statIcon}>👥</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{stats.blockchainTransactions}</div>
            <div className={styles.statLabel}>Blockchain TX</div>
            <div className={styles.statIcon}>⛓️</div>
          </div>
        </div>
      </section>

      <div className={styles.content}>

        {/* Video Modal */}
        {isModalOpen && (
          <div className={styles.modalOverlay} onClick={closeModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>Platform Demo</h3>
                <button className={styles.closeButton} onClick={closeModal} aria-label="Close demo">×</button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.modalIframeWrapper}>
                  <iframe
                    className={styles.modalIframe}
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title="Platform Demo"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Demo Section */}
        <section className={styles.demoSection} id="how-it-works">
          <h2 className={styles.sectionTitle}>🚀 How It Works</h2>
          <div className={styles.demoContainer}>
            <div className={styles.demoSteps}>
              {demoSteps.map((step, index) => (
                <div 
                  key={index}
                  className={`${styles.demoStep} ${activeDemo === index ? styles.active : ''}`}
                  onClick={() => setActiveDemo(index)}
                >
                  <div className={styles.stepNumber}>{index + 1}</div>
                  <div className={styles.stepContent}>
                    <div className={styles.stepIcon}>{step.icon}</div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.demoVisual}>
              <div className={styles.demoCard}>
                <div className={styles.demoIcon}>{demoSteps[activeDemo].icon}</div>
                <h3>{demoSteps[activeDemo].title}</h3>
                <p>{demoSteps[activeDemo].description}</p>
              </div>
            </div>
          </div>
        </section>

        {/* About / Documentation CTA */}
        <section className={styles.section}>
          <h2>📘 About & Documentation</h2>
          <p>
            Dive deeper into the architecture, setup, and design decisions behind this platform. Explore the
            repository documentation for step-by-step guides and technical details.
          </p>
          <a
            href="https://github.com/Bhimesh1/Secure_Geospatial_Blockchain"
            className={styles.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Documentation on GitHub
          </a>
        </section>

        <section className={styles.section}>
          <h2>🧠 What Is This Project?</h2>
          <p>This platform is designed to securely manage, encrypt, store, and share geospatial data using cutting-edge technology:</p>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔐</div>
              <h3>AES-256 + RSA Encryption</h3>
              <p>Military-grade encryption to secure your geospatial data</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⛓️</div>
              <h3>Blockchain Storage</h3>
              <p>Tamper-proof, decentralized storage on Ethereum</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📡</div>
              <h3>Interactive Maps</h3>
              <p>React + Leaflet for stunning geospatial visualization</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⚙️</div>
              <h3>Smart Backend</h3>
              <p>FastAPI + Web3.py for seamless blockchain integration</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>🌍 Why Geospatial Data?</h2>
          <p>Geospatial data is simply information tied to locations (latitude/longitude). It helps you:</p>

          <ul className={styles.reasonsList}>
            <li><strong>Locate</strong> assets, events, or people on a map.</li>
            <li><strong>Decide</strong> where to go or act using routes and proximity.</li>
            <li><strong>Coordinate</strong> responses across teams in real time.</li>
          </ul>

          <div className={styles.whyGrid}>
            {geospatialUseCases.map((u, i) => (
              <div key={i} className={styles.whyCard}>
                <div className={styles.whyIcon}>{u.icon}</div>
                <div>
                  <h4 className={styles.whyTitle}>{u.title}</h4>
                  <p className={styles.whyDesc}>{u.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h3>📉 Problems with traditional systems</h3>
          <ul className={styles.problemList}>
            <li>Prone to data leaks, tampering, and unauthorized access</li>
            <li>Lack of verifiability and end‑to‑end traceability</li>
            <li>Centralized servers create single points of failure</li>
          </ul>

          <div className={styles.scenarioCard}>
            <div className={styles.scenarioHeader}>🗺️ Real‑world scenario: Flood response</div>
            <div className={styles.scenarioBody}>
              <ol>
                <li>Teams upload geotagged incident reports (CSV/JSON).</li>
                <li>Data is encrypted and anchored on‑chain for integrity.</li>
                <li>Authorized responders view live maps and plan routes.</li>
                <li>Later, anyone can verify the data wasn’t altered.</li>
              </ol>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>🔐 Our Solution</h2>
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <div>Feature</div>
              <div>How We Do It</div>
            </div>
            <div className={styles.tableRow}>
              <div>Data Security</div>
              <div>AES-256 encryption (optional RSA for hybrid encryption)</div>
            </div>
            <div className={styles.tableRow}>
              <div>Data Integrity</div>
              <div>SHA-256 hashing and blockchain immutability</div>
            </div>
            <div className={styles.tableRow}>
              <div>Access Control</div>
              <div>Ethereum Smart Contract-based permission management</div>
            </div>
            <div className={styles.tableRow}>
              <div>Data Storage</div>
              <div>Only encrypted file hashes are stored on-chain — files stay local or in secure storage</div>
            </div>
            <div className={styles.tableRow}>
              <div>Visualization</div>
              <div>Leaflet.js maps with support for markers, heatmaps, and satellite views</div>
            </div>
            <div className={styles.tableRow}>
              <div>UI/UX</div>
              <div>Modern, responsive React frontend with dark mode toggle</div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>⚙️ Project Architecture</h2>
          <div className={styles.architecture}>
            <code>
              User → React Frontend → FastAPI Backend → Smart Contract on Ethereum<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ↑ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ↓<br/>
              &nbsp;&nbsp; Leaflet Map &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; AES + RSA Encryption<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ↑ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ↓<br/>
              Geospatial Data &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Blockchain Reference Storage
            </code>
          </div>
        </section>

        <section className={styles.section}>
          <h2>📊 Key Features</h2>
          <div className={styles.featureGrid}>
            {keyFeatures.map((f, i) => (
              <div key={i} className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2>💻 Technology Stack</h2>
          <div className={styles.techStack}>
            <div>
              <h3>Frontend</h3>
              <p>React, React Router, Leaflet.js, CSS Modules</p>
            </div>
            <div>
              <h3>Backend</h3>
              <p>Python, FastAPI, Web3.py, Pandas, PyCryptodome</p>
            </div>
            <div>
              <h3>Smart Contracts</h3>
              <p>Solidity, Hardhat, Ethers.js</p>
            </div>
            <div>
              <h3>Blockchain</h3>
              <p>Local Ethereum (Hardhat) or Goerli testnet</p>
            </div>
            <div>
              <h3>Encryption</h3>
              <p>AES-256 in CBC mode, RSA 2048-bit for key security</p>
            </div>
            <div>
              <h3>Visualization</h3>
              <p>Leaflet + Tile layers (OSM, Satellite, Terrain)</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>🔐 Security Features</h2>
          <ul>
            <li>AES encryption ensures confidentiality of data</li>
            <li>RSA encrypts AES keys for secure key exchange</li>
            <li>Data hashes stored on Ethereum cannot be changed or deleted</li>
            <li>Access to each data ID can be granted/revoked by the owner</li>
            <li>Users can verify data integrity using SHA-256</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>🧪 How It Works in Practice</h2>
          <div className={styles.processGrid}>
            {practiceSteps.map((s, idx) => (
              <div key={idx} className={styles.processCard}>
                <div className={styles.processBadge}>{idx + 1}</div>
                <div className={styles.processContent}>
                  <h4><span className={styles.processIcon}>{s.icon}</span>{s.title}</h4>
                  <p>{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2>🌗 Dark Mode + Accessibility</h2>
          <ul>
            <li>Built-in dark mode toggle using React Context</li>
            <li>Accessible color contrast & semantic HTML used</li>
            <li>Designed to be responsive and clean on all screen sizes</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>🚀 Deployment & Testing</h2>
          <ul>
            <li>Fully Dockerized setup (API + Frontend)</li>
            <li>Hardhat setup for local & Goerli Ethereum deployment</li>
            <li>Test suite included for backend & smart contracts</li>
          </ul>
        </section>

        {/* FAQ Section */}
        <section className={styles.faqSection}>
          <h2 className={styles.sectionTitle}>❓ Frequently Asked Questions</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqCard}>
              <h3>🔐 Is my data really secure?</h3>
              <p>Yes! We use AES-256 encryption (military-grade) combined with RSA for key security. Your data is encrypted before it even leaves your device.</p>
            </div>
            <div className={styles.faqCard}>
              <h3>⛓️ What's stored on the blockchain?</h3>
              <p>Only encrypted file hashes and metadata are stored on-chain. Your actual data files remain in your control, ensuring privacy and reducing costs.</p>
            </div>
            <div className={styles.faqCard}>
              <h3>💰 How much does it cost?</h3>
              <p>Our platform is free to use! You only pay for Ethereum gas fees when storing references on the blockchain (typically a few cents).</p>
            </div>
            <div className={styles.faqCard}>
              <h3>🗺️ What file formats are supported?</h3>
              <p>We support Excel (.xlsx), CSV, and JSON files. Our system automatically detects and processes geospatial coordinates from your data.</p>
            </div>
            <div className={styles.faqCard}>
              <h3>👥 Can I share my data with others?</h3>
              <p>Absolutely! You can grant or revoke access to your encrypted data using Ethereum wallet addresses through our smart contract system.</p>
            </div>
            <div className={styles.faqCard}>
              <h3>🔧 Do I need technical knowledge?</h3>
              <p>Not at all! Our intuitive interface makes it easy to upload, encrypt, and visualize your geospatial data without any technical expertise.</p>
            </div>
            <div className={styles.faqCard}>
              <h3>⚡ How does performance scale with large files?</h3>
              <p>Processing happens client-side before storing a compact reference on-chain. This keeps interactions fast and gas costs low.</p>
            </div>
            <div className={styles.faqCard}>
              <h3>🌐 Which browsers are supported?</h3>
              <p>Modern Chromium-based browsers, Firefox, and Safari are supported. For the best experience, keep your browser up to date.</p>
            </div>
            <div className={styles.faqCard}>
              <h3>🗄️ Where are my actual files stored?</h3>
              <p>Your files remain local or in your chosen storage. The blockchain stores only encrypted hashes and metadata for verification.</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>📚 Want to Explore the Code?</h2>
          <p>Visit our GitHub repository to see the full implementation:</p>
          <a href="https://github.com/Bhimesh1/Secure_Geospatial_Blockchain" className={styles.link} target="_blank" rel="noopener noreferrer">
            <span className={styles.linkIcon}>🔗</span>
            View on GitHub
          </a>
        </section>

        {/* Contact / Contribute */}
        <section className={styles.section}>
          <h2>🤝 Contact & Contribute</h2>
          <p>Have questions, suggestions, or want to contribute? Join the community and help improve the project.</p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a
              href="https://github.com/Bhimesh1/Secure_Geospatial_Blockchain/issues/new"
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open a GitHub Issue
            </a>
            <a
              href="https://github.com/Bhimesh1/Secure_Geospatial_Blockchain"
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Star the Repository ⭐
            </a>
          </div>
        </section>

        <section className={styles.section}>
          <h2>👋 Who Is This For?</h2>
          <p>This project is ideal for:</p>
          <div className={styles.audienceGrid}>
            <div className={styles.audienceCard}>
              <div className={styles.audienceIcon}>🔬</div>
              <h3>Researchers</h3>
              <p>Geospatial computing and blockchain researchers</p>
            </div>
            <div className={styles.audienceCard}>
              <div className={styles.audienceIcon}>💻</div>
              <h3>Developers</h3>
              <p>Building blockchain-secured applications</p>
            </div>
            <div className={styles.audienceCard}>
              <div className={styles.audienceIcon}>🏙️</div>
              <h3>Urban Planners</h3>
              <p>Smart cities and logistics professionals</p>
            </div>
            <div className={styles.audienceCard}>
              <div className={styles.audienceIcon}>🚨</div>
              <h3>Emergency Services</h3>
              <p>Disaster response and emergency management</p>
            </div>
          </div>
        </section>

        {/* Back To Top Button */}
        {showBackToTop && (
          <button className={styles.backToTop} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
            ↑
          </button>
        )}
      </div>
    </div>
  );
};

export default LearnMore;