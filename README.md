# ContextFort

**Visibility & Controls for Browser Agents**

## Installation

1. **Download the extension:**
   - Download the latest `contextfort-extension.zip` from the [Releases](../../releases) page

2. **Extract the ZIP file:**

3. **Load in Chrome:**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable **"Developer mode"** (toggle in top-right corner)
   - Click **"Load unpacked"**

4. **Access the Dashboard:**
   - Click the ContextFort icon in your Chrome toolbar
   - The dashboard will open with all features

---

### PostHog Analytics

**What's collected:**
- Session events (agent start/stop)
- Blocking events (when rules are triggered)
- Rule changes (when you update settings)
- Extension lifecycle (install, update)

### To Disable Analytics

1. Find **Line 2**: `const ENABLE_POSTHOG = true;` in `background.js`
2. Change to: `const ENABLE_POSTHOG = false;`

---

## Building from Source

If you want to build the extension yourself:

```bash
git clone https://github.com/yourusername/contextfort.git
cd contextfort
./build-all.sh
```

The built extension will be in `chrome-extension/dist/`

--