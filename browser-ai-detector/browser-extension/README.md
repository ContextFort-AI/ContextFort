# Click Detection SDK - Chrome Extension

This Chrome extension bypasses Trusted Types and CSP restrictions by running as a content script.

## Installation

1. Open Chrome and go to: `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select this folder: `/Users/rishabharya/Desktop/context/browser-ai-detector/browser-extension`
5. The extension is now installed!

## Usage

1. Visit any website
2. Click around - all clicks are automatically monitored
3. Check the console to see SDK messages
4. Check SDK stats: `curl http://localhost:9999/api/stats`

## Testing

### Test Real Clicks:
- Just click normally on any webpage
- Console should show: `[Click Detection SDK] ✓ Click verified as legitimate`

### Test Synthetic Clicks:
- Open browser console and run:
  ```javascript
  document.querySelector('a').click();
  ```
- Console should show: `[Click Detection SDK] ⚠️ SUSPICIOUS CLICK DETECTED!`
- You'll see a red circle animation

## Requirements

- SDK API server must be running on http://localhost:9999
- OS monitor should be running (with accessibility permissions granted)
