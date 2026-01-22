#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Building ContextFort for Comet..."

# Build Dashboard
echo "📊 Building Comet Dashboard..."
cd "$SCRIPT_DIR/comet-dashboard"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dashboard dependencies..."
    npm install
fi

npm run build

# Extract inline scripts and copy to comet-extension/dashboard
echo "📄 Extracting inline scripts..."
node extract-inline-scripts.js

if [ -d "$SCRIPT_DIR/comet-extension/dashboard" ]; then
    rm -rf "$SCRIPT_DIR/comet-extension/dashboard"
fi
mkdir -p "$SCRIPT_DIR/comet-extension/dashboard"

echo "📁 Copying dashboard files..."
cp -r out/_next "$SCRIPT_DIR/comet-extension/dashboard/"
cp out/*.html "$SCRIPT_DIR/comet-extension/dashboard/" 2>/dev/null || true
cp out/*.ico "$SCRIPT_DIR/comet-extension/dashboard/" 2>/dev/null || true
cp out/*.svg "$SCRIPT_DIR/comet-extension/dashboard/" 2>/dev/null || true
cp out/*.js "$SCRIPT_DIR/comet-extension/dashboard/" 2>/dev/null || true
cp out/*.json "$SCRIPT_DIR/comet-extension/dashboard/" 2>/dev/null || true
cp -r out/dashboard/* "$SCRIPT_DIR/comet-extension/dashboard/"

# Build Extension with Webpack
echo "📦 Building extension with webpack..."
cd "$SCRIPT_DIR/comet-extension"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing extension dependencies..."
    npm install
fi

# Run webpack build (outputs to dist/)
npm run build

echo "✅ ContextFort for Comet build complete!"
echo "📂 Extension ready in: $SCRIPT_DIR/comet-extension/dist"
