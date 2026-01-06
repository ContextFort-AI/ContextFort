#!/bin/bash

# Build script for ContextFort Extension
# This builds both the dashboard and chrome extension

set -e  # Exit on error

echo "========================================="
echo "Building ContextFort Extension"
echo "========================================="

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Build Dashboard
echo ""
echo "📦 Building Dashboard..."
echo "-----------------------------------------"
cd "$SCRIPT_DIR/contextfort-dashboard"
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Dashboard build successful"
else
    echo "❌ Dashboard build failed"
    exit 1
fi

# Build Chrome Extension
echo ""
echo "🔧 Building Chrome Extension..."
echo "-----------------------------------------"
cd "$SCRIPT_DIR/chrome-extension"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📥 Installing chrome extension dependencies..."
    npm install
fi

npm run build
if [ $? -eq 0 ]; then
    echo "✅ Chrome extension build successful"
else
    echo "❌ Chrome extension build failed"
    exit 1
fi

echo ""
echo "========================================="
echo "✨ All builds completed successfully!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Load chrome-extension folder in Chrome as unpacked extension"
echo "2. Dashboard files are in contextfort-dashboard/.next"
