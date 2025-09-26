# backend/utils/ipfs_upload.py

import ipfshttpclient

def upload_to_ipfs(file_path):
    try:
        client = ipfshttpclient.connect()  # Connect to local IPFS daemon
        res = client.add(file_path)
        return res['Hash']
    except Exception as e:
        print(f"IPFS upload failed: {str(e)}")
        return None
