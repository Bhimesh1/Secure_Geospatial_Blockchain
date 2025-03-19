## Phase A: Project Setup

1. Create folder structure for the project:
    * mkdir -p Secure_Geospatial_Blockchain/{backend/{api,blockchain,encryption,data_processing},frontend,smart_contracts,datasets}
    * touch Secure_Geospatial_Blockchain/README.md

2. Setup Python virtual environment:
* Navigate to project directory: `cd Secure_Geospatial_Blockchain`
* Create virtual environment: `python -m venv venv`
* Activate virtual environment:
  * Windows: `venv\Scripts\activate`
  * macOS/Linux: `source venv/bin/activate`

3. Install required Python libraries:
* Create requirements.txt with needed dependencies:
  ```
  Flask==2.0.1
  fastapi==0.68.0
  uvicorn==0.15.0
  web3==5.24.0
  pycryptodome==3.10.1
  pandas==1.3.3
  openpyxl==3.0.9
  requests==2.26.0
  python-dotenv==0.19.1
  ```
* Install dependencies: `pip install -r requirements.txt`

4. Setup Hardhat for smart contract development:
* Navigate to smart_contracts directory: `cd smart_contracts`
* Initialize npm: `npm init -y`
* Install Hardhat: `npm install --save-dev hardhat @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers`
* Initialize Hardhat: `npx hardhat`

5. Initialize Git for version control:
* Navigate back to project root: `cd ..`
* Initialize Git: `git init`
* Create .gitignore file for Python and Node.js

## Phase B: Data Preparation

1. Create data processing scripts:
* Create extract_data.py in backend/data_processing/ for:
  * Reading Excel files containing geospatial data
  * Displaying dataset overview and structure
  * Cleaning and validating geographic coordinates
  * Converting data to CSV and JSON formats

2. Implement data cleaning functions:
* Check for missing values in latitude and longitude
* Validate coordinate ranges (latitude: -90 to 90, longitude: -180 to 180)
* Remove duplicate records
* Handle missing values appropriately

3. Convert data to structured formats:
* Save cleaned data to CSV for easy viewing and sharing
* Convert to structured JSON format with metadata for encryption
* Create consistent format with geospatial coordinates properly typed

4. Create driver script for data processing:
* Create process_data.py in project root to:
  * Import the data processing module
  * Execute the data extraction and cleaning pipeline
  * Output processing statistics and confirmation

5. Generate sample data (if needed):
* Create script to generate sample geospatial data for testing
* Include various coordinate types and metadata
* Save as Excel file in datasets directory

## Phase C: Data Encryption

1. Create encryption module structure:
* Create __init__.py in backend/encryption/
* Create specialized modules for different encryption methods:
  * aes_encryption.py for AES-256 encryption
  * rsa_encryption.py for RSA key management
  * encryption_utils.py for helper functions

2. Implement AES-256 encryption:
* Create AESCipher class with methods for:
  * Generating secure random keys
  * Encrypting data using AES-256 in CBC mode
  * Decrypting previously encrypted data
  * Saving and loading encrypted data to/from files

3. Implement RSA encryption for key management:
* Create RSACipher class with methods for:
  * Generating RSA key pairs
  * Loading and saving keys to/from files
  * Encrypting data (primarily AES keys) with RSA
  * Decrypting RSA-encrypted data

4. Create utility functions:
* Generate SHA-256 hashes for data integrity verification
* Create metadata for encrypted files
* Save encryption metadata to accompany encrypted files

5. Develop main encryption script:
* Create encrypt_data.py in project root that:
  * Accepts command line arguments for operation modes
  * Handles both encryption and decryption workflows
  * Supports AES-only or hybrid AES+RSA encryption
  * Generates and manages keys securely

## Phase D: Blockchain Smart Contract

1. Create a Solidity smart contract in smart_contracts/contracts directory:
* Create file: `GeoDataStorage.sol` with the following features:
  * Storage of encrypted data references (cipherHash and metadataHash)
  * Access control mechanisms using owner and permission mappings
  * Functions for storing, retrieving, and updating encrypted data
  * Functions for granting and revoking access to specific addresses
  * Events for data storage, access grants, and revocations

2. Set up the development environment:
* Update `hardhat.config.js` with network configurations:
  ```javascript
  require("@nomiclabs/hardhat-waffle");

  module.exports = {
    solidity: "0.8.4",
    networks: {
      hardhat: {
        chainId: 1337
      },
      localhost: {
        url: "http://127.0.0.1:8545",
        accounts: {
          mnemonic: "test test test test test test test test test test test junk",
        }
      }
    },
    paths: {
      artifacts: './artifacts',
      cache: './cache',
      sources: './contracts',
      tests: './test',
    },
  };
  ```
* Create deployment script in `scripts/deploy.js` to deploy the contract

3. Write comprehensive tests for the smart contract:
* Create test file: `test/GeoDataStorage.test.js` with test cases for:
  * Storing and retrieving encrypted data
  * Testing access control mechanisms
  * Testing data updates and management functions
  * Verifying event emissions
* Run tests: `npx hardhat test`

4. Deploy the contract to local network:
* Start local Ethereum node with test accounts: 
  ```
  npx hardhat node
  ```
* Deploy contract to the local network:
  ```
  npx hardhat run scripts/deploy.js --network localhost
  ```
* Note the deployed contract address for future interactions

5. Interact with the deployed contract:
* Create interaction script `scripts/store_hash.js` that:
  * Connects to the deployed contract
  * Stores sample encrypted data references
  * Retrieves the stored data to verify functionality
* Run the script:
  ```
  npx hardhat run scripts/store_hash.js --network localhost
  ```

6. Smart Contract Functions:
* `storeData(dataId, cipherHash, metadataHash)`: Store encrypted data reference
* `retrieveData(dataId)`: Retrieve encrypted data if authorized
* `grantAccess(dataId, grantee)`: Give another address access to your data
* `revokeAccess(dataId, revokee)`: Remove access for an address
* `checkAccess(dataId, addr)`: Check if an address has access to data
* `getAllDataIds()`: Get all data IDs stored in the contract
* `getMyDataIds()`: Get data IDs owned by the caller
* `updateData(dataId, cipherHash, metadataHash)`: Update existing data


## Phase E: Web3.py Integration

1. Created a Web3.py configuration module:
* Created `backend/blockchain/config.py` with the following components:
  * Environment variable loading with dotenv
  * Web3 connection initialization using HTTPProvider
  * Contract ABI loading from Hardhat artifacts
  * Contract instance creation with error handling
  * Functions to manage blockchain connectivity


2. Implemented a comprehensive blockchain service:
* Created `backend/blockchain/blockchain_service.py` with these features:
  * BlockchainService class for interacting with the smart contract
  * Transaction building and signing functionality
  * Methods to store encrypted data references on-chain
  * Methods to retrieve data from the blockchain
  * Access control implementation (grant/revoke)
  * Data ID generation and management
  * Error handling for contract interactions


3. Set up environment configuration:
* Created `.env` file in the project root with:
  ```
  BLOCKCHAIN_PROVIDER=http://127.0.0.1:8545
  CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3  # Your deployed contract address
  PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80  # Test account private key
  ```

4. Developed integration with encryption system:
* Created `store_encrypted_data.py` that:
  * Combines the encryption functionality from Phase C
  * Integrates with blockchain storage from Phase D
  * Provides a unified interface for encrypting and storing data
  * Implements secure reference storage on the blockchain
  * Creates a retrieval system for blockchain references


5. Implemented testing and verification:
* Created `test_blockchain.py` for:
  * Testing all blockchain operations
  * Verifying contract deployment
  * Validating data storage and retrieval
  * Testing access control mechanisms
  * Hash generation and verification


6. Created secure connection between systems:
* Implemented secure hashing for data integrity
* Created transaction signing for blockchain security
* Developed data ID generation for unique references
* Integrated error handling across components
* Set up proper access control through smart contracts


7. Running the integration:
* Start local Ethereum node: `npx hardhat node`
* Deploy contract: `npx hardhat run scripts/deploy.js --network localhost`
* Update `.env` with deployed contract address
* Test blockchain interaction: `python test_blockchain.py`
* Store encrypted data: `python store_encrypted_data.py --mode store --input datasets/formatted_data.json`
* Retrieve blockchain data: `python store_encrypted_data.py --mode retrieve --data-id <your-data-id>`


8. Functions implemented in the blockchain service:
* `store_encrypted_data(data_id, cipher_hash, metadata_hash)`: Store data reference on blockchain
* `retrieve_encrypted_data(data_id)`: Get data reference from blockchain
* `grant_access(data_id, grantee_address)`: Give address permission to access data
* `revoke_access(data_id, revokee_address)`: Remove access permissions
* `check_access(data_id, address)`: Check if address has access to data
* `get_all_data_ids()`: Get all data IDs in the contract
* `get_my_data_ids()`: Get data IDs owned by the caller









