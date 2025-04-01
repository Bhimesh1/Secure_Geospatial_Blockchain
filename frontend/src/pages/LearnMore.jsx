import React from 'react';
import styles from './LearnMore.module.css';

const LearnMore = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.mainTitle}>🔍 Learn More About the Project</h1>
        <h2 className={styles.subtitle}>Secure Blockchain-Based Storage & Transmission of Encrypted Geospatial Data</h2>

        <section className={styles.section}>
          <h2>🧠 What Is This Project?</h2>
          <p>This platform is designed to securely manage, encrypt, store, and share geospatial data using cutting-edge technology:</p>
          <ul>
            <li>🔐 AES-256 + RSA Encryption to secure the data</li>
            <li>⛓ Blockchain (Ethereum) to store references to the encrypted files in a tamper-proof, decentralized way</li>
            <li>📡 React + Leaflet Maps to visualize geospatial data interactively</li>
            <li>⚙️ FastAPI + Web3.py to handle backend logic and smart contract interactions</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>🌍 Why Geospatial Data?</h2>
          <p>Geospatial data (latitude, longitude, coordinates) is critical in:</p>
          <ul>
            <li>GPS & Navigation (e.g., Google Maps)</li>
            <li>Logistics & Supply Chain Management</li>
            <li>Disaster Response (earthquake/flood mapping)</li>
            <li>Smart Cities & Urban Planning</li>
            <li>Military and Surveillance Systems</li>
          </ul>
          
          <h3>📉 Problem with traditional systems:</h3>
          <ul>
            <li>Prone to data leaks, tampering, and unauthorized access</li>
            <li>Lack of verifiability and traceability</li>
            <li>Often reliant on centralized servers</li>
          </ul>
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
          <ul className={styles.checkList}>
            <li>✅ Upload geospatial files (.xlsx, .csv, .json)</li>
            <li>✅ Clean and preprocess data</li>
            <li>✅ Encrypt files with AES-256 (and optionally RSA)</li>
            <li>✅ Store encrypted file reference on blockchain</li>
            <li>✅ Grant or revoke access to your data</li>
            <li>✅ View your data on an interactive map</li>
            <li>✅ See statistics like bounding box, region distribution</li>
            <li>✅ Toggle dark/light theme</li>
          </ul>
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
          <ol className={styles.steps}>
            <li>Upload a geospatial file</li>
            <li>Clean/transform it (convert to JSON)</li>
            <li>Encrypt using AES-256 (optionally RSA)</li>
            <li>Store encrypted reference on Ethereum blockchain</li>
            <li>Grant access to others using their Ethereum wallet</li>
            <li>View data and stats on an interactive map</li>
            <li>Retrieve + decrypt if you have access</li>
          </ol>
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

        <section className={styles.section}>
          <h2>📚 Want to Explore the Code?</h2>
          <p>Visit the GitHub repo:</p>
          <a href="https://github.com/Bhimesh1/Secure_Geospatial_Blockchain" className={styles.link} target="_blank" rel="noopener noreferrer">
            https://github.com/Bhimesh1/Secure_Geospatial_Blockchain
          </a>
        </section>

        <section className={styles.section}>
          <h2>👋 Who Is This For?</h2>
          <p>This project is ideal for:</p>
          <ul>
            <li>Researchers in geospatial computing</li>
            <li>Developers working on blockchain-secured applications</li>
            <li>Planners in smart cities, logistics, and emergency services</li>
            <li>Anyone interested in secure, decentralized data systems</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default LearnMore; 