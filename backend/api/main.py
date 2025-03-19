from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
import json
import time
import shutil
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import routes
from backend.api.routes import data_routes, blockchain_routes

# Create FastAPI app
app = FastAPI(
    title="Secure Geospatial Blockchain API",
    description="API for secure storage and transmission of encrypted geospatial data on blockchain",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Set configuration
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'datasets')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Include routers
app.include_router(data_routes.router)
app.include_router(blockchain_routes.router)

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "message": "Secure Geospatial Blockchain API is running"
    }