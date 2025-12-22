# Click Detection SDK

A cross-platform SDK for detecting synthetic/automated browser clicks by correlating OS-level input events with browser DOM events.

## How It Works

The SDK operates at two levels:

1. **OS-Level Monitor**: Hooks into operating system input APIs to capture real mouse clicks
2. **Browser Injector**: Captures DOM click events from the browser
3. **Correlation Engine**: Matches OS clicks with DOM clicks to detect synthetic automation

```
Real User Click:
  Mouse Hardware → OS Input → Browser → DOM Event
  ✅ OS event exists ✅ DOM event exists → LEGITIMATE

Synthetic Click (Browser Automation):
  Browser Internal API → DOM Event
  ❌ No OS event ✅ DOM event exists → SUSPICIOUS
```

## Features

- ✅ Detects browser-level automation (custom Chromium, Puppeteer, etc.)
- ✅ Cross-platform support (macOS, Linux, Windows)
- ✅ Low overhead, runs in background
- ✅ REST API for integration
- ✅ Real-time dashboard
- ✅ Export logs and alerts

## Architecture

```
┌─────────────────────────────────────┐
│        OS Input Monitor             │
│   (Native C/C++/Objective-C)        │
│   - macOS: CGEventTap               │
│   - Linux: X11/evdev                │
│   - Windows: SetWindowsHookEx       │
└─────────────┬───────────────────────┘
              │ Records OS clicks
              ↓
┌─────────────────────────────────────┐
│      Correlation Engine (Rust)      │
│   - Matches OS vs DOM events        │
│   - Detects mismatches              │
│   - Generates alerts                │
└─────────────┬───────────────────────┘
              │ Correlates events
              ↑
┌─────────────────────────────────────┐
│      Browser Injector (JS)          │
│   - Chrome extension OR             │
│   - Native messaging host           │
└─────────────────────────────────────┘
```

## Installation

### macOS

```bash
# Install SDK
curl -fsSL https://install.click-detection.dev | sh

# Or build from source
cargo build --release
sudo ./install-macos.sh
```

### Linux

```bash
# Ubuntu/Debian
sudo apt-get install libx11-dev libxtst-dev
cargo build --release
sudo ./install-linux.sh
```

### Windows

```powershell
# Download installer
Invoke-WebRequest -Uri https://releases.click-detection.dev/windows -OutFile installer.exe
.\installer.exe
```

## Quick Start

### 1. Start the SDK daemon

```bash
click-detection-sdk start
```

### 2. Install browser extension

```bash
# Automatically installs extension for supported browsers
click-detection-sdk install-extension --browser chrome
```

### 3. Monitor clicks

```bash
# Open dashboard
click-detection-sdk dashboard

# Or access API
curl http://localhost:9999/api/events
```

## API Usage

### REST API

```bash
# Get recent events
GET http://localhost:9999/api/events?limit=100

# Get suspicious clicks only
GET http://localhost:9999/api/suspicious

# Get statistics
GET http://localhost:9999/api/stats
```

### SDK Library (Rust)

```rust
use click_detection_sdk::{Detector, Event};

fn main() {
    let mut detector = Detector::new().unwrap();

    detector.on_suspicious_click(|event: Event| {
        println!("Suspicious click detected: {:?}", event);
    });

    detector.start();
}
```

### SDK Library (Python)

```python
from click_detection_sdk import Detector

detector = Detector()

@detector.on_suspicious_click
def handle_suspicious(event):
    print(f"Suspicious click: {event}")

detector.start()
```

## Configuration

Edit `~/.click-detection/config.toml`:

```toml
[correlation]
time_window_ms = 100
position_tolerance_px = 10

[api]
port = 9999
host = "127.0.0.1"

[logging]
level = "info"
output = "~/.click-detection/logs"

[alerts]
webhook_url = "https://your-endpoint.com/alerts"
```

## Use Cases

- **Security monitoring**: Detect browser automation in corporate environments
- **Bot detection**: Identify automated interactions on web applications
- **Testing validation**: Ensure automated tests are properly detected
- **Research**: Study browser automation techniques

## Platform Support

| Platform | OS Monitor | Browser Inject | Status |
|----------|-----------|----------------|--------|
| macOS    | CGEventTap | ✅ | ✅ Supported |
| Linux    | X11/evdev | ✅ | ✅ Supported |
| Windows  | WinHook   | ✅ | 🚧 In Progress |

## Requirements

- **macOS**: 10.15+ (Catalina or later), accessibility permissions
- **Linux**: X11 or Wayland, root or input group permissions
- **Windows**: Windows 10+, administrator privileges for installation

## Security & Privacy

- All data processed locally, no external communication
- Requires user consent and OS permissions (accessibility/input)
- Open source, auditable code
- Data stored encrypted on disk

## License

MIT License - see LICENSE file

## Contributing

See CONTRIBUTING.md

## Support

- Documentation: https://docs.click-detection.dev
- Issues: https://github.com/your-org/click-detection-sdk/issues
- Discord: https://discord.gg/click-detection
