# ContextFort Installation Guide

## Installation Instructions

### Option 1: Download Pre-built Extension

1. **Download the extension:**
   - Download `contextfort-extension.zip` from the releases page

2. **Extract the ZIP file:**
   - Unzip the file to a folder on your computer
   - You should see files like `manifest.json`, `background.js`, etc.

3. **Load in Chrome:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right corner)
   - Click "Load unpacked"
   - Select the folder where you extracted the extension
   - The extension should now be loaded

4. **Configure PostHog (Optional):**
   - By default, PostHog analytics is **enabled**
   - To disable it:
     - Open the extracted folder
     - Open `background.js` in a text editor
     - Find line 1: `const ENABLE_POSTHOG = true;`
     - Change to: `const ENABLE_POSTHOG = false;`
     - Save the file
     - Go back to `chrome://extensions/` and click the reload button on the ContextFort extension

### Option 2: Build from Source

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/contextfort.git
   cd contextfort
   ```

2. **Configure PostHog (Optional):**
   - Open `chrome-extension/background.js`
   - Line 1: Change `ENABLE_POSTHOG` to `true` or `false`

3. **Build the extension:**
   ```bash
   ./build-all.sh
   ```
   This creates the built extension in `chrome-extension/dist/`

4. **Load in Chrome:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `chrome-extension/dist/` folder
   - The extension should now be loaded

## Usage

Once installed, ContextFort will automatically detect when Claude (or other AI agents) enters agent mode and provide:

- **Visibility**: Screenshots and session tracking
- **Domain Blocking**: Restrict which domains agents can visit
- **Context Mixing Prevention**: Block transitions between specific domains
- **Action Blocking**: Prevent agents from interacting with specific UI elements
- **Governance Rules**: Custom rules for agent behavior

Access the dashboard by clicking the ContextFort icon in your Chrome toolbar.

## Troubleshooting

### Extension won't load
- Make sure you selected the correct folder (should contain `manifest.json`)
- Check Chrome version is 134 or higher
- Try disabling and re-enabling "Developer mode"

### PostHog changes not taking effect
- Make sure you saved `background.js` after editing
- Click the reload button on the extension in `chrome://extensions/`
- If still not working, remove and re-add the extension

### Dashboard not opening
- Right-click the extension icon and select "Inspect popup" to check for errors
- Make sure the extension has the required permissions

## Support

For issues, questions, or feature requests, please open an issue on GitHub.
