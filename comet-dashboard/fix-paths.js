#!/usr/bin/env node

/**
 * Post-build script to fix absolute paths in Next.js static export for Chrome extension
 * Converts /_next/ to relative paths like ../../_next/ based on file depth
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'out');

function getRelativePrefix(filePath, outDir) {
  const relativePath = path.relative(outDir, filePath);
  const depth = relativePath.split(path.sep).length - 1;
  return '../'.repeat(depth);
}

function fixPathsInFile(filePath, outDir) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const relativePrefix = getRelativePrefix(filePath, outDir);

  // Replace absolute paths with relative paths
  content = content.replace(/"\/_next\//g, `"${relativePrefix}_next/`);
  content = content.replace(/'\/_next\//g, `'${relativePrefix}_next/`);
  content = content.replace(/href="\//g, `href="${relativePrefix}`);
  content = content.replace(/src="\//g, `src="${relativePrefix}`);

  // Fix specific paths
  content = content.replace(/href="\/favicon\.ico/g, `href="${relativePrefix}favicon.ico`);

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✓ Fixed paths in ${path.relative(outDir, filePath)}`);
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

console.log('🔧 Fixing paths in HTML files for Chrome extension...\n');

walkDirectory(OUTPUT_DIR, (filePath) => {
  fixPathsInFile(filePath, OUTPUT_DIR);
});

console.log('\n✅ All paths fixed successfully!');
