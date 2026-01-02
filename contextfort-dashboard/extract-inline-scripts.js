#!/usr/bin/env node

/**
 * Post-build script to extract inline scripts from HTML files
 * This is required for Chrome Extension Manifest V3 CSP compliance
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const OUTPUT_DIR = path.join(__dirname, 'out');

function extractInlineScripts(filePath, outDir) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let scriptCounter = 0;
  let modified = false;

  // Find all inline scripts (not including those with src attribute)
  const inlineScriptRegex = /<script(?![^>]*\ssrc=)([^>]*)>([\s\S]*?)<\/script>/gi;

  content = content.replace(inlineScriptRegex, (match, attributes, scriptContent) => {
    // Skip empty scripts
    if (!scriptContent.trim()) {
      return match;
    }

    // Skip scripts that are just JSON (like Next.js data)
    if (attributes.includes('type="application/json"')) {
      return match;
    }

    modified = true;
    scriptCounter++;

    // Generate a unique filename based on the HTML file and script number
    const htmlFileName = path.basename(filePath, '.html');
    const scriptFileName = `${htmlFileName}-inline-${scriptCounter}.js`;
    const scriptDir = path.dirname(filePath);
    const scriptPath = path.join(scriptDir, scriptFileName);

    // Write the script content to an external file
    fs.writeFileSync(scriptPath, scriptContent, 'utf-8');

    // Replace inline script with external script tag
    const relativePath = `./${scriptFileName}`;
    return `<script${attributes} src="${relativePath}"></script>`;
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✓ Extracted ${scriptCounter} inline script(s) from ${path.relative(outDir, filePath)}`);
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

console.log('🔧 Extracting inline scripts from HTML files...\n');

walkDirectory(OUTPUT_DIR, (filePath) => {
  extractInlineScripts(filePath, OUTPUT_DIR);
});

console.log('\n✅ All inline scripts extracted successfully!');
