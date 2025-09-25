import sys
import time
from pathlib import Path

# Add project root to path
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))

from backend.blockchain.blockchain_service import BlockchainService


def debug_blockchain():
    print("=== Blockchain Debug Tool ===\n")

    # Initialize service
    print("Initializing blockchain service...")
    service = BlockchainService()

    # Get all data IDs
    try:
        print("\nFetching all data IDs...")
        all_ids = service.get_all_data_ids()
        print(f"Found {len(all_ids)} data IDs:")
        for i, data_id in enumerate(all_ids):
            print(f"  {i + 1}. {data_id}")

        if len(all_ids) > 0:
            # Test access check for first ID
            print("\nTesting access check for first data ID...")
            data_id = all_ids[0]

            # Test with actual account address
            address = service.account.address
            print(f"Checking if {address} has access to {data_id}...")

            try:
                time.sleep(2)  # Delay to ensure blockchain sync
                has_access = service.check_access(data_id, address)
                print(f"Access check result: {has_access}")
            except Exception as e:
                print(f"Access check failed: {str(e)}")
        else:
            print("No data IDs found to test access.")
    except Exception as e:
        print(f"Error fetching data IDs: {str(e)}")


if __name__ == "__main__":
    debug_blockchain()