#!/usr/bin/env node

/**
 * Generate CSP script hashes for all inline scripts in HTML files
 * This allows inline scripts to execute in Chrome Extension Manifest V3
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const OUTPUT_DIR = path.join(__dirname, 'out');
const allHashes = new Set();

function generateHash(content) {
  const hash = crypto.createHash('sha256');
  hash.update(content);
  return `'sha256-${hash.digest('base64')}'`;
}

function extractInlineScriptHashes(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const inlineScriptRegex = /<script(?![^>]*\ssrc=)([^>]*)>([\s\S]*?)<\/script>/gi;

  let match;
  while ((match = inlineScriptRegex.exec(content)) !== null) {
    const attributes = match[1];
    const scriptContent = match[2];

    // Skip empty scripts and JSON scripts
    if (!scriptContent.trim() || attributes.includes('type="application/json"')) {
      continue;
    }

    const hash = generateHash(scriptContent);
    allHashes.add(hash);
  }
}

function walkDirectory(dir, callback) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDirectory(filePath, callback);
    } else if (file.endsWith('.html')) {
      callback(filePath);
    }
  }
}

console.log('🔐 Generating CSP hashes for inline scripts...\n');

walkDirectory(OUTPUT_DIR, (filePath) => {
  extractInlineScriptHashes(filePath);
});

console.log(`✓ Found ${allHashes.size} unique inline scripts\n`);

// Generate the CSP directive
const hashesArray = Array.from(allHashes);
const cspDirective = `script-src 'self' ${hashesArray.join(' ')} 'wasm-unsafe-eval'; object-src 'self'`;

console.log('📋 Add this to your manifest.json:\n');
console.log(JSON.stringify({
  content_security_policy: {
    extension_pages: cspDirective
  }
}, null, 2));

console.log('\n✅ CSP hashes generated successfully!');
console.log(`\n💡 Tip: Copy the above CSP policy to chrome-extension/manifest.json`);

// Save to a file for easy reference
const outputPath = path.join(__dirname, 'csp-hashes.json');
fs.writeFileSync(outputPath, JSON.stringify({
  hashes: hashesArray,
  csp_directive: cspDirective,
  manifest_entry: {
    content_security_policy: {
      extension_pages: cspDirective
    }
  }
}, null, 2));

console.log(`\n📁 Also saved to: ${path.relative(process.cwd(), outputPath)}`);
