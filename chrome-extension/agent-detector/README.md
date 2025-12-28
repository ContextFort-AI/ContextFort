# Comet Agent Detector

## What it does
Detects when Comet browser's AI agent attaches the Chrome debugger to read page content. Logs detailed information about when the agent starts and stops reading pages.

## How it works
- Polls `chrome.debugger.getTargets()` every 500ms
- Detects when debugger is attached/detached from tabs
- Logs red box (🔴) when agent starts reading a page
- Logs green box (🟢) when agent stops reading

## Installation

1. Open Comet browser
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" (top right toggle)
4. Click "Load unpacked"
5. Select this folder: `/Users/ashwin/agents-blocker/chromium-accessibility-test/agent-detector`

## Testing

1. After loading the extension, go to `chrome://extensions/`
2. Find "Comet Agent Detector"
3. Click the blue "service worker" link to open the console
4. Keep the console window visible
5. Open Comet sidecar or Perplexity.ai
6. Ask the agent to read a page or perform a task
7. Watch for the red box (🔴 DEBUGGER ATTACHED) in the console
8. When the agent finishes, you'll see the green box (🟢 DEBUGGER DETACHED)

## Console Output

When agent starts reading:
```
🔴 ═══════════════════════════════════════════════════════
🔴 DEBUGGER ATTACHED
🔴 ═══════════════════════════════════════════════════════
Tab ID: 123456
Tab Title: Example Page
Tab URL: https://example.com/
Target Type: page
Attached: true
Time: 2:30:45 PM
🔴 ═══════════════════════════════════════════════════════
```

When agent stops reading:
```
🟢 ═══════════════════════════════════════════════════════
🟢 DEBUGGER DETACHED
🟢 ═══════════════════════════════════════════════════════
Tab ID: 123456
Tab Title: Example Page
Tab URL: https://example.com/
Time: 2:30:50 PM
🟢 ═══════════════════════════════════════════════════════
```

## Notes

- Detection happens within 0-500ms of actual attachment (average 250ms delay)
- Only shows alerts when agent is actively reading pages
- Does NOT detect when sidecar is just open but idle
