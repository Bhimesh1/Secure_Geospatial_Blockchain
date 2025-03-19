# Secure Blockchain-Based Storage & Transmission of Encrypted Geospatial Data

## Overview

This project implements a comprehensive system for securely storing, managing, and sharing geospatial data. By combining advanced encryption techniques (AES-256 and RSA) with blockchain technology, the system ensures data confidentiality, integrity, and controlled access. The solution features a Python backend with FastAPI, Ethereum smart contracts for blockchain integration, and a React frontend for user-friendly interaction.

## Motivation

### Why is Secure Geospatial Data Storage Important?
- **Geospatial Data** (latitude, longitude, mapping coordinates) is critical for:
 - Navigation (Google Maps, GPS)
 - Logistics & Supply Chain
 - Disaster Management (Earthquake prediction, Flood zones)
 - Smart City Planning & IoT
- **Current Problems with Centralized Storage:**
 1. **Data Breaches & Unauthorized Access** – Traditional databases are vulnerable to hacking
 2. **Data Tampering** – Attackers can modify location data, leading to misinformation
 3. **Inefficiency of Encryption** – Encrypting large geospatial datasets requires high computational resources
 4. **Unauthorized Transmission** – Sensitive location data should be accessed only by verified users

### How Blockchain & Cryptography Solve These Issues
✔ **Blockchain** ensures **immutability** and **decentralization**, preventing data tampering  
✔ **AES & RSA Encryption** secure sensitive data before storage  
✔ **Smart Contracts** control access and enforce security policies automatically  

## Project Structure
* `backend/`: Python backend for API, blockchain interaction, and encryption
* `frontend/`: React.js frontend application
* `smart_contracts/`: Ethereum smart contracts written in Solidity
* `datasets/`: Raw and processed geospatial data
* `testing/`: Test scripts and plans
* `deployment/`: Deployment configurations

## Project Phases

### Phase A: Project Setup

**Files and Folders Created:**
- `Secure_Geospatial_Blockchain/` - Main project directory
- `backend/` - Directory for backend code
 - `api/` - API implementation
 - `blockchain/` - Blockchain interaction code
 - `encryption/` - Encryption modules
 - `data_processing/` - Data processing utilities
- `frontend/` - Frontend application directory
- `smart_contracts/` - Smart contracts code
 - `contracts/` - Solidity contracts
 - `scripts/` - Deployment scripts
 - `test/` - Contract tests
 - `hardhat.config.js` - Hardhat configuration
- `datasets/` - Storage for geospatial data
- `.gitignore` - Git ignore file
- `README.md` - Project documentation
- `requirements.txt` - Python dependencies

**Purpose:**
Establishing the project structure, setting up development environments, and installing necessary dependencies for all components.

### Phase B: Data Preparation

**Files and Folders Created:**
- `backend/data_processing/extract_data.py` - Data extraction module
- `process_data.py` - Data processing script
- `datasets/addresses.xlsx` - Sample geospatial data
- `datasets/processed_data.csv` - Cleaned CSV data
- `datasets/formatted_data.json` - Formatted JSON data

**Purpose:**
Implementing data extraction, cleaning, and transformation functionality for geospatial data, ensuring data quality and proper formatting for encryption.

### Phase C: Data Encryption

**Files and Folders Created:**
- `backend/encryption/__init__.py` - Package initialization
- `backend/encryption/aes_encryption.py` - AES encryption module
- `backend/encryption/rsa_encryption.py` - RSA key management
- `backend/encryption/encryption_utils.py` - Encryption utilities
- `encrypt_data.py` - Main encryption script
- `datasets/formatted_data.enc` - Encrypted data
- `datasets/formatted_data.key` - Encryption key
- `datasets/formatted_data.meta` - Encryption metadata

**Purpose:**
Creating secure encryption mechanisms for geospatial data using AES-256 for data encryption and RSA for key management, along with utilities for handling encrypted data.

### Phase D: Blockchain Smart Contract

**Files and Folders Created:**
- `smart_contracts/contracts/GeoDataStorage.sol` - Solidity smart contract
- `smart_contracts/scripts/deploy.js` - Contract deployment script
- `smart_contracts/scripts/store_hash.js` - Interaction script
- `smart_contracts/test/GeoDataStorage.test.js` - Contract tests

**Purpose:**
Developing a blockchain-based system for securely storing references to encrypted geospatial data, with access control mechanisms for data sharing and security.

### Phase E: Web3.py Integration

**Files and Folders Created:**
- `backend/blockchain/__init__.py` - Package initialization
- `backend/blockchain/config.py` - Web3 configuration
- `backend/blockchain/blockchain_service.py` - Blockchain interaction service
- `.env` - Environment configuration file
- `test_blockchain.py` - Blockchain testing script
- `store_encrypted_data.py` - Integrated storage script

**Purpose:**
Connecting the Python backend to the Ethereum blockchain, creating services to interact with the smart contract, and integrating encryption with blockchain storage.

### Phase F: FastAPI Development

**Files and Folders Created:**
- `backend/api/main.py` - FastAPI application
- `backend/api/routes/data_routes.py` - Data API endpoints
- `backend/api/routes/blockchain_routes.py` - Blockchain API endpoints
- `run.py` - Server runner script
- `test_api.py` - API testing script

**Purpose:**
Building a RESTful API that provides endpoints for file upload, encryption, blockchain storage, and access control, enabling frontend interaction with the backend services.

### Phase G: Frontend Development

**Files and Folders Created:**
- `frontend/secure-geo-blockchain/` - React application
- `frontend/secure-geo-blockchain/src/components/` - UI components
 - `layout/` - Layout components (Navbar, Sidebar, Footer)
 - `data/` - Data management components
 - `blockchain/` - Blockchain interaction components
 - `map/` - Map visualization components
- `frontend/secure-geo-blockchain/src/pages/` - Application pages
- `frontend/secure-geo-blockchain/src/services/` - API services
- `frontend/secure-geo-blockchain/src/App.js` - Main application component
- `frontend/secure-geo-blockchain/tailwind.config.js` - Tailwind CSS configuration

**Purpose:**
Creating a user-friendly interface for managing geospatial data, performing encryption, interacting with the blockchain, and visualizing data on interactive maps.

### Phase H: Testing & Deployment

**Files and Folders Created:**
- `testing/test_plan.md` - Testing strategy document
- `test_backend.py` - Backend testing script
- `testing/test_frontend.md` - Frontend testing guide
- `Dockerfile` - Backend Docker configuration
- `frontend/secure-geo-blockchain/Dockerfile` - Frontend Docker configuration
- `docker-compose.yml` - Multi-container setup
- `smart_contracts/scripts/deploy-goerli.js` - Testnet deployment script
- `deployment.md` - Deployment guide
- `deployment/nginx/` - NGINX configurations

**Purpose:**
Ensuring the application works correctly through comprehensive testing, and preparing it for production deployment with containerization and documentation.

## Features

- **Secure Encryption**: AES-256 encryption for data with optional RSA key management
- **Blockchain Storage**: Immutable, tamper-proof storage of encrypted data references
- **Access Control**: Granular permission management for data sharing
- **Data Visualization**: Interactive maps for geospatial data visualization
- **User-friendly Interface**: Modern React frontend for easy operation