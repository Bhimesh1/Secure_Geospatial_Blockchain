# Secure Blockchain-Based Storage & Transmission of Encrypted Geospatial Data

This project implements a blockchain-based system for securely storing and transmitting encrypted geospatial data using AES and RSA encryption, Ethereum smart contracts, and a React frontend.

## Project Structure
* `backend/`: Python backend for API, blockchain interaction, and encryption
* `frontend/`: React.js frontend application
* `smart_contracts/`: Ethereum smart contracts written in Solidity
* `datasets/`: Raw and processed geospatial data

## Setup Instructions

## Running the Project

### Phase A: Project Setup
1. Clone the repository and navigate to the project directory:
* `git clone <repository-url>`
* `cd Secure_Geospatial_Blockchain`


2. Create and activate a Python virtual environment:
* `python -m venv venv`
* Windows: `venv\Scripts\activate`
* macOS/Linux: `source venv/bin/activate`

```
Install required dependencies: pip install Flask fastapi uvicorn web3 pycryptodome pandas openpyxl requests python-dotenv
```


3. Set up Hardhat for smart contract development:
* `cd smart_contracts`
* `npm install --save-dev hardhat @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers`
* `npx hardhat`

### Phase B: Data Preparation
1. Place your geospatial data in Excel format in the datasets directory, or run the sample data generator:
* `python create_sample_data.py`


2. Process the geospatial data:
* `python process_data.py`

 
      This will:
         - Extract data from the Excel file
         - Clean and validate coordinates
         - Save CSV and JSON versions in the datasets directory


### Phase C: Data Encryption
1. Encrypt your processed geospatial data using AES-256:
* Basic AES encryption
  * `python encrypt_data.py --mode encrypt --input datasets/formatted_data.json`
* With RSA key encryption (recommended for production)
  * `python encrypt_data.py --mode encrypt --input datasets/formatted_data.json --rsa`


2. Decrypt the data (if needed):
* `python encrypt_data.py --mode decrypt --input datasets/formatted_data.enc --key datasets/formatted_data.key`


### Phase D: Blockchain Smart Contract
1. Start a local Ethereum node for development:
* `cd smart_contracts`
* `npx hardhat node`


2. In a new terminal, deploy the smart contract:
* `cd smart_contracts`
* `npx hardhat run scripts/deploy.js --network localhost`
   
      Copy the deployed contract address for the next step.


3. Store encrypted data reference on the blockchain:
* Edit the `scripts/store_hash.js` file and replace "YOUR_CONTRACT_ADDRESS" with the address from step 2
* Run the script:
  * `npx hardhat run scripts/store_hash.js --network localhost`

4. Run smart contract tests to verify functionality:
* `npx hardhat test`


## Phase E: Web3.py Integration

1. First, create a `.env` file in the project root with your blockchain configuration:

         BLOCKCHAIN_PROVIDER=http://127.0.0.1:8545
         CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3  # Update with your deployed address
         PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 # First test account from Hardhat


2. Ensure a local Ethereum node is running (from Phase D):
* `cd smart_contracts`
* `npx hardhat node`


3. Test the blockchain integration:
* `python test_blockchain.py`


4. Store encrypted data on the blockchain:
* `python store_encrypted_data.py --mode store --input datasets/formatted_data.json`


5. Retrieve data reference from the blockchain:
* `python store_encrypted_data.py --mode retrieve --data-id <data-id-from-store-operation>`











## Project Progress

### Completed:

#### Phase A: Project Setup
- ✅ Created project folder structure
- ✅ Set up Python virtual environment
- ✅ Installed required libraries
- ✅ Initialized Hardhat for smart contracts
- ✅ Set up Git for version control

#### Phase B: Data Preparation
- ✅ Extracted geospatial data from Excel
- ✅ Converted data to CSV and JSON formats
- ✅ Implemented data cleaning and validation
- ✅ Created structured JSON data for encryption

#### Phase C: Data Encryption
- ✅ Implemented AES-256 encryption for geospatial data
- ✅ Implemented RSA encryption for AES key management
- ✅ Created utility functions for hashing and metadata generation
- ✅ Developed scripts for encryption and decryption
- ✅ Generated encrypted data files ready for blockchain storage

### Next Steps:
- Phase D: Implementing blockchain smart contracts
- Phase E: Web3.py integration for blockchain interaction
- Phase F: Flask API development
- Phase G: Frontend development
- Phase H: Testing and deployment

## Project Motivation
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

## Project Objectives
### Primary Objectives
✅ **Develop** a blockchain-based encrypted storage system for geospatial data  
✅ **Implement** **AES & RSA encryption** before storing data on the blockchain  
✅ **Analyze** encryption performance to determine efficiency  
✅ **Ensure** secure retrieval & **access control mechanisms**  

### Secondary Objectives
✅ Explore **Proof-of-Location protocols** (FOAM) for verifying geospatial authenticity  
✅ Compare **traditional vs. blockchain-based** storage for security & performance  
✅ Investigate **hybrid cryptographic techniques** for scalability  

## Technologies & Tools Used
### Backend (Python)
- **Flask/FastAPI** → API for data encryption & blockchain interaction
- **Web3.py** → Python interface to interact with Ethereum blockchain
- **PyCryptodome** → AES & RSA encryption library
- **Pandas/OpenPyXL** → Process geospatial data

### Blockchain (Solidity)
- **Ethereum Smart Contracts** → Stores encrypted geospatial data reference
- **Hardhat/Truffle** → Deploy & test smart contracts
- **IPFS (Optional)** → Decentralized storage for encrypted data

### Frontend (React.js)
- **Web3.js** → Connects UI to smart contract
- **Axios** → Calls Flask API for encryption & retrieval
- **TailwindCSS + ShadCN** → UI Framework

## Project Implementation
The implementation is divided into 8 phases:

### Phase A: Project Setup
- Create folder structure
- Setup Python virtual environment and install required libraries
- Setup Hardhat for Smart Contracts
- Initialize Git for version control

### Phase B: Data Preparation
- Extract geospatial data from Excel files
- Convert to CSV/JSON format
- Validate and clean data
- Structure data for encryption

### Phase C: Data Encryption
- Implement AES-256 encryption
- Implement RSA for secure key management
- Create utility functions for hashing and verification
- Develop encryption/decryption scripts

### Phase D: Blockchain Smart Contract (Upcoming)
- Write Solidity Smart Contract for data storage
- Implement access control mechanisms
- Deploy and test on local development network

### Phase E: Web3.py Integration (Upcoming)
- Setup Web3.py configuration
- Connect Python backend to Ethereum blockchain
- Implement blockchain interaction functions

### Phase F: Flask API Development (Upcoming)
- Develop API endpoints for data storage and retrieval
- Implement authentication and security measures
- Test API functionality

### Phase G: Frontend Development (Upcoming)
- Build React.js dashboard
- Implement Web3.js for blockchain interaction
- Create user interface for data upload, encryption, and retrieval

### Phase H: Testing & Deployment (Upcoming)
- End-to-end testing of the system
- Deploy smart contracts to test network
- Deploy backend API
- Deploy frontend application

## Usage
Detailed usage instructions will be provided upon completion of the project.
