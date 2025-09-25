# Deployment Guide

## Local Deployment

### Backend

1. Create and activate a virtual environment:
- `python -m venv venv`
- `source venv/bin/activate  # On Windows: venv\Scripts\activate`


2. Install dependencies:
- `pip install -r requirements.txt`


3. Start the backend server:
- `uvicorn backend.api.main:app --host 0.0.0.0 --port 8001`


### Blockchain

1. Install dependencies:
- `cd smart_contracts`
- `npm install`


2. Start a local Ethereum node:
- `npx hardhat node`


3. Deploy the smart contract:
- `npx hardhat run scripts/deploy.js --network localhost`


4. Note the contract address for configuration

### Frontend

1. Install dependencies:
- `cd frontend/secure-geo-blockchain`
- `npm install`


2. Start the development server:
- `npm start`


## Production Deployment

### Using Docker Compose

1. Make sure Docker and Docker Compose are installed

2. Create a `.env` file with necessary environment variables:
-     CONTRACT_ADDRESS=<Your deployed contract address>
      PRIVATE_KEY=<Your Ethereum private key>


3. Build and start the containers:
- `docker-compose up -d`


4. Access the application at http://your-server-ip

### Manual Deployment

#### Backend

1. Set up a Python environment on your server
2. Clone the repository and install dependencies
3. Configure environment variables
4. Use Gunicorn with Uvicorn workers for production:
   - `gunicorn -w 4 -k uvicorn.workers.UvicornWorker backend.api.main:app --bind 0.0.0.0:8001`

5. Set up NGINX as a reverse proxy (sample config provided in deployment/nginx/)

#### Frontend

1. Build the React application:
- `cd frontend/secure-geo-blockchain`
- `npm run build`
2. Serve the static files using NGINX (sample config provided in deployment/nginx/)

### Smart Contract Deployment to Test Network

1. Create an Infura account and get an API key
2. Fund your Ethereum address with Goerli ETH from a faucet
3. Set environment variables:
- `export INFURA_API_KEY=<Your Infura API key>`
- `export PRIVATE_KEY=<Your Ethereum private key without 0x prefix>`

4. Deploy the contract:
- `cd smart_contracts`
- `npx hardhat run scripts/deploy-goerli.js --network goerli`


5. Update your application's configuration with the new contract address





















