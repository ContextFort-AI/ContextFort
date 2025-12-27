// API Configuration
// This file is auto-generated from ../contextfort-dashboard/.env.local
// Run 'node build-config.js' to regenerate

const CONFIG = {
  API_URL: 'http://127.0.0.1:8000',
  CLICK_DETECTION_API_URL: 'http://localhost:8000'
};

// Export for use in background script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
