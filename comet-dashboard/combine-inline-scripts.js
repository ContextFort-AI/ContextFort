#!/usr/bin/env node

/**
 * Combine ALL inline scripts into a single external file per HTML page
 * This preserves Next.js execution order and hydration
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'out');

function combineInlineScripts(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const inlineScripts = [];
  const inlineScriptRegex = /<script(?![^>]*\ssrc=)([^>]*)>([\s\S]*?)<\/script>/gi;

  // Extract all inline scripts (except JSON)
  let match;
  while ((match = inlineScriptRegex.exec(content)) !== null) {
    const attributes = match[1];
    const scriptContent = match[2];

    // Skip empty scripts and JSON scripts
    if (!scriptContent.trim() || attributes.includes('type="application/json"')) {
      continue;
    }

    inlineScripts.push(scriptContent);
  }

  if (inlineScripts.length === 0) {
    return; // No inline scripts to combine
  }

  // Combine all scripts into one (NO IIFE - preserve global scope for Next.js)
  const combinedScript = inlineScripts.map((script, index) => {
    return `// Inline Script ${index + 1}\n${script}\n`;
  }).join('\n\n');

  // Write combined script to external file
  const scriptFileName = path.basename(filePath, '.html') + '-combined.js';
  const scriptDir = path.dirname(filePath);
  const scriptPath = path.join(scriptDir, scriptFileName);
  fs.writeFileSync(scriptPath, combinedScript, 'utf-8');

  // Remove ALL inline scripts from HTML and add single external script at the end of <body>
  let newContent = content.replace(inlineScriptRegex, (match, attributes, scriptContent) => {
    // Keep JSON scripts
    if (attributes.includes('type="application/json"')) {
      return match;
    }
    // Remove other inline scripts
    if (scriptContent.trim()) {
      return '<!-- inline script moved to combined.js -->';
    }
    return match;
  });

  // Add the combined script before </body>
  const scriptTag = `<script src="./${scriptFileName}"></script>`;
  newContent = newContent.replace('</body>', `${scriptTag}\n</body>`);

  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`✓ Combined ${inlineScripts.length} scripts in ${path.relative(OUTPUT_DIR, filePath)}`);
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

console.log('🔧 Combining inline scripts for Chrome MV3 CSP...\n');

walkDirectory(OUTPUT_DIR, (filePath) => {
  combineInlineScripts(filePath);
});

console.log('\n✅ All inline scripts combined successfully!');
