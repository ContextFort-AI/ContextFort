# Quick Start Guide

Get the Click Detection SDK running in 5 minutes on macOS.

## Prerequisites

- macOS 10.15+ (Catalina or later)
- Rust (install via `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`)
- Xcode Command Line Tools (`xcode-select --install`)

## Step 1: Build the SDK

```bash
cd /Users/ashwin/click-detection-sdk

# Build the Rust API server
cargo build --release

# Build the native macOS monitor
cd native
make macos_monitor_test
cd ..
```

## Step 2: Grant Accessibility Permissions

The OS monitor needs accessibility permissions to capture system-level mouse events.

```bash
# Run this to trigger the permission prompt
./native/macos_monitor_test
```

When prompted:
1. Open **System Preferences**
2. Go to **Security & Privacy** → **Privacy** → **Accessibility**
3. Click the lock to make changes
4. Add `Terminal` or your terminal app to the list
5. Restart your terminal

## Step 3: Start the SDK

Open **3 terminal windows**:

### Terminal 1: Start the API Server

```bash
cd /Users/ashwin/click-detection-sdk
cargo run --release
```

You should see:
```
🔍 Click Detection SDK v0.1.0
==============================

✓ Detector initialized
🚀 API server listening on http://127.0.0.1:9999
```

### Terminal 2: Start the OS Monitor

```bash
cd /Users/ashwin/click-detection-sdk/native

# Run the monitor and pipe clicks to API
./macos_monitor_test
```

### Terminal 3: Test the Integration

```bash
# Check health
curl http://localhost:9999/api/health

# Check stats
curl http://localhost:9999/api/stats

# Manually send a test OS click
curl -X POST http://localhost:9999/api/events/os \
  -H "Content-Type: application/json" \
  -d '{"x": 100, "y": 200, "timestamp": 1234567890.5}'

# Manually send a test DOM click (should match)
curl -X POST http://localhost:9999/api/events/dom \
  -H "Content-Type: application/json" \
  -d '{"x": 105, "y": 205, "timestamp": 1234567890.55}'
```

## Step 4: Install Browser Injector

### Option A: As a Bookmarklet (Quick Test)

1. Create a bookmark in your browser
2. Set the URL to:

```javascript
javascript:(function(){var s=document.createElement('script');s.src='http://localhost:8000/browser-injector/injector.js';document.head.appendChild(s);})();
```

3. Serve the injector locally:

```bash
cd /Users/ashwin/click-detection-sdk
python3 -m http.server 8000
```

4. Visit any website and click the bookmarklet
5. Click around - you'll see detection in the console!

### Option B: As a Chrome Extension (Recommended)

We can convert your existing click-monitor-extension:

```bash
# Add SDK integration to your extension
cd /Users/ashwin/click-monitor-extension

# Copy the injector
cp /Users/ashwin/click-detection-sdk/browser-injector/injector.js ./sdk-injector.js
```

Then modify `content.js` to send clicks to the SDK API.

## Step 5: Test It!

1. Make sure all 3 components are running:
   - ✅ API Server (Terminal 1)
   - ✅ OS Monitor (Terminal 2)
   - ✅ Browser Injector (via bookmarklet or extension)

2. Open a website in your browser

3. **Test real clicks**: Click normally
   - Should see in API logs: `✓ Legitimate DOM click`

4. **Test synthetic clicks**: Open browser console and run:
   ```javascript
   document.querySelector('a').click();
   ```
   - Should see in API logs: `⚠️ SUSPICIOUS DOM click`

## Architecture Overview

```
┌──────────────────────────────────────────┐
│  Terminal 1: API Server (Rust)           │
│  http://localhost:9999                   │
│  - Correlation engine                    │
│  - REST API                              │
└──────────┬────────────┬──────────────────┘
           │            │
    OS Clicks      DOM Clicks
           │            │
┌──────────┴───────┐    │
│  Terminal 2:     │    │
│  OS Monitor      │    │
│  (Native C/ObjC) │    │
└──────────────────┘    │
                        │
                 ┌──────┴─────────┐
                 │  Browser       │
                 │  + Injector.js │
                 └────────────────┘
```

## Expected Output

### Legitimate Click (Real User)

```
[SDK] OS click recorded: x=345.0, y=678.0, time=1234567890.123
[SDK] ✓ Legitimate DOM click: x=345.0, y=678.0
```

### Suspicious Click (Automated)

```
[SDK] ⚠️ SUSPICIOUS DOM click: x=345.0, y=678.0, reason=Some("No OS click within 100ms and 20px")
```

## Troubleshooting

### OS Monitor not capturing clicks

- Check Accessibility permissions
- Make sure Terminal has permission
- Try running with `sudo` (not recommended for production)

### API not receiving clicks

- Check that API is running: `curl http://localhost:9999/api/health`
- Check CORS if calling from browser
- Check firewall settings

### Browser injector not working

- Check console for errors
- Make sure API server is accessible from browser
- Check that injector script is loaded: `console.log('test')`

## Next Steps

- Integrate with your existing click-monitor-extension
- Add persistent storage for events
- Create a web dashboard
- Package as a native app
- Add support for Windows and Linux

## API Reference

### POST /api/events/os

Record an OS-level click.

```bash
curl -X POST http://localhost:9999/api/events/os \
  -H "Content-Type: application/json" \
  -d '{"x": 100, "y": 200, "timestamp": 1234567890.5}'
```

### POST /api/events/dom

Record a DOM click and check if suspicious.

```bash
curl -X POST http://localhost:9999/api/events/dom \
  -H "Content-Type: application/json" \
  -d '{"x": 100, "y": 200, "timestamp": 1234567890.5}'
```

Response:
```json
{
  "is_suspicious": false,
  "confidence": 1.0,
  "reason": null
}
```

### GET /api/stats

Get statistics.

```bash
curl http://localhost:9999/api/stats
```

Response:
```json
{
  "total_os_clicks": 42,
  "total_dom_clicks": 40,
  "suspicious_clicks": 2
}
```
