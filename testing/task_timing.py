import os
import time
import json
import requests
import pandas as pd

from backend.encryption.aes_encryption import AESCipher

API_URL = "http://localhost:8001/api"

# 1. Upload & Encrypt
def time_upload_encrypt(file_path, runs=3):
    upload_times, encrypt_times = [], []
    for i in range(runs):
        # --- upload ---
        files = {"file": open(file_path, "rb")}
        t0 = time.time()
        r = requests.post(f"{API_URL}/data/upload", files=files)
        t_upload = time.time() - t0
        processed = r.json()["processed_file"]
        upload_times.append(t_upload)

        # --- encrypt ---
        payload = {"file": processed, "use_rsa": False}
        t0 = time.time()
        r2 = requests.post(f"{API_URL}/data/encrypt", json=payload)
        t_encrypt = time.time() - t0
        encrypt_times.append(t_encrypt)

    return (
        sum(upload_times) / runs,
        sum(encrypt_times) / runs
    )

# 2. Grant Access
def time_grant_access(data_id, address, runs=3):
    grant_times = []
    for _ in range(runs):
        payload = {"data_id": data_id, "address": address}
        t0 = time.time()
        r = requests.post(f"{API_URL}/blockchain/access/grant", json=payload)
        grant_times.append(time.time() - t0)
    return sum(grant_times) / runs

# 3. Decrypt & Stats
def time_decrypt_and_stats(encrypted_file, key_file, meta_file, runs=3):
    dec_times, stat_times = [], []
    cipher = AESCipher()  # assumes default paths or pass files
    for _ in range(runs):
        # decrypt
        t0 = time.time()
        plain_path = cipher.decrypt_file(encrypted_file, key_file, meta_file)
        t_dec = time.time() - t0
        dec_times.append(t_dec)

        # stats
        t1 = time.time()
        df = pd.read_json(plain_path)
        # simple bounding‐box + count
        lats = df["lat"].astype(float)
        longs = df["long"].astype(float)
        _ = {
            "count": len(df),
            "bbox": (lats.min(), lats.max(), longs.min(), longs.max())
        }
        t_stat = time.time() - t1
        stat_times.append(t_stat)

    return (
        sum(dec_times) / runs,
        sum(stat_times) / runs
    )

if __name__ == "__main__":
    # adjust these variables to your test file / data_id / address
    test_file       = "../datasets/10MB_sample.csv"
    colleague_addr  = "0x123456789abcdef123456789abcdef123456789a"

    print("== Task Timing ==")
    up, enc = time_upload_encrypt(test_file)
    print(f"- Upload (10 MB):    {up:.3f} s (avg over 3 runs)")
    print(f"- Encrypt (10 MB):   {enc:.3f} s (avg over 3 runs)")

    # you need an existing data_id from bench_store_data()
    data_id = input("Enter a data_id for grant‑access timing: ").strip()
    ga = time_grant_access(data_id, colleague_addr)
    print(f"- Grant access:      {ga:.3f} s (avg over 3 runs)")

    # decrypt & stats: use the files created earlier
    enc_file = input("Encrypted file name (e.g. addresses.json.enc): ").strip()
    key_file = input("Key file name (addresses.json.enc.key): ").strip()
    meta_file= input("Meta file name (addresses.json.enc.meta): ").strip()
    t_dec, t_stat = time_decrypt_and_stats(enc_file, key_file, meta_file)
    print(f"- Decrypt file:      {t_dec:.3f} s (avg over 3 runs)")
    print(f"- Compute statistics:{t_stat:.3f} s (avg over 3 runs)")
