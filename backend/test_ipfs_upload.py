# backend/test_ipfs_upload.py

from ipfs_uploader import upload_file_to_ipfs

def main():
    # Create a test file
    test_file_path = "test_file.txt"
    with open(test_file_path, "w") as f:
        f.write("This is a test file for IPFS upload using Python.")

    # Upload to IPFS
    try:
        cid = upload_file_to_ipfs(test_file_path)
        print(f"🌐 View file at: https://ipfs.io/ipfs/{cid}")
    except Exception as e:
        print("Upload failed:", e)

if __name__ == "__main__":
    main()
