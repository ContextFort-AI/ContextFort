#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'out');

function injectDashboardOverride(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Calculate relative path from this HTML file to dashboard-override.js in chrome-extension root
  // HTML files are at: chrome-extension/dashboard/dashboard/*/index.html
  // Override script will be at: chrome-extension/dashboard-override.js
  // So we need to go up 2 levels: ../../dashboard-override.js
  const overrideScriptTag = '<script src="../../dashboard-override.js"></script>';

  // Check if already injected
  if (content.includes('dashboard-override.js')) {
    console.log(`⊘ Already injected in ${path.relative(OUTPUT_DIR, filePath)}`);
    return;
  }

  // Inject before closing </body> tag
  if (content.includes('</body>')) {
    content = content.replace('</body>', `  ${overrideScriptTag}\n</body>`);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✓ Injected dashboard-override.js into ${path.relative(OUTPUT_DIR, filePath)}`);
  } else {
    console.warn(`⚠ No </body> tag found in ${path.relative(OUTPUT_DIR, filePath)}`);
  }
}

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.isFile() && entry.name === 'index.html') {
      injectDashboardOverride(fullPath);
    }
  }
}

console.log('🔧 Injecting dashboard-override.js into HTML files...');

if (fs.existsSync(OUTPUT_DIR)) {
  processDirectory(OUTPUT_DIR);
  console.log('✓ Dashboard override injection complete!');
} else {
  console.error(`❌ Output directory not found: ${OUTPUT_DIR}`);
  process.exit(1);
}
