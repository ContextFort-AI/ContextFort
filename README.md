# ContextFort

**Visibility & Controls for Browser Agents**

---

## Security & Compliance

### Current Architecture
- ✅ **Local storage only** - No data transmitted to external servers
- ✅ **No third party cloud environments** - All data stays on your machine
- ✅ **No PII transmission** - Screenshots and sessions stored locally
- ✅ **Open source** - Full code review available on GitHub
- ✅ **Protected branches** - Pull request required for code changes
- ✅ **Chrome Web Store** - [Approved and available](https://chromewebstore.google.com/detail/contextfort/jkocglijncodiiljpdnoiegfcgeadllg)

### Enterprise Readiness Roadmap
- 🔄 SOC2 Type 2 compliance (Q2 2025)
- 🔄 ISO 27001 certification (Q3 2025)
- 🔄 GDPR compliance documentation (Q2 2025)
- 🔄 Centralized dashboard for enterprise deployment (Q3 2025)

**Key Documents:**
- [SECURITY.md](SECURITY.md) - Security policies and vulnerability reporting
- [DATA_POLICY.md](DATA_POLICY.md) - What data we collect and how it's stored
- [COMPLIANCE.md](COMPLIANCE.md) - Compliance roadmap and certifications

---

## Installation

### Chrome Web Store (Recommended)

**[Install from Chrome Web Store](https://chromewebstore.google.com/detail/contextfort/jkocglijncodiiljpdnoiegfcgeadllg)**

1. Click the link above or search "ContextFort" in Chrome Web Store
2. Click **"Add to Chrome"**
3. Confirm permissions
4. Access dashboard by clicking the ContextFort icon in your toolbar

**No developer mode required!**

### Load Unpacked (Advanced)

For development or testing pre-release versions:

1. **Download:** Get the latest release from [Releases](https://github.com/ContextFort-AI/ContextFort/releases)
2. **Extract:** Unzip to a folder
3. **Load in Chrome:**
   - Open `chrome://extensions/`
   - Enable **"Developer mode"** (top-right toggle)
   - Click **"Load unpacked"**
   - Select the extracted folder

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