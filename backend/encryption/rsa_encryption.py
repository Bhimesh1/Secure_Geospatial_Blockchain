import os
import base64
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP
from Crypto.Hash import SHA256


class RSACipher:
    """
    RSA encryption for secure key management
    """

    def __init__(self, key_size=2048):
        """
        Initialize RSA cipher with optional key size
        """
        self.key_size = key_size
        self.private_key = None
        self.public_key = None

    def generate_key_pair(self):
        """
        Generate a new RSA key pair

        Returns:
            tuple: (private_key, public_key) as PEM strings
        """
        # Generate key pair
        key = RSA.generate(self.key_size)

        # Extract private and public keys
        self.private_key = key.export_key().decode('utf-8')
        self.public_key = key.publickey().export_key().decode('utf-8')

        return self.private_key, self.public_key

    def load_keys(self, private_key=None, public_key=None):
        """
        Load existing RSA keys

        Args:
            private_key: PEM string or path to private key file
            public_key: PEM string or path to public key file
        """
        # Load private key if provided
        if private_key:
            if os.path.isfile(private_key):
                with open(private_key, 'r') as f:
                    private_key = f.read()
            self.private_key = private_key

        # Load public key if provided
        if public_key:
            if os.path.isfile(public_key):
                with open(public_key, 'r') as f:
                    public_key = f.read()
            self.public_key = public_key

    def save_keys(self, private_key_path=None, public_key_path=None):
        """
        Save RSA keys to files

        Args:
            private_key_path: Path to save private key
            public_key_path: Path to save public key
        """
        if private_key_path and self.private_key:
            with open(private_key_path, 'w') as f:
                f.write(self.private_key)

        if public_key_path and self.public_key:
            with open(public_key_path, 'w') as f:
                f.write(self.public_key)

    def encrypt(self, data):
        """
        Encrypt data using the public key

        Args:
            data: String or bytes to encrypt

        Returns:
            base64 encoded encrypted data
        """
        if not self.public_key:
            raise ValueError("Public key not set. Generate or load a key pair first.")

        # Convert string to bytes if needed
        if isinstance(data, str):
            data = data.encode('utf-8')

        # Import the public key
        key = RSA.import_key(self.public_key)

        # Create cipher
        cipher = PKCS1_OAEP.new(key, hashAlgo=SHA256)

        # Encrypt data
        encrypted = cipher.encrypt(data)

        # Return base64 encoded encrypted data
        return base64.b64encode(encrypted).decode('utf-8')

    def decrypt(self, encrypted_data):
        """
        Decrypt data using the private key

        Args:
            encrypted_data: Base64 encoded encrypted data

        Returns:
            decrypted data as bytes
        """
        if not self.private_key:
            raise ValueError("Private key not set. Generate or load a key pair first.")

        # Decode base64 data
        encrypted = base64.b64decode(encrypted_data)

        # Import the private key
        key = RSA.import_key(self.private_key)

        # Create cipher
        cipher = PKCS1_OAEP.new(key, hashAlgo=SHA256)

        # Decrypt data
        decrypted = cipher.decrypt(encrypted)

        return decrypted


def encrypt_aes_key(aes_key, rsa_public_key=None):
    """
    Encrypt an AES key using RSA

    Args:
        aes_key: Base64 encoded AES key or bytes
        rsa_public_key: PEM encoded RSA public key

    Returns:
        base64 encoded encrypted AES key
    """
    # Decode AES key if it's base64 encoded
    if isinstance(aes_key, str):
        aes_key = base64.b64decode(aes_key)

    # Create RSA cipher
    rsa = RSACipher()

    if rsa_public_key:
        # Use provided public key
        rsa.load_keys(public_key=rsa_public_key)
    else:
        # Generate new key pair if no public key provided
        rsa.generate_key_pair()

    # Encrypt the AES key
    encrypted_key = rsa.encrypt(aes_key)

    return encrypted_key, rsa.public_key, rsa.private_key