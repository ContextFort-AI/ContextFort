# SDK Architecture

## Overview

The Click Detection SDK uses a multi-layer approach to detect synthetic browser clicks by correlating OS-level input events with browser DOM events.

## Components

### 1. OS Input Monitor (Native Layer)

**Platform**: macOS (Objective-C), Linux (C + X11), Windows (C++ + Win32 API)

**Function**: Captures raw mouse click events at the operating system level before they reach any application.

**Technology**:
- macOS: `CGEventTap` API
- Linux: X11/evdev hooks
- Windows: `SetWindowsHookEx` with `WH_MOUSE_LL`

**Output**: Stream of OS click events with:
- X, Y coordinates (screen space)
- Timestamp (high precision)
- Button (left/middle/right)

### 2. Browser Injector (JavaScript Layer)

**Platform**: JavaScript (runs in browser context)

**Function**: Captures DOM click events from web pages.

**Deployment Options**:
- Chrome/Firefox extension
- Bookmarklet
- Native messaging host injection
- Userscript (Tampermonkey/Greasemonkey)

**Output**: Stream of DOM click events with:
- X, Y coordinates (viewport space)
- Timestamp
- `isTrusted` flag (from browser)
- Target element info

### 3. Correlation Engine (Core Logic)

**Platform**: Rust (performance + safety)

**Function**: Matches DOM clicks with OS clicks using spatiotemporal correlation.

**Algorithm**:
```
For each DOM click:
  1. Search recent OS clicks (within time window)
  2. Calculate spatial distance from OS click
  3. If match found: LEGITIMATE
  4. If no match: SUSPICIOUS
```

**Parameters**:
- Time window: 100ms (configurable)
- Position tolerance: 20px (configurable)

### 4. API Server (Integration Layer)

**Platform**: Rust + Axum (async web framework)

**Function**: Provides REST API for:
- Recording OS clicks
- Recording DOM clicks
- Querying statistics
- Real-time alerts

**Endpoints**:
- `POST /api/events/os` - Record OS click
- `POST /api/events/dom` - Record & check DOM click
- `GET /api/stats` - Get statistics
- `GET /api/health` - Health check

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                         USER ACTION                          │
│                                                               │
│  Real Click:                    Synthetic Click:             │
│  Physical mouse → hardware      Browser API → DOM event      │
└───────────┬─────────────────────────────────────────────────┘
            │
            ↓
┌───────────────────────────────────────────────────────────┐
│                    OS INPUT LAYER                          │
│  (macOS: CGEventTap, Linux: X11, Windows: Hook)           │
│                                                            │
│  Captures: ✅ Real clicks   ❌ Synthetic clicks           │
└───────────┬───────────────────────────────────────────────┘
            │
            ↓ HTTP POST
┌───────────────────────────────────────────────────────────┐
│                    SDK API SERVER                          │
│  POST /api/events/os                                       │
│  → Stores in OS click buffer                               │
└───────────────────────────────────────────────────────────┘
            ↑
            │
            │
┌───────────────────────────────────────────────────────────┐
│                   BROWSER LAYER                            │
│  (JavaScript injector running in page context)             │
│                                                            │
│  Captures: ✅ Real clicks   ✅ Synthetic clicks           │
└───────────┬───────────────────────────────────────────────┘
            │
            ↓ HTTP POST
┌───────────────────────────────────────────────────────────┐
│                    SDK API SERVER                          │
│  POST /api/events/dom                                      │
│  → Correlation engine checks OS buffer                     │
│  → Returns: is_suspicious + confidence                     │
└───────────────────────────────────────────────────────────┘
```

## Detection Logic

### Legitimate Click Detection

```rust
fn is_legitimate(dom_click, os_clicks) -> bool {
    for os_click in os_clicks.recent() {
        let time_diff = abs(dom_click.time - os_click.time);
        let distance = euclidean(dom_click.pos, os_click.pos);

        if time_diff < 100ms && distance < 20px {
            return true; // Found matching OS click
        }
    }
    return false; // No matching OS click = suspicious
}
```

### Why This Works

| Click Type | OS Event | DOM Event | Detection |
|------------|----------|-----------|-----------|
| Real user click | ✅ Yes | ✅ Yes | ✅ Match → Legitimate |
| Browser automation (custom Chromium) | ❌ No | ✅ Yes | 🚨 No match → Suspicious |
| JavaScript `element.click()` | ❌ No | ✅ Yes | 🚨 No match → Suspicious |
| Puppeteer/Playwright default | ❌ No | ✅ Yes | 🚨 No match → Suspicious |

### Edge Cases

**False Positives** (legitimate but flagged):
- User clicks during page scroll (coordinates misaligned)
- High system load (timing window exceeded)
- Multi-monitor setups (coordinate system differences)

**Mitigation**:
- Configurable tolerances
- Coordinate space normalization
- Adaptive timing windows

**False Negatives** (automated but not flagged):
- Automation that simulates OS-level input
- Kernel-mode automation (requires kernel detection)
- Hardware automation (physical robot)

## Security Considerations

### What We Can Detect
- ✅ Browser-level automation
- ✅ JavaScript-based bots
- ✅ Custom browser automation
- ✅ Testing frameworks (Puppeteer, Selenium default modes)

### What We Cannot Detect
- ❌ OS-level automation (AutoHotkey, xdotool)
- ❌ Kernel-mode drivers
- ❌ Hardware automation (USB HID injection)
- ❌ VM-level automation with perfect simulation

### Privacy
- All data processed locally
- No network communication except localhost
- User must grant OS permissions (Accessibility on macOS)
- Open source, auditable

## Performance

**Overhead**:
- OS monitor: ~0.1% CPU (passive event tap)
- API server: ~1-2 MB RAM
- Correlation: O(n) where n = clicks in time window (typically < 10)

**Latency**:
- OS click → API: ~1-2ms
- DOM click → Correlation → Response: ~5-10ms

**Storage**:
- Keeps last 1000 clicks in memory (~100KB)
- Optional: Persist to disk for analysis

## Future Enhancements

1. **Machine Learning**: Train models on behavioral patterns
2. **Heatmap Analysis**: Detect unnatural click patterns
3. **Timing Analysis**: Detect inhuman reaction times
4. **WebDriver Detection**: Additional JavaScript-level checks
5. **Cross-Platform**: Full Windows and Linux support
6. **Cloud Dashboard**: Central monitoring for multiple endpoints
