# Ashwin Guard

Browser extension for Comet providing link protection and agent activity monitoring.

## Features

### 1. Link Blocking
- Blocks external navigation from Perplexity tabs
- Prevents clicking links with query parameters
- Works for main tabs and side chat windows
- Shows notification when links are blocked

### 2. Agent Mode Detection
- Automatically detects when Perplexity agent is active
- Watches for `.pplx-agent-overlay` DOM element
- Works on any website the agent visits

### 3. Auto-Redaction
- Hides sensitive words when agent mode is active
- Redacts text content and input fields
- Visual indicators show protection status

### 4. Interaction Logging
- Records all interactions during agent sessions:
  - Mouse clicks (position, target element)
  - Keyboard input (which fields, length only)
  - Scrolling (position)
  - Key presses (special keys only, not actual text)
- Debounced screenshot capture (500ms after last interaction)
- Session logs stored in chrome.storage.local

## Installation

1. Load extension in Comet:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `ashwin-final` folder

2. Configure sensitive words in extension popup

That's it! No external dependencies needed.

## How It Works

### Link Blocking
- Uses Declarative Net Request (DNR) with dynamic session rules
- Tracks Perplexity tabs via `tabs.onUpdated`
- Blocks navigation to external sites via `webNavigation.onCreatedNavigationTarget`
- Tab-specific blocking using `tabIds` condition

### Agent Detection
- `MutationObserver` watches DOM for `.pplx-agent-overlay` or `.pplx-agent-overlay-stop-button`
- When overlay appears:
  1. Start new session with unique ID
  2. Redact sensitive words on page
  3. Attach interaction listeners (click, scroll, input, keypress)
  4. Show "👁 Agent Active - Recording" indicator
- When overlay disappears:
  1. Stop logging interactions
  2. Save session to storage
  3. Unredact page
  4. Remove indicator

### Interaction Logging
```javascript
{
  sessionId: "uuid",
  startTime: 1234567890,
  endTime: 1234567900,
  duration: 10000,
  url: "https://example.com",
  title: "Example Page",
  interactions: [
    { type: "click", timestamp: ..., x: 100, y: 200, ... },
    { type: "scroll", timestamp: ..., scrollY: 500 },
    { type: "input", timestamp: ..., valueLength: 12 }
  ],
  screenshots: [
    {
      timestamp: 1234567891,
      data: "data:image/png;base64,...",
      interactions: [...] // interactions that triggered this screenshot
    }
  ]
}
```

### Debounced Screenshots
- Interactions trigger a 500ms debounce timer
- If another interaction happens, timer resets
- When timer completes, captures one screenshot
- Screenshot includes all pending interactions
- Efficient: only captures when something happens

## Storage

All data stored in `chrome.storage.local`:
- `sensitiveWords` - Array of words to redact
- `enabled` - Boolean, protection on/off
- `agentSessions` - Array of session objects (max 50)

## UI

### Extension Badge
- Empty: Normal browsing
- 👁: Agent mode active, recording in progress

### On-Page Indicators
- **Orange badge (top-left)**: "👁 Agent Active - Recording"
- **Purple badge (top-right)**: "🔒 Protected X elements"

### Popup
- Toggle protection on/off
- Configure sensitive words
- View last 10 agent sessions with:
  - Session duration
  - Number of interactions
  - Number of screenshots

## Files

- `manifest.json` - Extension configuration (170 lines)
- `background.js` - Link blocking + screenshot coordination (170 lines)
- `content.js` - Agent detection + logging + redaction (380 lines)
- `popup.html` - User interface (189 lines)
- `popup.js` - Settings management (77 lines)
- `rules.json` - DNR blocking rules
- `icon*.png` - Extension icons

**Total: ~1,000 lines of code**

## Security

✅ All data stored locally in browser
✅ No external network requests
✅ No actual text captured from inputs (only length)
✅ No character-by-character key logging (only special keys)
✅ Screenshots only during agent activity
✅ Sessions auto-limited to 50 most recent

## Testing

1. **Link Blocking**: Go to Perplexity, ask for links with query params, try clicking
2. **Agent Detection**: Ask Perplexity to browse a website, verify orange indicator appears
3. **Redaction**: Check that sensitive words are hidden (opacity: 0)
4. **Logging**: Click/scroll/type on agent-browsed page, check popup for session
5. **Screenshots**: Verify screenshots appear in session after interactions

## Compared to Previous Version

**Removed:**
- ❌ Python monitor script (monitor_with_bridge.py)
- ❌ Bridge server (bridge_server.py)
- ❌ WebSocket connection
- ❌ macOS Accessibility API dependency
- ❌ External process requirements

**Added:**
- ✅ DOM-based agent overlay detection
- ✅ Interaction logging (click, scroll, input, keypress)
- ✅ Debounced screenshot capture
- ✅ Session recording and storage
- ✅ Visual session viewer in popup

**Result:** Self-contained browser extension with zero external dependencies!

## Known Limitations

- Agent overlay detection depends on Perplexity's DOM structure (`.pplx-agent-overlay`)
- Screenshots only work on non-Perplexity sites (ExtensionsSettings blocks Perplexity tabs)
- Session storage limited to last 50 sessions
- Large screenshots may consume significant storage
