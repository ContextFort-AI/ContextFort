#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Path to the .env.local file
const envPath = path.join(__dirname, '../contextfort-dashboard/.env.local');
const configPath = path.join(__dirname, 'config.js');

console.log('Building config.js from environment variables...');
console.log('Reading from:', envPath);

// Read .env.local file
let envContent;
try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (error) {
  console.error('Error reading .env.local file:', error.message);
  console.log('Using default values...');
  envContent = '';
}

// Parse environment variables
const envVars = {};
envContent.split('\n').forEach(line => {
  line = line.trim();
  // Skip comments and empty lines
  if (line.startsWith('#') || !line) return;

  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

// Extract API URLs
const API_URL = envVars.NEXT_PUBLIC_POST_MONITOR_API || 'http://127.0.0.1:8000';
const CLICK_DETECTION_API_URL = envVars.NEXT_PUBLIC_CLICK_DETECTION_API || 'http://127.0.0.1:8000';

console.log('API_URL:', API_URL);
console.log('CLICK_DETECTION_API_URL:', CLICK_DETECTION_API_URL);

// Generate config.js content
const configContent = `// API Configuration
// This file is auto-generated from ../contextfort-dashboard/.env.local
// Run 'node build-config.js' to regenerate

const CONFIG = {
  API_URL: '${API_URL}',
  CLICK_DETECTION_API_URL: '${CLICK_DETECTION_API_URL}'
};

// Export for use in background script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
`;

// Write config.js
try {
  fs.writeFileSync(configPath, configContent, 'utf8');
  console.log('✓ config.js generated successfully at:', configPath);
} catch (error) {
  console.error('Error writing config.js:', error.message);
  process.exit(1);
}
