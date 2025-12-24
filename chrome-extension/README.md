# ContextFort Security Chrome Extension

A Chrome extension for detecting and blocking suspicious POST requests with user input data, integrated with click detection to differentiate between human and bot activity.

## 📁 Project Structure

```
chrome-extension/
├── manifest.json           # Chrome extension manifest (MV3)
├── background.js          # Service worker for request monitoring
├── content.js            # Content script for DOM interaction
├── popup.js              # Popup UI logic
├── popup.html            # Extension popup interface
├── icon128.png           # Extension icon
└── tests/                # Test and demo files
    ├── dashboard.html
    ├── click-detection-dashboard.html
    └── integration-test.html
```

## 🚀 Installation

### Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Select this folder: `/Users/rishabharya/Desktop/context/blocker/chrome-extension`

## ⚙️ Configuration

The extension connects to the unified backend server on **port 8000**:

### Backend API Endpoints
- **POST Monitor**: `http://127.0.0.1:8000/api/blocked-requests`
- **Click Detection**: `http://127.0.0.1:8000/api/click-detection/*`

### Required Backend

Make sure the unified backend is running:

```bash
cd /Users/rishabharya/Desktop/context/blocker/backend
python main.py
```

## 🔧 Core Components

### 1. **background.js** (Service Worker)
- Monitors all web requests for suspicious activity
- Correlates POST requests with click events
- Classifies requests as human or bot-initiated
- Communicates with backend API
- Manages click detection toggle state

**Key Features:**
- Request monitoring with 2-second window after user actions
- Click correlation with 3-second window
- Real-time statistics tracking
- Chrome notifications for detected requests

### 2. **content.js** (Content Script)
- Injected into all web pages
- Monitors user interactions (clicks, form inputs)
- Displays in-page alerts for detected requests
- Handles click detection for human/bot classification

**Key Features:**
- DOM click event capture
- Form input tracking
- Real-time alert modals
- Click detection event handling

### 3. **popup.js/html** (Extension Popup)
- User interface for extension control
- Toggle click detection globally
- View extension status
- Quick access to dashboard

**Features:**
- Global click detection toggle (persists across tabs)
- Real-time status indicators
- Dashboard link

## 🔍 Features

### Request Monitoring
- ✅ Detects POST requests with user input data
- ✅ Monitors requests triggered by button/link clicks
- ✅ Correlates requests with click events
- ✅ Classifies as human or bot activity
- ✅ Sends data to backend for analysis

### Click Detection
- ✅ Captures all click events (coordinates, timestamp)
- ✅ Detects suspicious automated clicks
- ✅ Works across all browser tabs
- ✅ Persists state across page reloads
- ✅ Global enable/disable toggle

### Notifications
- ✅ Chrome notifications for detected requests
- ✅ In-page modal alerts with request details
- ✅ Shows human vs bot classification
- ✅ Displays matched input fields

## 🔐 Permissions

The extension requires the following permissions (see `manifest.json`):

- **`storage`** - Save settings and state
- **`notifications`** - Display detection alerts
- **`webRequest`** - Monitor HTTP requests
- **`activeTab`** - Access active tab for screenshots
- **`tabs`** - Manage tabs and state
- **`scripting`** - Inject content scripts
- **`<all_urls>`** - Monitor requests on all websites

## 🐛 Debugging

### View Extension Logs
1. Open Chrome DevTools (F12)
2. Go to **Console** tab
3. Filter by:
   - `[POST Monitor]` - Request monitoring logs
   - `[Click Detection]` - Click event logs
   - `[Screenshot]` - Screenshot capture logs

### Background Service Worker Logs
1. Go to `chrome://extensions/`
2. Find "ContextFort Security"
3. Click **Service Worker** link
4. View background.js logs

### Test Files

Use the test HTML files in `tests/` folder:
- **`integration-test.html`** - Full integration testing
- **`dashboard.html`** - Request monitoring dashboard
- **`click-detection-dashboard.html`** - Click detection stats

## 📊 API Integration

### Blocked Requests API
```javascript
POST http://127.0.0.1:8000/api/blocked-requests
{
  "target_url": "https://example.com/api",
  "target_hostname": "example.com",
  "matched_fields": ["email", "password"],
  "matched_values": {"email": "user@example.com"},
  "is_bot": false,
  "click_correlation_id": 123,
  "click_time_diff_ms": 150
}
```

### Click Detection API
```javascript
POST http://127.0.0.1:8000/api/click-detection/events/dom
{
  "x": 450.5,
  "y": 200.3,
  "timestamp": 1703347200.123,
  "page_url": "https://example.com",
  "page_title": "Example Page",
  "action_type": "click"
}
```

## 🔄 How It Works

1. **User clicks a button/link** → Content script detects click
2. **Form inputs tracked** → Content script monitors input values
3. **Click sent to API** → Background worker forwards to click detection API
4. **API analyzes click** → Returns suspicious/legitimate classification
5. **POST request detected** → Background worker intercepts request
6. **Click correlation** → Matches request with recent clicks (3-second window)
7. **Classification** → Determines if human or bot-initiated
8. **Backend storage** → Sends data to unified backend
9. **User notification** → Shows Chrome notification + in-page alert
10. **Dashboard update** → Real-time dashboard reflects new data

## 🛠️ Development

### Reload Extension After Changes

1. Go to `chrome://extensions/`
2. Find "ContextFort Security"
3. Click the **refresh icon** ↻

### Hot Reload (Optional)
The extension doesn't have automatic hot-reload. You need to manually reload after code changes.

## 📝 Notes

- Extension uses Manifest V3 (modern Chrome extension format)
- Service worker persists state across page reloads
- Global click detection works across all tabs
- All data stored in unified backend database

## 🔗 Related Components

- **Backend API**: `/backend/main.py`
- **Frontend Dashboard**: `/contextfort-dashboard/`
- **Native Monitor**: `/browser-ai-detector/native/bridge.py` (optional)

## 📄 License

Part of ContextFort Security project.
