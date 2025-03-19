import os
import sys
import hashlib
import time
from pathlib import Path

# Add the project root directory to the Python path
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))

# Import the blockchain service
from backend.blockchain.blockchain_service import BlockchainService


def hash_file(file_path):
    """
    Generate SHA-256 hash for a file

    Args:
        file_path: Path to the file

    Returns:
        hex digest of SHA-256 hash
    """
    sha256_hash = hashlib.sha256()

    with open(file_path, "rb") as f:
        # Read and update hash in chunks
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)

    return sha256_hash.hexdigest()


def test_blockchain_operations():
    """Test blockchain operations using BlockchainService"""

    print("Initializing blockchain service...")
    blockchain_service = BlockchainService()

    # Generate unique data ID
    timestamp = int(time.time())
    data_id = blockchain_service.generate_data_id("test_file.enc", timestamp)
    print(f"Generated data ID: {data_id}")

    # Create sample hashes (in a real scenario, these would be file hashes)
    if os.path.exists("datasets/formatted_data.enc"):
        cipher_hash = hash_file("datasets/formatted_data.enc")
    else:
        # Sample hash if file doesn't exist
        cipher_hash = hashlib.sha256("sample_encrypted_data".encode()).hexdigest()

    metadata_hash = hashlib.sha256("sample_metadata".encode()).hexdigest()

    # Store data on blockchain
    print("\nStoring data on blockchain...")
    try:
        receipt = blockchain_service.store_encrypted_data(data_id, cipher_hash, metadata_hash)
        print(f"Transaction successful! Gas used: {receipt.gasUsed}")
    except Exception as e:
        print(f"Error: {str(e)}")
        return

    # Retrieve data from blockchain
    print("\nRetrieving data from blockchain...")
    try:
        result = blockchain_service.retrieve_encrypted_data(data_id)
        print(f"Cipher Hash: {result[0]}")
        print(f"Metadata Hash: {result[1]}")
        print(f"Timestamp: {result[2]} ({time.ctime(result[2])})")
        print(f"Owner: {result[3]}")
    except Exception as e:
        print(f"Error: {str(e)}")

    # Get all data IDs
    print("\nGetting all data IDs...")
    try:
        all_ids = blockchain_service.get_all_data_ids()
        print(f"All Data IDs: {all_ids}")
    except Exception as e:
        print(f"Error: {str(e)}")

    # Get my data IDs
    print("\nGetting my data IDs...")
    try:
        my_ids = blockchain_service.get_my_data_ids()
        print(f"My Data IDs: {my_ids}")
    except Exception as e:
        print(f"Error: {str(e)}")

    print("\nBlockchain integration tests completed!")


if __name__ == "__main__":
    test_blockchain_operations()