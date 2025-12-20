# POST Request Blocker

A simple Chrome extension that monitors your typed input and blocks POST requests containing data you just entered. This helps protect your privacy by preventing your recent input from being sent to servers without your knowledge.

## How It Works

1. **Tracks User Input**: The extension monitors all text input on web pages (text fields, textareas, etc.)
2. **Monitors POST Requests**: When a POST request is made, the extension checks if it contains any recently typed data
3. **Blocks Matching Requests**: If recent input is found in a POST request within the time window (default 5 seconds), the request is blocked
4. **Notifies User**: You'll receive a notification when a request is blocked

## Installation

Since this is a development extension, you need to load it manually:

1. Download or clone all the extension files to a folder
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (toggle in the top right corner)
4. Click **Load unpacked**
5. Select the folder containing the extension files
6. The extension should now be installed and active

## Required Files

The extension consists of these files:
- `manifest.json` - Extension configuration
- `background.js` - Monitors and blocks POST requests
- `content.js` - Tracks user input on web pages
- `popup.html` - User interface
- `popup.js` - Popup functionality
- `README.md` - This file

### Icon Files (Optional)

The extension references icon files in the manifest. You can either:
- Create your own icons (16x16, 48x48, 128x128 PNG files)
- Or remove the icon references from `manifest.json` (lines 32-36 and 39-43)

## Usage

Once installed, the extension works automatically:

1. Type something into any text field on a website
2. If a POST request containing your recent input is made within 5 seconds, it will be blocked
3. You'll receive a notification showing which request was blocked

### Accessing the Popup

Click the extension icon in your Chrome toolbar to:
- See the current status
- Adjust the time window (1-60 seconds)
- Clear all tracked data manually

## Configuration

### Time Window

The time window determines how long after typing the extension will monitor for matching POST requests:
- Default: 5 seconds
- Adjustable range: 1-60 seconds
- Change it in the popup interface

### Clearing Data

Click the "Clear Tracked Data" button in the popup to immediately clear all tracked input from memory.

## Code Structure

### background.js
- Maintains a list of recently typed data with timestamps
- Intercepts all POST requests using Chrome's webRequest API
- Compares POST request bodies with tracked input
- Blocks requests if matches are found within the time window
- Shows notifications when requests are blocked

### content.js
- Runs on all web pages
- Listens for input events on text fields and textareas
- Debounces input tracking to avoid excessive messages
- Uses MutationObserver to detect dynamically added input fields
- Sends user input to the background script

### popup.html / popup.js
- Simple UI for monitoring and configuration
- Allows users to adjust the time window
- Provides a button to clear tracked data
- Saves settings to Chrome storage

## Limitations

- Only works with POST requests (not GET, PUT, DELETE, etc.)
- Cannot block requests if the input is very short (< 3 characters)
- May not catch requests made through WebSocket or other non-HTTP protocols
- Uses Manifest V3 webRequest which has some restrictions in newer Chrome versions

## Privacy

This extension:
- Runs entirely locally in your browser
- Does not send any data to external servers
- Does not collect or store any personal information
- Only tracks input temporarily (cleared after the time window expires)

## Development Notes

This extension uses Chrome Manifest V3. The `webRequest` API with blocking is used, which provides the most straightforward way to intercept and block POST requests based on their content.

## Troubleshooting

### Extension doesn't block requests
- Check if the extension is enabled in `chrome://extensions/`
- Open the browser console (F12) and look for `[POST Blocker]` messages
- Ensure the time window is sufficient (try increasing it)

### Notifications not showing
- Check Chrome notification permissions
- Look in `chrome://settings/content/notifications`

### Extension not loading
- Ensure all required files are in the same folder
- Check for errors in `chrome://extensions/`
- Try removing icon references from manifest.json if icon files are missing

## License

Free to use and modify for personal and educational purposes.
# agents-blocker
