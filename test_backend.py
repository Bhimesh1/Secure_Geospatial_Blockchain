import requests
import json
import os
import time

API_URL = "http://localhost:8001/api"


def test_file_upload():
    print("\n1. Testing file upload...")
    if not os.path.exists('datasets/addresses.xlsx'):
        print("Error: Test file not found. Please ensure 'addresses.xlsx' exists in the datasets directory.")
        return None

    files = {'file': open('datasets/addresses.xlsx', 'rb')}
    response = requests.post(f"{API_URL}/data/upload", files=files)

    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print("Success: File uploaded successfully.")
        return response.json().get('processed_file')
    else:
        print(f"Error: {response.text}")
        return None


def test_file_listing():
    print("\n2. Testing file listing...")
    response = requests.get(f"{API_URL}/data/files")

    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        files = response.json().get('files', [])
        print(f"Success: Found {len(files)} files.")
        for file in files[:5]:  # Show first 5 files
            print(f"  - {file['name']} ({file['size']} bytes)")
        return True
    else:
        print(f"Error: {response.text}")
        return False


def test_encryption(file_name):
    print(f"\n3. Testing encryption of {file_name}...")
    if not file_name:
        print("Error: No file to encrypt.")
        return None

    payload = {'file': file_name, 'use_rsa': False}
    response = requests.post(f"{API_URL}/data/encrypt", json=payload)

    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        encrypted_file = response.json().get('encrypted_file')
        print(f"Success: File encrypted as {encrypted_file}")
        return response.json()
    else:
        print(f"Error: {response.text}")
        return None


def test_blockchain_storage(encrypted_data):
    print("\n4. Testing blockchain storage...")
    if not encrypted_data:
        print("Error: No encrypted data to store.")
        return None

    payload = {
        'encrypted_file': encrypted_data.get('encrypted_file'),
        'original_file': encrypted_data.get('original_file')
    }
    response = requests.post(f"{API_URL}/blockchain/store", json=payload)

    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data_id = response.json().get('data_id')
        print(f"Success: Data stored on blockchain with ID: {data_id}")
        print(f"Transaction hash: {response.json().get('transaction_hash')}")
        return data_id
    else:
        print(f"Error: {response.text}")
        return None


def test_blockchain_retrieval(data_id):
    print(f"\n5. Testing blockchain retrieval for data ID: {data_id}...")
    if not data_id:
        print("Error: No data ID to retrieve.")
        return False

    response = requests.get(f"{API_URL}/blockchain/retrieve/{data_id}")

    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print("Success: Data retrieved from blockchain.")
        print(f"Cipher hash: {response.json().get('cipher_hash')}")
        print(f"Timestamp: {response.json().get('timestamp_readable')}")
        return True
    else:
        print(f"Error: {response.text}")
        return False


def test_access_control(data_id):
    print(f"\n6. Testing access control for data ID: {data_id}...")
    if not data_id:
        print("Error: No data ID for access control testing.")
        return False

    # Test address (change to a valid Ethereum address)
    test_address = "0x123456789abcdef123456789abcdef123456789a"

    # Check access (should be false initially)
    response = requests.get(f"{API_URL}/blockchain/access/check?data_id={data_id}&address={test_address}")
    print(f"Initial access check status: {response.status_code}")
    if response.status_code == 200:
        has_access = response.json().get('has_access')
        print(f"Initial access: {has_access}")
    else:
        print(f"Error checking access: {response.text}")
        return False

    # Grant access
    payload = {'data_id': data_id, 'address': test_address}
    response = requests.post(f"{API_URL}/blockchain/access/grant", json=payload)
    print(f"Grant access status: {response.status_code}")
    if response.status_code != 200:
        print(f"Error granting access: {response.text}")
        return False

    # Check access again (should be true now)
    response = requests.get(f"{API_URL}/blockchain/access/check?data_id={data_id}&address={test_address}")
    if response.status_code == 200:
        has_access = response.json().get('has_access')
        print(f"Access after granting: {has_access}")
        if not has_access:
            print("Error: Access should be granted but check returned false.")
            return False
    else:
        print(f"Error checking access: {response.text}")
        return False

    # Revoke access
    response = requests.post(f"{API_URL}/blockchain/access/revoke", json=payload)
    print(f"Revoke access status: {response.status_code}")
    if response.status_code != 200:
        print(f"Error revoking access: {response.text}")
        return False

    # Final access check (should be false again)
    response = requests.get(f"{API_URL}/blockchain/access/check?data_id={data_id}&address={test_address}")
    if response.status_code == 200:
        has_access = response.json().get('has_access')
        print(f"Access after revoking: {has_access}")
        if has_access:
            print("Error: Access should be revoked but check returned true.")
            return False
    else:
        print(f"Error checking access: {response.text}")
        return False

    print("Success: Access control tests passed.")
    return True


def run_tests():
    print("=== BACKEND API TESTING ===")

    # Test file upload
    processed_file = test_file_upload()

    # Test file listing
    test_file_listing()

    # Test encryption
    if processed_file:
        encrypted_data = test_encryption(processed_file)

        # Test blockchain storage
        if encrypted_data:
            data_id = test_blockchain_storage(encrypted_data)

            # Test blockchain retrieval
            if data_id:
                test_blockchain_retrieval(data_id)

                # Test access control
                test_access_control(data_id)


if __name__ == "__main__":
    run_tests()