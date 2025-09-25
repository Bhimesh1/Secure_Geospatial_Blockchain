#!/bin/bash

# Start backend server
cd backend
python -m uvicorn api.main:app --reload --port 8001 &

# Wait for backend to start
sleep 5

# Start frontend server
cd ../frontend
npm start 