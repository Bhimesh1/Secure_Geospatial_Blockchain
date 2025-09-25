# ipfs_uploader.py

import ipfshttpclient
import os


def upload_file_to_ipfs(file_path: str) -> str:
    """
    Upload a file to your local IPFS node and return the CID (Content Identifier).
    Assumes IPFS daemon is running at 127.0.0.1:5001
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    try:
        client = ipfshttpclient.connect("/ip4/127.0.0.1/tcp/5001")
        result = client.add(file_path)
        cid = result["Hash"]
        print(f"✅ File uploaded to IPFS: {cid}")
        return cid
    except Exception as e:
        print(f"❌ IPFS upload failed: {e}")
        raise
