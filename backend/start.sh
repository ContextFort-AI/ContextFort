#!/bin/bash

echo "🚀 Starting POST Monitor Backend Server..."
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

echo ""
echo "✓ Server starting on http://127.0.0.1:8000"
echo "✓ API documentation available at http://127.0.0.1:8000/docs"
echo ""

# Start server
python main.py
