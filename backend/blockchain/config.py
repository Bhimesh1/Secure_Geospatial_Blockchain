import os
import json
from pathlib import Path
from web3 import Web3
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get project base directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Blockchain network configuration
BLOCKCHAIN_PROVIDER = os.getenv('BLOCKCHAIN_PROVIDER', 'http://127.0.0.1:8545')
CONTRACT_ADDRESS = os.getenv('CONTRACT_ADDRESS', '')  # Fill this from deployment
PRIVATE_KEY = os.getenv('PRIVATE_KEY', '')  # Account private key for signing transactions


# Initialize Web3 connection
def get_web3():
    """Initialize and return Web3 instance"""
    return Web3(Web3.HTTPProvider(BLOCKCHAIN_PROVIDER))


# Load contract ABI from artifact file
def load_contract_abi():
    """Load the contract ABI from the Hardhat artifacts"""
    artifact_path = BASE_DIR / 'smart_contracts' / 'artifacts' / 'contracts' / 'GeoDataStorage.sol' / 'GeoDataStorage.json'

    try:
        with open(artifact_path) as f:
            contract_json = json.load(f)
            return contract_json['abi']
    except FileNotFoundError:
        print(f"Error: Contract artifact not found at {artifact_path}")
        print("Did you compile the contract with 'npx hardhat compile'?")
        raise
    except KeyError:
        print(f"Error: Invalid contract artifact format, 'abi' key not found")
        raise
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON in contract artifact")
        raise
    except Exception as e:
        print(f"Unexpected error loading contract ABI: {str(e)}")
        raise


# Get contract instance
def get_contract():
    """Get the deployed contract instance"""
    web3 = get_web3()

    # Ensure we have a contract address
    if not CONTRACT_ADDRESS:
        raise ValueError("Contract address not set in environment variables")

    try:
        # Check if web3 is connected
        print(f"Connected to blockchain: {web3.isConnected()}")
        print(f"Current block number: {web3.eth.block_number}")

        # Get contract ABI
        abi = load_contract_abi()

        # Create contract instance
        contract_address = Web3.toChecksumAddress(CONTRACT_ADDRESS)
        print(f"Using contract at address: {contract_address}")
        contract = web3.eth.contract(address=contract_address, abi=abi)

        return contract, web3
    except Exception as e:
        print(f"Error connecting to contract: {str(e)}")
        raise