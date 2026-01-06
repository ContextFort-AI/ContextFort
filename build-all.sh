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

# Extract inline scripts for Chrome extension CSP compliance
echo "🔧 Extracting inline scripts..."
node extract-inline-scripts.js

# Copy to chrome extension
echo "📋 Copying dashboard to chrome-extension/dashboard..."
if [ -d "$SCRIPT_DIR/chrome-extension/dashboard" ]; then
  mv "$SCRIPT_DIR/chrome-extension/dashboard" "$SCRIPT_DIR/chrome-extension/dashboard.old-$(date +%Y%m%d-%H%M%S)"
fi
mkdir -p "$SCRIPT_DIR/chrome-extension/dashboard"
cp -r out/_next "$SCRIPT_DIR/chrome-extension/dashboard/"
cp out/*.html "$SCRIPT_DIR/chrome-extension/dashboard/" 2>/dev/null || true
cp out/*.ico "$SCRIPT_DIR/chrome-extension/dashboard/" 2>/dev/null || true
cp out/*.js "$SCRIPT_DIR/chrome-extension/dashboard/" 2>/dev/null || true
cp out/*.json "$SCRIPT_DIR/chrome-extension/dashboard/" 2>/dev/null || true
cp -r out/dashboard/* "$SCRIPT_DIR/chrome-extension/dashboard/"

# Fix asset paths for nested HTML files
echo "🔧 Fixing asset paths..."
find "$SCRIPT_DIR/chrome-extension/dashboard" -maxdepth 1 -name "*.html" -exec sed -i '' 's|"\.\./\(_next\)|"./\1|g' {} \;
find "$SCRIPT_DIR/chrome-extension/dashboard" -maxdepth 1 -name "*.html" -exec sed -i '' 's|href="\.\./\(_next\)|href="./\1|g' {} \;

echo "✅ Dashboard copied to chrome extension"

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
