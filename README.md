# Secure Blockchain-Based Storage & Transmission of Encrypted Geospatial Data

This project implements a secure system for storing and managing geospatial data using AES & RSA encryption combined with blockchain technology.

## Architecture

The system consists of three main components:
- **Backend API**: FastAPI-based server for data processing, encryption, and blockchain interaction
- **Smart Contract**: Ethereum smart contract for secure storage of encrypted data references
- **Frontend**: React application for user interaction with the system

## Features

- AES-256 encryption for geospatial data security
- RSA encryption for key management
- Blockchain-based storage with immutability guarantees
- Access control mechanisms for data sharing
- Geospatial data visualization
- User-friendly interface for all operations

## Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 14+
- Docker and Docker Compose (for containerized deployment)

### Development Setup

1. Clone the repository:
- `git clone https://github.com/Bhimesh1/Secure_Geospatial_Blockchain.git`
- `cd secure-geospatial-blockchain`


2. Set up the backend:
- `python -m venv venv`
- On MAC:
  - `source venv/bin/activate`  
- On Windows:
  - `venv\Scripts\activate`
- `pip install -r requirements.txt`


3. Set up the smart contract:
- `cd smart_contracts`
- `npm install`
- `npx hardhat compile`
- `npx hardhat node`  # Start a local Ethereum node


4. In a new terminal, deploy the contract:
- `cd smart_contracts`
- `npx hardhat run scripts/deploy.js --network localhost`


5. Set up the frontend:
- `cd frontend/secure-geo-blockchain`
- `npm install`


6. Create a `.env` file in the project root:
-      BLOCKCHAIN_PROVIDER=http://127.0.0.1:8545
       CONTRACT_ADDRESS=<Your contract address from step 4>
       PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80


7. Start the backend API:
- `uvicorn backend.api.main:app --reload --host 0.0.0.0 --port 8001`


8. Start the frontend development server:
- `cd frontend/secure-geo-blockchain`
- `npm start`


### Production Deployment with Docker

1. Build and run the containers:
- `docker-compose up -d`


2. The application will be available at:
- Frontend: http://localhost
- API: http://localhost:8001
- Ganache (Ethereum node): http://localhost:8545

## Usage

1. **Data Management**:
- Upload geospatial data files (Excel, CSV, JSON)
- Encrypt data using AES (optionally with RSA key encryption)
- Store encrypted data references on the blockchain

2. **Blockchain Interaction**:
- Retrieve data references from the blockchain
- Manage access control for data sharing
- Verify data integrity

3. **Visualization**:
- View geospatial data on interactive maps
- Filter and analyze location-based information

## Testing

Run backend tests:
- `python test_backend.py`


Run smart contract tests:
- `cd smart_contracts`
- `npx hardhat test`


See `testing/test_frontend.md` for manual frontend testing procedures.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- OpenZeppelin for smart contract security patterns
- React and Tailwind CSS for the frontend
- FastAPI for the backend API
- Ethereum for blockchain functionality


