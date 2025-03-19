import os
import sys
import json
import base64
import argparse

# Add the project root directory to the Python path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(BASE_DIR)

# Import encryption modules
from backend.encryption.aes_encryption import encrypt_json_file, decrypt_json_file
from backend.encryption.rsa_encryption import encrypt_aes_key
from backend.encryption.encryption_utils import generate_hash, create_metadata, save_metadata


def encrypt_geospatial_data(input_file, output_dir=None, use_rsa=False):
    """
    Encrypt geospatial data and save the results

    Args:
        input_file: Path to the JSON data file
        output_dir: Directory to save encrypted files (default: same as input)
        use_rsa: Whether to use RSA to encrypt the AES key

    Returns:
        tuple: (encrypted_file_path, key_path, metadata_path)
    """
    # Determine output directory
    if output_dir is None:
        output_dir = os.path.dirname(input_file) or '.'

    # Make sure output directory exists
    os.makedirs(output_dir, exist_ok=True)

    # Determine output paths
    base_name = os.path.splitext(os.path.basename(input_file))[0]
    encrypted_file = os.path.join(output_dir, f"{base_name}.enc")
    key_file = os.path.join(output_dir, f"{base_name}.key")
    metadata_file = os.path.join(output_dir, f"{base_name}.meta")

    # Generate hash of original data
    with open(input_file, 'r') as f:
        original_data = json.load(f)
    data_hash = generate_hash(original_data)

    print(f"Encrypting {input_file}...")

    # Encrypt the JSON file
    encrypted_path, aes_key = encrypt_json_file(input_file, encrypted_file)

    if use_rsa:
        # Encrypt the AES key with RSA
        print("Using RSA to encrypt the AES key...")
        encrypted_key, public_key, private_key = encrypt_aes_key(aes_key)

        # Save keys
        key_data = {
            "encrypted_aes_key": encrypted_key,
            "rsa_public_key": public_key,
            "rsa_private_key": private_key  # In production, store this securely!
        }
        with open(key_file, 'w') as f:
            json.dump(key_data, f, indent=2)
    else:
        # Save AES key directly (in production, store this securely!)
        with open(key_file, 'w') as f:
            f.write(aes_key)

    # Create and save metadata
    metadata = create_metadata(input_file, encrypted_file, data_hash)
    save_metadata(metadata, metadata_file)

    print(f"Encryption complete:")
    print(f"  - Encrypted file: {encrypted_file}")
    print(f"  - Key file: {key_file}")
    print(f"  - Metadata: {metadata_file}")

    return encrypted_file, key_file, metadata_file


def decrypt_geospatial_data(encrypted_file, key_file, output_file=None):
    """
    Decrypt geospatial data

    Args:
        encrypted_file: Path to the encrypted file
        key_file: Path to the key file
        output_file: Path to save decrypted data (default: original filename)

    Returns:
        tuple: (decrypted_file_path, decrypted_data)
    """
    # Determine output file path
    if output_file is None:
        base_name = os.path.splitext(os.path.basename(encrypted_file))[0]
        output_file = os.path.join(os.path.dirname(encrypted_file), f"{base_name}.dec.json")

    print(f"Decrypting {encrypted_file}...")

    # Read the key file
    with open(key_file, 'r') as f:
        content = f.read()

        # Check if it's a JSON (RSA-encrypted key)
        try:
            key_data = json.loads(content)
            # TODO: Implement RSA decryption of the AES key
            raise NotImplementedError("RSA key decryption not implemented in this script")
        except json.JSONDecodeError:
            # Plain AES key
            key = content

    # Decrypt the file
    decrypted_path, decrypted_data = decrypt_json_file(encrypted_file, key, output_file)

    print(f"Decryption complete:")
    print(f"  - Decrypted file: {decrypted_path}")

    return decrypted_path, decrypted_data


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Encrypt or decrypt geospatial data')
    parser.add_argument('--mode', choices=['encrypt', 'decrypt'], required=True, help='Operation mode')
    parser.add_argument('--input', required=True, help='Input file path')
    parser.add_argument('--key', help='Key file path (for decryption)')
    parser.add_argument('--output', help='Output file/directory')
    parser.add_argument('--rsa', action='store_true', help='Use RSA to encrypt the AES key')

    args = parser.parse_args()

    if args.mode == 'encrypt':
        encrypt_geospatial_data(args.input, args.output, args.rsa)
    else:  # decrypt
        if not args.key:
            parser.error("Key file path (--key) is required for decryption")
        decrypt_geospatial_data(args.input, args.key, args.output)