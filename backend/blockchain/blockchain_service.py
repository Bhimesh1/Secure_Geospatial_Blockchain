import json
import hashlib
from web3 import Web3
from web3.exceptions import ContractLogicError
from .config import get_contract, get_web3, PRIVATE_KEY


class BlockchainService:
    """Service for interacting with the blockchain smart contract"""

    def __init__(self):
        """Initialize the blockchain service"""
        self.contract, self.web3 = get_contract()

        # Set up the account for transaction signing
        if PRIVATE_KEY:
            self.account = self.web3.eth.account.from_key(PRIVATE_KEY)
            print(f"Using account: {self.account.address}")
        else:
            self.account = None
            print("Warning: No private key provided. Only read operations will work.")

    def _build_txn(self, function):
        """Build a transaction for contract interaction"""
        if not self.account:
            raise ValueError("Private key not set, cannot create transaction")

        # Get nonce for the account
        nonce = self.web3.eth.get_transaction_count(self.account.address)

        # Build the transaction
        txn = function.buildTransaction({
            'from': self.account.address,
            'nonce': nonce,
            'gas': 2000000,
            'gasPrice': self.web3.toWei('50', 'gwei')
        })

        return txn

    def _sign_and_send_txn(self, txn):
        """Sign and send a transaction"""
        # Sign the transaction
        signed_txn = self.web3.eth.account.sign_transaction(txn, PRIVATE_KEY)

        # Send the transaction
        tx_hash = self.web3.eth.send_raw_transaction(signed_txn.rawTransaction)

        # Wait for transaction receipt
        tx_receipt = self.web3.eth.wait_for_transaction_receipt(tx_hash)

        return tx_receipt

    def generate_data_id(self, original_file, timestamp):
        """Generate a unique data ID based on file name and timestamp"""
        combined = f"{original_file}_{timestamp}"
        return hashlib.sha256(combined.encode()).hexdigest()[:32]

    def store_encrypted_data(self, data_id, cipher_hash, metadata_hash):
        """
        Store encrypted data reference on the blockchain

        Args:
            data_id: Unique identifier for the data
            cipher_hash: Hash of the encrypted data file
            metadata_hash: Hash of the metadata file

        Returns:
            transaction receipt
        """
        try:
            # Call the storeData function on the smart contract
            store_function = self.contract.functions.storeData(data_id, cipher_hash, metadata_hash)

            # Build transaction
            txn = self._build_txn(store_function)

            # Sign and send transaction
            tx_receipt = self._sign_and_send_txn(txn)

            print(f"Data stored on blockchain. Transaction hash: {tx_receipt.transactionHash.hex()}")
            return tx_receipt

        except ContractLogicError as e:
            # Handle contract-specific errors
            error_msg = str(e)
            if "Data ID already exists" in error_msg:
                print(f"Error: Data ID '{data_id}' already exists on the blockchain")
            else:
                print(f"Contract error: {error_msg}")
            raise

        except Exception as e:
            print(f"Error storing data on blockchain: {str(e)}")
            raise

    def retrieve_encrypted_data(self, data_id):
        """
        Retrieve encrypted data reference from the blockchain

        Args:
            data_id: Unique identifier for the data

        Returns:
            tuple: (cipher_hash, metadata_hash, timestamp, owner)
        """
        try:
            # Call the retrieveData function on the smart contract
            result = self.contract.functions.retrieveData(data_id).call()

            # Parse the result
            cipher_hash = result[0]
            metadata_hash = result[1]
            timestamp = result[2]
            owner = result[3]

            return cipher_hash, metadata_hash, timestamp, owner

        except ContractLogicError as e:
            # Handle contract-specific errors
            error_msg = str(e)
            if "Data not found" in error_msg:
                print(f"Error: Data ID '{data_id}' not found on the blockchain")
            elif "Not authorized" in error_msg:
                print(f"Error: Not authorized to access data ID '{data_id}'")
            else:
                print(f"Contract error: {error_msg}")
            raise

        except Exception as e:
            print(f"Error retrieving data from blockchain: {str(e)}")
            raise

    def grant_access(self, data_id, grantee_address):
        """
        Grant access to data for a specific address

        Args:
            data_id: Unique identifier for the data
            grantee_address: Ethereum address to grant access to

        Returns:
            transaction receipt
        """
        try:
            # Ensure address is checksum format
            grantee_address = Web3.toChecksumAddress(grantee_address)

            # Call the grantAccess function on the smart contract
            grant_function = self.contract.functions.grantAccess(data_id, grantee_address)

            # Build transaction
            txn = self._build_txn(grant_function)

            # Sign and send transaction
            tx_receipt = self._sign_and_send_txn(txn)

            print(f"Access granted to {grantee_address} for data ID {data_id}")
            return tx_receipt

        except Exception as e:
            print(f"Error granting access: {str(e)}")
            raise

    def revoke_access(self, data_id, revokee_address):
        """
        Revoke access to data for a specific address

        Args:
            data_id: Unique identifier for the data
            revokee_address: Ethereum address to revoke access from

        Returns:
            transaction receipt
        """
        try:
            # Ensure address is checksum format
            revokee_address = Web3.toChecksumAddress(revokee_address)

            # Call the revokeAccess function on the smart contract
            revoke_function = self.contract.functions.revokeAccess(data_id, revokee_address)

            # Build transaction
            txn = self._build_txn(revoke_function)

            # Sign and send transaction
            tx_receipt = self._sign_and_send_txn(txn)

            print(f"Access revoked from {revokee_address} for data ID {data_id}")
            return tx_receipt

        except Exception as e:
            print(f"Error revoking access: {str(e)}")
            raise

    def check_access(self, data_id, address):
        """
        Check if an address has access to data

        Args:
            data_id: Unique identifier for the data
            address: Ethereum address to check

        Returns:
            bool: True if address has access, False otherwise
        """
        try:
            # Ensure address is checksum format
            address = Web3.toChecksumAddress(address)

            # Call the checkAccess function on the smart contract
            has_access = self.contract.functions.checkAccess(data_id, address).call()

            return has_access

        except Exception as e:
            print(f"Error checking access: {str(e)}")
            raise

    def get_all_data_ids(self):
        """
        Get all data IDs stored in the contract

        Returns:
            list: List of data IDs
        """
        try:
            # Call the getAllDataIds function on the smart contract
            data_ids = self.contract.functions.getAllDataIds().call()

            return data_ids

        except Exception as e:
            print(f"Error getting all data IDs: {str(e)}")
            raise

    def get_my_data_ids(self):
        """
        Get data IDs owned by the caller

        Returns:
            list: List of data IDs owned by the caller
        """
        try:
            # Call the getMyDataIds function on the smart contract
            data_ids = self.contract.functions.getMyDataIds().call({'from': self.account.address})

            return data_ids

        except Exception as e:
            print(f"Error getting my data IDs: {str(e)}")
            raise