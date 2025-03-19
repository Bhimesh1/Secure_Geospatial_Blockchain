import os
import json
import base64
import hashlib
from datetime import datetime


def generate_hash(data):
    """
    Generate SHA-256 hash for data integrity checks

    Args:
        data: String, bytes, or dictionary

    Returns:
        hex digest of SHA-256 hash
    """
    # Convert to string if it's a dictionary
    if isinstance(data, dict):
        data = json.dumps(data, sort_keys=True)

    # Convert to bytes if it's a string
    if isinstance(data, str):
        data = data.encode('utf-8')

    # Generate hash
    hash_obj = hashlib.sha256(data)
    return hash_obj.hexdigest()


def create_metadata(original_file, encrypted_file, hash_value):
    """
    Create metadata for the encrypted file

    Args:
        original_file: Path to the original data file
        encrypted_file: Path to the encrypted file
        hash_value: Hash of the original data

    Returns:
        metadata dictionary
    """
    return {
        "original_filename": os.path.basename(original_file),
        "encrypted_filename": os.path.basename(encrypted_file),
        "encryption_timestamp": datetime.now().isoformat(),
        "data_hash": hash_value,
        "encryption_method": "AES-256-CBC"
    }


def save_metadata(metadata, output_path):
    """
    Save metadata to a file

    Args:
        metadata: Metadata dictionary
        output_path: Path to save the metadata

    Returns:
        output path
    """
    with open(output_path, 'w') as f:
        json.dump(metadata, f, indent=2)

    return output_path