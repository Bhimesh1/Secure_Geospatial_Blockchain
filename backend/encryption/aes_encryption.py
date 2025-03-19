import os
import json
import base64
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from Crypto.Random import get_random_bytes


class AESCipher:
    """
    AES-256 encryption for geospatial data
    """

    def __init__(self, key=None):
        """
        Initialize with a key or generate a new one
        """
        if key:
            # Use provided key (must be 32 bytes for AES-256)
            self.key = key if isinstance(key, bytes) else key.encode()
        else:
            # Generate a random 32-byte key for AES-256
            self.key = get_random_bytes(32)

    def encrypt_data(self, data):
        """
        Encrypt data using AES-256 in CBC mode

        Args:
            data: Dictionary or string to encrypt

        Returns:
            dict: Contains base64 encoded iv, ciphertext, and original key
        """
        # Convert data to JSON string if it's a dictionary
        if isinstance(data, dict):
            plaintext = json.dumps(data).encode('utf-8')
        else:
            plaintext = data.encode('utf-8') if isinstance(data, str) else data

        # Generate a random initialization vector (IV)
        iv = get_random_bytes(16)

        # Create cipher and encrypt
        cipher = AES.new(self.key, AES.MODE_CBC, iv)

        # Pad data to be a multiple of 16 bytes (AES block size)
        padded_data = pad(plaintext, AES.block_size)

        # Encrypt the data
        ciphertext = cipher.encrypt(padded_data)

        # Return base64 encoded values for safe storage and transmission
        result = {
            'iv': base64.b64encode(iv).decode('utf-8'),
            'ciphertext': base64.b64encode(ciphertext).decode('utf-8'),
            'key': base64.b64encode(self.key).decode('utf-8')
        }

        return result

    def decrypt_data(self, encrypted_data):
        """
        Decrypt data using AES-256 in CBC mode

        Args:
            encrypted_data: Dictionary containing iv, ciphertext, and key

        Returns:
            The decrypted data (dictionary if JSON, otherwise string/bytes)
        """
        # Decode base64 values
        iv = base64.b64decode(encrypted_data['iv'])
        ciphertext = base64.b64decode(encrypted_data['ciphertext'])

        # Create cipher for decryption
        cipher = AES.new(self.key, AES.MODE_CBC, iv)

        # Decrypt and remove padding
        padded_plaintext = cipher.decrypt(ciphertext)
        plaintext = unpad(padded_plaintext, AES.block_size)

        # Try to convert to JSON if it was originally a dictionary
        try:
            return json.loads(plaintext.decode('utf-8'))
        except (json.JSONDecodeError, UnicodeDecodeError):
            # Return as is if not JSON
            return plaintext

    def save_encrypted_data(self, encrypted_data, output_path):
        """
        Save encrypted data to a file
        """
        with open(output_path, 'w') as f:
            json.dump(encrypted_data, f, indent=2)

        return output_path

    def load_encrypted_data(self, input_path):
        """
        Load encrypted data from a file
        """
        with open(input_path, 'r') as f:
            return json.load(f)


def encrypt_json_file(input_path, output_path=None):
    """
    Encrypt a JSON file using AES-256

    Args:
        input_path: Path to the JSON file to encrypt
        output_path: Path to save the encrypted data (default: input_path + '.enc')

    Returns:
        tuple: (output_path, encryption_key)
    """
    if output_path is None:
        output_path = input_path + '.enc'

    # Load the JSON data
    try:
        with open(input_path, 'r') as f:
            data = json.load(f)
    except Exception as e:
        raise Exception(f"Error reading input file: {str(e)}")

    # Initialize AES cipher and encrypt
    cipher = AESCipher()
    encrypted_data = cipher.encrypt_data(data)

    # Save encrypted data
    cipher.save_encrypted_data(encrypted_data, output_path)

    return output_path, base64.b64encode(cipher.key).decode('utf-8')


def decrypt_json_file(input_path, key, output_path=None):
    """
    Decrypt an encrypted JSON file

    Args:
        input_path: Path to the encrypted file
        key: Base64 encoded encryption key or bytes
        output_path: Path to save the decrypted data (default: input_path - '.enc')

    Returns:
        tuple: (output_path, decrypted_data)
    """
    if output_path is None:
        output_path = input_path.replace('.enc', '') if input_path.endswith('.enc') else input_path + '.dec'

    # Decode key if needed
    if isinstance(key, str):
        key = base64.b64decode(key)

    # Initialize AES cipher with the provided key
    cipher = AESCipher(key)

    # Load encrypted data
    encrypted_data = cipher.load_encrypted_data(input_path)

    # Decrypt data
    decrypted_data = cipher.decrypt_data(encrypted_data)

    # Save decrypted data if it's a dictionary
    if isinstance(decrypted_data, dict):
        with open(output_path, 'w') as f:
            json.dump(decrypted_data, f, indent=2)

    return output_path, decrypted_data