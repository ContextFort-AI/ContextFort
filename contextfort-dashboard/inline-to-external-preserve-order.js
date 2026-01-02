#!/usr/bin/env node

/**
 * Convert inline scripts to external files while preserving their exact position
 * This maintains Next.js's precise execution order requirements
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'out');

function convertInlineScriptsPreserveOrder(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let scriptCounter = 0;
  let modified = false;

  const inlineScriptRegex = /<script(?![^>]*\ssrc=)([^>]*)>([\s\S]*?)<\/script>/gi;

  content = content.replace(inlineScriptRegex, (match, attributes, scriptContent) => {
    // Keep empty scripts and JSON scripts as-is
    if (!scriptContent.trim() || attributes.includes('type="application/json"')) {
      return match;
    }

    modified = true;
    scriptCounter++;

    // Generate unique filename
    const htmlFileName = path.basename(filePath, '.html');
    const scriptFileName = `${htmlFileName}-inline-${scriptCounter}.js`;
    const scriptDir = path.dirname(filePath);
    const scriptPath = path.join(scriptDir, scriptFileName);

    // Write script content to external file
    fs.writeFileSync(scriptPath, scriptContent, 'utf-8');

    // Replace with external script tag in SAME position
    return `<script${attributes} src="./${scriptFileName}"></script>`;
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✓ Converted ${scriptCounter} inline scripts in ${path.relative(OUTPUT_DIR, filePath)}`);
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

console.log('🔧 Converting inline scripts to external files (preserving order)...\n');

walkDirectory(OUTPUT_DIR, (filePath) => {
  convertInlineScriptsPreserveOrder(filePath);
});

console.log('\n✅ All inline scripts converted successfully!');
console.log('✅ Execution order preserved - Next.js hydration should work now!');
