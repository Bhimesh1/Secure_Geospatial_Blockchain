import requests
import json
import os
import time

API_URL = "http://localhost:8001/api"


def timed_request(label, func, *args, **kwargs):
    """Helper: time any call to requests and print elapsed."""
    start = time.time()
    resp = func(*args, **kwargs)
    elapsed = time.time() - start
    print(f"⏱ {label} took {elapsed:.3f}s")
    return resp


def test_file_upload():
    print("\n1. Testing file upload...")
    if not os.path.exists('../datasets/Addresses.xlsx'):
        print("Error: Test file not found. Please ensure 'addresses.xlsx' exists in the datasets directory.")
        return None

    files = {'file': open('../datasets/Addresses.xlsx', 'rb')}
    response = timed_request("Upload", requests.post, f"{API_URL}/data/upload", files=files)

    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        processed = response.json().get('processed_file')
        print("✔ File uploaded & processed successfully.")
        return processed
    else:
        print(f"Error: {response.text}")
        return None


def test_file_listing():
    print("\n2. Testing file listing...")
    response = timed_request("List files", requests.get, f"{API_URL}/data/files")

    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        files = response.json().get('files', [])
        print(f"✔ Found {len(files)} files.")
        for file in files[:5]:
            print(f"  • {file['name']} ({file['size']} bytes)")
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
    response = timed_request("Encrypt", requests.post, f"{API_URL}/data/encrypt", json=payload)

    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        enc = response.json()
        print(f"✔ Encrypted to {enc.get('encrypted_file')}")
        return enc
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
    response = timed_request("Store on chain", requests.post, f"{API_URL}/blockchain/store", json=payload)

    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data_id = response.json().get('data_id')
        print(f"✔ Stored on chain as ID: {data_id}")
        return data_id
    else:
        print(f"Error: {response.text}")
        return None


def test_blockchain_retrieval(data_id):
    print(f"\n5. Testing blockchain retrieval for ID {data_id}...")
    if not data_id:
        print("Error: No data ID to retrieve.")
        return False

    response = timed_request("Retrieve from chain", requests.get, f"{API_URL}/blockchain/retrieve/{data_id}")

    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print("✔ Retrieved successfully:")
        print(f"  • Cipher hash: {response.json().get('cipher_hash')}")
        return True
    else:
        print(f"Error: {response.text}")
        return False


def test_access_control(data_id):
    print(f"\n6. Testing access control for ID {data_id}...")
    if not data_id:
        print("Error: No data ID for access control.")
        return False

    test_address = "0x123456789abcdef123456789abcdef123456789a"

    # initial check
    r1 = timed_request("Initial access check",
                       requests.get,
                       f"{API_URL}/blockchain/access/check?data_id={data_id}&address={test_address}")
    print(f"  → has_access? {r1.json().get('has_access')}")

    # grant
    payload = {'data_id': data_id, 'address': test_address}
    r2 = timed_request("Grant access", requests.post, f"{API_URL}/blockchain/access/grant", json=payload)
    print(f"  → grant status: {r2.status_code}")

    # check again
    r3 = timed_request("Post-grant access check",
                       requests.get,
                       f"{API_URL}/blockchain/access/check?data_id={data_id}&address={test_address}")
    print(f"  → has_access? {r3.json().get('has_access')}")

    # revoke
    r4 = timed_request("Revoke access", requests.post, f"{API_URL}/blockchain/access/revoke", json=payload)
    print(f"  → revoke status: {r4.status_code}")

    # final check
    r5 = timed_request("Post-revoke access check",
                       requests.get,
                       f"{API_URL}/blockchain/access/check?data_id={data_id}&address={test_address}")
    print(f"  → has_access? {r5.json().get('has_access')}")

    return True


def run_tests():
    print("=== BACKEND API TESTING & TIMINGS ===")
    processed = test_file_upload()
    test_file_listing()
    enc_data = test_encryption(processed) if processed else None
    data_id  = test_blockchain_storage(enc_data) if enc_data else None

    if data_id:
        test_blockchain_retrieval(data_id)
        test_access_control(data_id)


if __name__ == "__main__":
    run_tests()
