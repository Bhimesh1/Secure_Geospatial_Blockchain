import requests
import json
import os
import time

BASE_URL = 'http://localhost:8001/api'


def test_upload_file():
    """Test file upload endpoint"""
    print("Testing file upload...")

    # Check if we have a sample file
    if not os.path.exists('datasets/addresses.xlsx'):
        print("Error: Sample file not found")
        return

    # Upload the file
    files = {'file': open('datasets/addresses.xlsx', 'rb')}
    response = requests.post(f'{BASE_URL}/data/upload', files=files)

    print(f"Status Code: {response.status_code}")
    print(f"Response content: {response.text}")

    try:
        json_response = response.json()
        print(json.dumps(json_response, indent=2))
        return json_response.get('processed_file')
    except json.JSONDecodeError:
        print("Error: Unable to decode JSON response")
        return None


def test_encrypt_data(file_name):
    """Test data encryption endpoint"""
    print("\nTesting data encryption...")

    # Encrypt the file
    data = {'file': file_name, 'use_rsa': False}
    response = requests.post(f'{BASE_URL}/data/encrypt', json=data)

    print(f"Status Code: {response.status_code}")
    print(json.dumps(response.json(), indent=2))

    return response.json().get('encrypted_file')


def test_store_on_blockchain(encrypted_file):
    """Test blockchain storage endpoint"""
    print("\nTesting blockchain storage...")

    # Store on blockchain
    data = {
        'encrypted_file': encrypted_file,
        'original_file': encrypted_file.replace('.enc', '')
    }
    response = requests.post(f'{BASE_URL}/blockchain/store', json=data)

    print(f"Status Code: {response.status_code}")
    print(json.dumps(response.json(), indent=2))

    return response.json().get('data_id')


def test_retrieve_from_blockchain(data_id):
    """Test blockchain retrieval endpoint"""
    print("\nTesting blockchain retrieval...")

    # Retrieve from blockchain
    response = requests.get(f'{BASE_URL}/blockchain/retrieve/{data_id}')

    print(f"Status Code: {response.status_code}")
    print(json.dumps(response.json(), indent=2))


def test_list_files():
    """Test file listing endpoint"""
    print("\nTesting file listing...")

    # List files
    response = requests.get(f'{BASE_URL}/data/files')

    print(f"Status Code: {response.status_code}")
    print(json.dumps(response.json(), indent=2))


def main():
    """Run the API tests"""
    # Test file upload
    processed_file = test_upload_file()

    if processed_file:
        # Test encryption
        encrypted_file = test_encrypt_data(processed_file)

        if encrypted_file:
            # Test blockchain storage
            data_id = test_store_on_blockchain(encrypted_file)

            # Wait a short time for the blockchain transaction to be processed
            time.sleep(2)

            if data_id:
                # Test blockchain retrieval
                test_retrieve_from_blockchain(data_id)

    # Test file listing
    test_list_files()


if __name__ == "__main__":
    main()