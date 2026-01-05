#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing asset paths for different page depths...');

function getDepth(filePath, baseDir) {
  const relative = path.relative(baseDir, filePath);
  return relative.split(path.sep).length - 1;
}

function fixHtmlFile(filePath, baseDir) {
  const depth = getDepth(filePath, baseDir);
  const content = fs.readFileSync(filePath, 'utf8');

  // Calculate correct prefix based on depth
  // depth 0: ./_next
  // depth 1: ../_next
  // depth 2: ../../_next
  const prefix = depth === 0 ? './' : '../'.repeat(depth);

  // Replace all ./_next/ with correct prefix
  const fixed = content.replace(/\.?\/_next\//g, `${prefix}_next/`);

  if (fixed !== content) {
    fs.writeFileSync(filePath, fixed);
    console.log(`✅ Fixed ${path.relative(baseDir, filePath)} (depth: ${depth}, prefix: ${prefix})`);
  }
}

function processDirectory(dir, baseDir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory() && entry.name !== '_next' && entry.name !== '_inline-scripts') {
      processDirectory(fullPath, baseDir);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      fixHtmlFile(fullPath, baseDir);
    }
  }
}

const outDir = path.join(__dirname, 'out');
processDirectory(outDir, outDir);

console.log('✅ All asset paths fixed!');
