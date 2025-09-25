import os
import sys
import time
import hashlib
import argparse
from pathlib import Path

# Add the project root directory to the Python path
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))

# Import modules
from backend.encryption.aes_encryption import encrypt_json_file
from backend.encryption.encryption_utils import generate_hash
from backend.blockchain.blockchain_service import BlockchainService


def store_on_blockchain(input_file, use_rsa=False):
    """
    Encrypt data and store reference on blockchain

    Args:
        input_file: Path to the JSON data file
        use_rsa: Whether to use RSA to encrypt the AES key

    Returns:
        tuple: (encrypted_file_path, key_path, data_id)
    """
    # Determine output paths
    output_dir = os.path.dirname(input_file) or '.'
    base_name = os.path.splitext(os.path.basename(input_file))[0]
    encrypted_file = os.path.join(output_dir, f"{base_name}.enc")
    key_file = os.path.join(output_dir, f"{base_name}.key")

    print(f"Encrypting {input_file}...")

    try:
        # 1. Encrypt the file
        encrypted_path, aes_key = encrypt_json_file(input_file, encrypted_file)

        # 2. Save the key (in a real-world scenario, store this securely)
        with open(key_file, 'w') as f:
            f.write(aes_key)

        # 3. Generate hashes for blockchain storage
        cipher_hash = generate_hash(open(encrypted_path, 'rb').read())
        metadata_hash = generate_hash({
            "original_file": os.path.basename(input_file),
            "encrypted_file": os.path.basename(encrypted_path),
            "timestamp": time.time()
        })

        print(f"File encrypted successfully:")
        print(f"  - Encrypted file: {encrypted_path}")
        print(f"  - Key file: {key_file}")

        # 4. Store on blockchain
        print("\nStoring reference on blockchain...")
        blockchain_service = BlockchainService()

        # Generate a unique data ID
        timestamp = int(time.time())
        data_id = blockchain_service.generate_data_id(os.path.basename(input_file), timestamp)

        # Store the data reference
        receipt = blockchain_service.store_encrypted_data(data_id, cipher_hash, metadata_hash)

        print(f"Data reference stored on blockchain:")
        print(f"  - Data ID: {data_id}")
        print(f"  - Transaction hash: {receipt.transactionHash.hex()}")

        return encrypted_path, key_file, data_id

    except Exception as e:
        print(f"Error: {str(e)}")
        return None, None, None


def retrieve_from_blockchain(data_id, output_dir=None):
    """
    Retrieve data reference from blockchain

    Args:
        data_id: Blockchain data identifier
        output_dir: Directory to save results

    Returns:
        dict: Data reference information
    """
    if output_dir is None:
        output_dir = os.getcwd()

    print(f"Retrieving data with ID {data_id} from blockchain...")

    try:
        # 1. Initialize blockchain service
        blockchain_service = BlockchainService()

        # 2. Retrieve data reference
        cipher_hash, metadata_hash, timestamp, owner = blockchain_service.retrieve_encrypted_data(data_id)

        # 3. Save reference information
        reference_info = {
            "data_id": data_id,
            "cipher_hash": cipher_hash,
            "metadata_hash": metadata_hash,
            "timestamp": timestamp,
            "timestamp_readable": time.ctime(timestamp),
            "owner": owner
        }

        # Save to file
        info_file = os.path.join(output_dir, f"{data_id}_blockchain_info.json")
        with open(info_file, 'w') as f:
            import json
            json.dump(reference_info, f, indent=2)

        print(f"Retrieved data reference from blockchain:")
        print(f"  - Cipher Hash: {cipher_hash}")
        print(f"  - Timestamp: {time.ctime(timestamp)}")
        print(f"  - Owner: {owner}")
        print(f"  - Info saved to: {info_file}")

        return reference_info

    except Exception as e:
        print(f"Error: {str(e)}")
        return None


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Encrypt data and store reference on blockchain')
    parser.add_argument('--mode', choices=['store', 'retrieve'], required=True, help='Operation mode')
    parser.add_argument('--input', help='Input file path (for store mode)')
    parser.add_argument('--data-id', help='Data ID to retrieve (for retrieve mode)')
    parser.add_argument('--output', help='Output directory')
    parser.add_argument('--rsa', action='store_true', help='Use RSA to encrypt the AES key')

    args = parser.parse_args()

    if args.mode == 'store':
        if not args.input:
            parser.error("Input file path (--input) is required for store mode")
        store_on_blockchain(args.input, args.rsa)
    else:  # retrieve
        if not args.data_id:
            parser.error("Data ID (--data-id) is required for retrieve mode")
        retrieve_from_blockchain(args.data_id, args.output)