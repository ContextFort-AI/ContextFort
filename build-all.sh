#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Build Dashboard
cd "$SCRIPT_DIR/contextfort-dashboard"
npm run build

# Extract inline scripts and copy to chrome-extension/dashboard
node extract-inline-scripts.js
if [ -d "$SCRIPT_DIR/chrome-extension/dashboard" ]; then
    rm -rf "$SCRIPT_DIR/chrome-extension/dashboard"
fi
mkdir -p "$SCRIPT_DIR/chrome-extension/dashboard"
cp -r out/_next "$SCRIPT_DIR/chrome-extension/dashboard/"
cp out/*.html "$SCRIPT_DIR/chrome-extension/dashboard/" 2>/dev/null || true
cp out/*.ico "$SCRIPT_DIR/chrome-extension/dashboard/" 2>/dev/null || true
cp out/*.svg "$SCRIPT_DIR/chrome-extension/dashboard/" 2>/dev/null || true
cp out/*.js "$SCRIPT_DIR/chrome-extension/dashboard/" 2>/dev/null || true
cp out/*.json "$SCRIPT_DIR/chrome-extension/dashboard/" 2>/dev/null || true
cp -r out/dashboard/* "$SCRIPT_DIR/chrome-extension/dashboard/"

# Build Chrome Extension
cd "$SCRIPT_DIR/chrome-extension"
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run build