#!/usr/bin/env node

/**
 * Extract inline scripts from HTML files for Chrome extension CSP compliance
 * Chrome extensions Manifest v3 don't allow inline scripts
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const OUT_DIR = path.join(__dirname, 'out');

function findHtmlFiles(dir) {
  const files = [];

  function walk(directory) {
    const items = fs.readdirSync(directory);

    for (const item of items) {
      const fullPath = path.join(directory, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (item.endsWith('.html')) {
        files.push(fullPath);
      }
    }
  }

  walk(dir);
  return files;
}

function extractInlineScripts(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const scriptDir = path.join(path.dirname(htmlPath), '_inline-scripts');

  // Create _inline-scripts directory
  if (!fs.existsSync(scriptDir)) {
    fs.mkdirSync(scriptDir, { recursive: true });
  }

  let scriptIndex = 0;
  let modifiedHtml = html;

  // Find all inline scripts
  const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
  let match;

  while ((match = scriptRegex.exec(html)) !== null) {
    const scriptContent = match[1];

    // Skip empty scripts
    if (scriptContent.trim() === '') continue;

    // Generate unique filename based on content hash
    const hash = crypto.createHash('md5').update(scriptContent).digest('hex').substring(0, 8);
    const scriptFilename = `inline-${scriptIndex}-${hash}.js`;
    const scriptPath = path.join(scriptDir, scriptFilename);

    // Write script to external file
    fs.writeFileSync(scriptPath, scriptContent, 'utf-8');

    // Replace inline script with external script tag
    const relativePath = `./_inline-scripts/${scriptFilename}`;
    modifiedHtml = modifiedHtml.replace(
      match[0],
      `<script src="${relativePath}"></script>`
    );

    scriptIndex++;
  }

  // Write modified HTML
  if (scriptIndex > 0) {
    fs.writeFileSync(htmlPath, modifiedHtml, 'utf-8');
    console.log(`✅ Extracted ${scriptIndex} inline scripts from ${path.relative(OUT_DIR, htmlPath)}`);
  }
}

console.log('🔧 Extracting inline scripts for Chrome extension CSP compliance...\n');

const htmlFiles = findHtmlFiles(OUT_DIR);
console.log(`Found ${htmlFiles.length} HTML files\n`);

for (const htmlFile of htmlFiles) {
  extractInlineScripts(htmlFile);
}

console.log('\n✅ All inline scripts extracted!');
