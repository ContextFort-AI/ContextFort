# Content Censor

## What it does
Automatically hides sensitive content when a debugger attaches to the page (e.g., when Comet agent is reading).

## How it works
- Background script polls for debugger attachment every 100ms
- When debugger attaches → sends `CENSOR_CONTENT` message to content script
- Content script applies `display: none` to elements containing sensitive words
- When debugger detaches → restores original display values

## Sensitive Words (Configurable)
Default list:
- password
- secret
- token
- api_key
- ashwin

## Installation

1. Open Comet browser
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select: `/Users/ashwin/agents-blocker/chromium-accessibility-test/content-censor`

## Testing

1. Open any page with text containing "password" or "secret"
2. Watch the extension's service worker console
3. When Comet agent attaches debugger, you'll see: `🔴 Debugger attached to tab X`
4. The sensitive content will be hidden (`display: none`)
5. When agent detaches: `🟢 Debugger detached from tab X`
6. Content is restored

## How Censoring Works

Uses `display: none` because:
- Removes elements completely from accessibility tree
- Comet agent cannot read hidden content
- Tested and confirmed to work

Does NOT use:
- `aria-hidden="true"` - doesn't work, agent still reads it
- `visibility: hidden` - still in accessibility tree
