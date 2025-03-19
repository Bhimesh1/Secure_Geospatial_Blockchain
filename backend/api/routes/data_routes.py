from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
import json
import shutil
import uuid
import pandas as pd
from pathlib import Path
from werkzeug.utils import secure_filename

# Import data processing and encryption modules
from backend.data_processing.extract_data import clean_data, convert_to_json
from backend.encryption.aes_encryption import encrypt_json_file
from backend.encryption.encryption_utils import generate_hash, create_metadata, save_metadata

# Create router
router = APIRouter(prefix="/api/data", tags=["Data"])


# Models
class EncryptRequest(BaseModel):
    file: str
    use_rsa: Optional[bool] = False


class FileInfo(BaseModel):
    name: str
    size: int
    type: str
    modified: float


class FileListResponse(BaseModel):
    files: List[FileInfo]


# Helper Functions
def allowed_file(filename):
    """Check if the file extension is allowed"""
    ALLOWED_EXTENSIONS = {'xlsx', 'csv', 'json'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# Get the upload folder
def get_upload_folder():
    upload_folder = os.path.join(os.getcwd(), 'datasets')
    os.makedirs(upload_folder, exist_ok=True)
    return upload_folder


# Routes
@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload and process geospatial data files"""
    # Check if the file was uploaded
    if not file:
        raise HTTPException(status_code=400, detail="No file part")

    # Check if the file type is allowed
    if not allowed_file(file.filename):
        raise HTTPException(status_code=400, detail="File type not allowed")

    # Save the uploaded file
    upload_folder = get_upload_folder()
    filename = secure_filename(file.filename)
    file_path = os.path.join(upload_folder, filename)

    # Save the uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Process the file based on type
    try:
        file_extension = filename.rsplit('.', 1)[1].lower()

        if file_extension == 'xlsx':
            # Process Excel file
            df = pd.read_excel(file_path)
            df_cleaned = clean_data(df)

            # Convert to JSON
            json_path = os.path.join(upload_folder,
                                     f"{filename.rsplit('.', 1)[0]}.json")
            convert_to_json(df_cleaned, json_path)

            return {
                'message': 'File processed successfully',
                'original_file': filename,
                'processed_file': f"{filename.rsplit('.', 1)[0]}.json",
                'rows': len(df_cleaned),
                'columns': df_cleaned.columns.tolist()
            }

        elif file_extension == 'csv':
            # Process CSV file
            df = pd.read_csv(file_path)
            df_cleaned = clean_data(df)

            # Convert to JSON
            json_path = os.path.join(upload_folder,
                                     f"{filename.rsplit('.', 1)[0]}.json")
            convert_to_json(df_cleaned, json_path)

            return {
                'message': 'File processed successfully',
                'original_file': filename,
                'processed_file': f"{filename.rsplit('.', 1)[0]}.json",
                'rows': len(df_cleaned),
                'columns': df_cleaned.columns.tolist()
            }

        elif file_extension == 'json':
            # Validate the JSON file
            with open(file_path, 'r') as f:
                data = json.load(f)

            return {
                'message': 'JSON file uploaded successfully',
                'file': filename,
                'size': os.path.getsize(file_path)
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")


@router.post("/encrypt")
async def encrypt_data(request: EncryptRequest):
    """Encrypt geospatial data"""
    upload_folder = get_upload_folder()
    file_path = os.path.join(upload_folder, request.file)

    # Check if the file exists
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"File {request.file} not found")

    try:
        # Encrypt the file
        use_rsa = request.use_rsa
        encrypted_path, aes_key = encrypt_json_file(file_path)

        # Generate hash for the original data
        with open(file_path, 'r') as f:
            original_data = json.load(f)
        data_hash = generate_hash(original_data)

        # Create and save metadata
        metadata_path = f"{encrypted_path}.meta"
        metadata = create_metadata(file_path, encrypted_path, data_hash)
        save_metadata(metadata, metadata_path)

        # Save the key (in a real application, this should be securely stored)
        key_path = f"{encrypted_path}.key"
        with open(key_path, 'w') as f:
            f.write(aes_key)

        return {
            'message': 'Data encrypted successfully',
            'original_file': request.file,
            'encrypted_file': os.path.basename(encrypted_path),
            'key_file': os.path.basename(key_path),
            'metadata_file': os.path.basename(metadata_path)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error encrypting data: {str(e)}")


@router.get("/files", response_model=FileListResponse)
async def list_files():
    """List all files in the dataset directory"""
    upload_folder = get_upload_folder()
    files = []
    for filename in os.listdir(upload_folder):
        file_path = os.path.join(upload_folder, filename)
        if os.path.isfile(file_path):
            files.append({
                'name': filename,
                'size': os.path.getsize(file_path),
                'type': filename.split('.')[-1],
                'modified': os.path.getmtime(file_path)
            })

    return {
        'files': files
    }