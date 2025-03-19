from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
import json
import time

# Import blockchain module
from backend.blockchain.blockchain_service import BlockchainService
from backend.encryption.encryption_utils import generate_hash


# Models
class StoreRequest(BaseModel):
    encrypted_file: str
    original_file: Optional[str] = None
    metadata_file: Optional[str] = None
    data_id: Optional[str] = None


class AccessRequest(BaseModel):
    data_id: str
    address: str


# Create router
router = APIRouter(prefix="/api/blockchain", tags=["Blockchain"])


# Get the upload folder
def get_upload_folder():
    upload_folder = os.path.join(os.getcwd(), 'datasets')
    os.makedirs(upload_folder, exist_ok=True)
    return upload_folder


@router.post("/store")
async def store_on_blockchain(request: StoreRequest):
    """Store encrypted data reference on the blockchain"""
    upload_folder = get_upload_folder()
    encrypted_file = os.path.join(upload_folder, request.encrypted_file)

    # Check if the file exists
    if not os.path.exists(encrypted_file):
        raise HTTPException(status_code=404, detail=f"File {request.encrypted_file} not found")

    try:
        # Generate data ID
        data_id = request.data_id
        if not data_id:
            # Generate a unique ID
            timestamp = int(time.time())
            filename = os.path.basename(encrypted_file)
            blockchain_service = BlockchainService()
            data_id = blockchain_service.generate_data_id(filename, timestamp)

        # Generate hashes for blockchain storage
        with open(encrypted_file, 'rb') as f:
            cipher_hash = generate_hash(f.read())

        # Get or generate metadata hash
        if request.metadata_file and os.path.exists(os.path.join(upload_folder, request.metadata_file)):
            metadata_file = os.path.join(upload_folder, request.metadata_file)
            with open(metadata_file, 'r') as f:
                metadata_hash = generate_hash(json.load(f))
        else:
            metadata_hash = generate_hash({
                'original_file': request.original_file or 'unknown',
                'encrypted_file': request.encrypted_file,
                'timestamp': time.time()
            })

        # Store on blockchain
        blockchain_service = BlockchainService()
        receipt = blockchain_service.store_encrypted_data(data_id, cipher_hash, metadata_hash)

        return {
            'message': 'Data reference stored on blockchain',
            'data_id': data_id,
            'transaction_hash': receipt.transactionHash.hex(),
            'block_number': receipt.blockNumber,
            'gas_used': receipt.gasUsed
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error storing on blockchain: {str(e)}")


@router.get("/retrieve/{data_id}")
async def retrieve_from_blockchain(data_id: str):
    """Retrieve data reference from the blockchain"""
    try:
        # Initialize blockchain service
        blockchain_service = BlockchainService()

        # Retrieve data reference
        cipher_hash, metadata_hash, timestamp, owner = blockchain_service.retrieve_encrypted_data(data_id)

        return {
            'data_id': data_id,
            'cipher_hash': cipher_hash,
            'metadata_hash': metadata_hash,
            'timestamp': timestamp,
            'timestamp_readable': time.ctime(timestamp),
            'owner': owner
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving from blockchain: {str(e)}")


@router.post("/access/grant")
async def grant_access(request: AccessRequest):
    """Grant access to data for a specific address"""
    try:
        # Initialize blockchain service
        blockchain_service = BlockchainService()

        # Grant access
        receipt = blockchain_service.grant_access(request.data_id, request.address)

        return {
            'message': f'Access granted for {request.address} to data ID {request.data_id}',
            'transaction_hash': receipt.transactionHash.hex(),
            'block_number': receipt.blockNumber
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error granting access: {str(e)}")


@router.post("/access/revoke")
async def revoke_access(request: AccessRequest):
    """Revoke access to data for a specific address"""
    try:
        # Initialize blockchain service
        blockchain_service = BlockchainService()

        # Revoke access
        receipt = blockchain_service.revoke_access(request.data_id, request.address)

        return {
            'message': f'Access revoked for {request.address} to data ID {request.data_id}',
            'transaction_hash': receipt.transactionHash.hex(),
            'block_number': receipt.blockNumber
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error revoking access: {str(e)}")


@router.get("/access/check")
async def check_access(data_id: str, address: str):
    """Check if an address has access to data"""
    if not data_id or not address:
        raise HTTPException(status_code=400, detail="Missing data_id or address parameters")

    try:
        # Initialize blockchain service
        blockchain_service = BlockchainService()

        # Check access
        has_access = blockchain_service.check_access(data_id, address)

        return {
            'data_id': data_id,
            'address': address,
            'has_access': has_access
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking access: {str(e)}")


@router.get("/data")
async def get_data_ids(owned: bool = Query(False, description="Whether to return only data IDs owned by the caller")):
    """Get data IDs (all or owned by the caller)"""
    try:
        # Initialize blockchain service
        blockchain_service = BlockchainService()

        if owned:
            # Get data IDs owned by the caller
            data_ids = blockchain_service.get_my_data_ids()
        else:
            # Get all data IDs
            data_ids = blockchain_service.get_all_data_ids()

        return {
            'data_ids': data_ids,
            'count': len(data_ids)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting data IDs: {str(e)}")