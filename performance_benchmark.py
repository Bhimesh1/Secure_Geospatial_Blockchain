import os
import time
import json
from pathlib import Path
from dotenv import load_dotenv
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
from Crypto.Random import get_random_bytes
from web3 import Web3

# ─────────────────────────────────────────────────
#  Environment & Web3 Setup
# ─────────────────────────────────────────────────
load_dotenv()

RPC_URL       = os.getenv("BLOCKCHAIN_PROVIDER", "http://127.0.0.1:8545")
CONTRACT_ADDR = os.getenv("CONTRACT_ADDRESS")
PRIVATE_KEY   = os.getenv("PRIVATE_KEY")

w3      = Web3(Web3.HTTPProvider(RPC_URL))
acct    = w3.eth.account.from_key(PRIVATE_KEY)
account = acct             # alias
chainId = w3.eth.chain_id

# Load contract ABI
BASE_DIR = Path(__file__).resolve().parent
abi_path = BASE_DIR / "smart_contracts" / "artifacts" / "contracts" \
                   / "GeoDataStorage.sol" / "GeoDataStorage.json"

with open(abi_path) as f:
    contract_json = json.load(f)
    abi = contract_json["abi"]

contract = w3.eth.contract(
    address=Web3.toChecksumAddress(CONTRACT_ADDR),
    abi=abi
)

# ─────────────────────────────────────────────────
#  1) AES‑256 Encryption Throughput Benchmark
# ─────────────────────────────────────────────────
def bench_aes_throughput(file_size_mb=100, iterations=5):
    print(f"\n--- AES‑256 Throughput: {file_size_mb} MB × {iterations} runs ---")
    data = get_random_bytes(file_size_mb * 1024 * 1024)
    key  = get_random_bytes(32)
    iv   = get_random_bytes(16)
    cipher = AES.new(key, AES.MODE_CBC, iv)

    # Warm‑up
    _ = cipher.encrypt(pad(data, AES.block_size))

    start = time.time()
    for _ in range(iterations):
        _ = cipher.encrypt(pad(data, AES.block_size))
    elapsed = time.time() - start

    total_bytes = file_size_mb * 1024 * 1024 * iterations
    mb_per_s = total_bytes / elapsed / (1024 * 1024)
    print(f"Time: {elapsed:.3f}s → {mb_per_s:.2f} MB/s")

# ─────────────────────────────────────────────────
#  2) storeData Latency & Gas Benchmark (returns data_id)
# ─────────────────────────────────────────────────
def bench_store_data():
    print("\n--- Blockchain storeData Latency & Gas (with estimate) ---")
    # generate unique ID and dummy hashes
    data_id     = w3.keccak(text=str(time.time())).hex()
    cipher_hash = w3.keccak(text="cipher").hex()
    meta_hash   = w3.keccak(text="meta").hex()

    # Estimate gas
    estimated = contract.functions.storeData(data_id, cipher_hash, meta_hash) \
                       .estimateGas({"from": account.address})
    gas_limit = int(estimated * 1.1)  # +10% buffer
    print(f"Estimated gas: {estimated}, using gas limit: {gas_limit}")

    # Build, sign, send
    nonce = w3.eth.get_transaction_count(account.address)
    tx = contract.functions.storeData(data_id, cipher_hash, meta_hash).buildTransaction({
        "chainId": chainId,
        "gas": gas_limit,
        "gasPrice": w3.toWei("1", "gwei"),
        "nonce": nonce
    })
    signed = account.sign_transaction(tx)

    t0 = time.time()
    tx_hash = w3.eth.send_raw_transaction(signed.rawTransaction)
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    latency = time.time() - t0

    print(f"Latency: {latency:.3f}s")
    print(f"Gas Used: {receipt.gasUsed}")

    return data_id

# ─────────────────────────────────────────────────
#  3) grantAccess & revokeAccess Gas Benchmark
# ─────────────────────────────────────────────────
def bench_access_controls(data_id):
    print("\n--- grantAccess / revokeAccess Gas ---")
    grantee = account.address

    # Estimate + send grantAccess
    nonce = w3.eth.get_transaction_count(account.address)
    est_g = contract.functions.grantAccess(data_id, grantee) \
               .estimateGas({"from": account.address})
    txg = contract.functions.grantAccess(data_id, grantee).buildTransaction({
        "chainId": chainId,
        "gas": int(est_g * 1.1),
        "gasPrice": w3.toWei("1", "gwei"),
        "nonce": nonce
    })
    signed_g = account.sign_transaction(txg)
    r_g = w3.eth.send_raw_transaction(signed_g.rawTransaction)
    receipt_g = w3.eth.wait_for_transaction_receipt(r_g)

    # Estimate + send revokeAccess
    nonce = w3.eth.get_transaction_count(account.address)
    est_r = contract.functions.revokeAccess(data_id, grantee) \
               .estimateGas({"from": account.address})
    txr = contract.functions.revokeAccess(data_id, grantee).buildTransaction({
        "chainId": chainId,
        "gas": int(est_r * 1.1),
        "gasPrice": w3.toWei("1", "gwei"),
        "nonce": nonce
    })
    signed_r = account.sign_transaction(txr)
    r_r = w3.eth.send_raw_transaction(signed_r.rawTransaction)
    receipt_r = w3.eth.wait_for_transaction_receipt(r_r)

    print(f"grantAccess Gas:  {receipt_g.gasUsed}")
    print(f"revokeAccess Gas: {receipt_r.gasUsed}")

# ─────────────────────────────────────────────────
#  Run all benchmarks
# ─────────────────────────────────────────────────
if __name__ == "__main__":
    bench_aes_throughput(file_size_mb=100, iterations=5)
    data_id = bench_store_data()
    bench_access_controls(data_id)
