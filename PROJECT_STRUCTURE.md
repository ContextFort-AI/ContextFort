# ContextFort Security - Project Structure

Complete guide to the project architecture and folder organization.

## 📁 Directory Structure

```
context/blocker/
├── chrome-extension/          # Chrome Extension (MV3)
│   ├── manifest.json         # Extension manifest
│   ├── background.js         # Service worker (request monitoring)
│   ├── content.js           # Content script (DOM interaction)
│   ├── popup.js/html        # Extension popup UI
│   ├── icon128.png          # Extension icon
│   ├── tests/               # Test HTML files
│   └── README.md            # Extension documentation
│
├── backend/                  # Unified Backend (FastAPI)
│   ├── main.py              # FastAPI server (port 8000)
│   ├── database.py          # SQLAlchemy models & DB setup
│   ├── post_monitor.db      # SQLite database
│   ├── requirements.txt     # Python dependencies
│   ├── start.sh             # Startup script
│   └── README.md            # Backend documentation
│
├── contextfort-dashboard/    # Frontend Dashboard (Next.js)
│   ├── src/                 # Source code
│   │   ├── app/            # Next.js App Router pages
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and API clients
│   │   └── types/          # TypeScript type definitions
│   ├── .env.local          # Environment variables
│   ├── package.json        # Node dependencies
│   └── CONTEXTFORT_README.md # Dashboard documentation
│
├── browser-ai-detector/      # Native Click Detection (Optional)
│   └── native/              # macOS native monitor
│       ├── bridge.py        # Python bridge to backend
│       ├── macos_monitor.m  # Objective-C click monitor
│       └── Makefile         # Build native binary
│
├── venv/                     # Python virtual environment
│
└── Documentation Files
    ├── PROJECT_STRUCTURE.md      # This file
    ├── README.md                 # Main project README
    ├── SETUP.md                  # Setup instructions
    ├── START_HERE.md             # Quick start guide
    ├── TESTING.md                # Testing guide
    ├── LOAD_INSTRUCTIONS.md      # Extension load guide
    ├── QUICK_TEST_GUIDE.txt      # Quick testing
    └── INTEGRATION_TEST_RESULTS.md # Test results
```

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Chrome Extension                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ background.js│  │  content.js  │  │   popup.js   │     │
│  │ (Monitoring) │  │ (DOM Events) │  │   (UI/UX)    │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │              │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          │     HTTP API     │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│          Unified Backend (FastAPI - Port 8000)              │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  POST Request Monitoring                              │ │
│  │  • /api/blocked-requests                             │ │
│  │  • /api/blocked-requests/human                       │ │
│  │  • /api/blocked-requests/bot                         │ │
│  │  • /api/stats                                        │ │
│  └───────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Click Detection                                      │ │
│  │  • /api/click-detection/events/dom                   │ │
│  │  • /api/click-detection/events/os (optional)         │ │
│  │  • /api/click-detection/stats                        │ │
│  │  • /api/click-detection/recent                       │ │
│  └───────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Database (SQLite)                                    │ │
│  │  • blocked_requests table                            │ │
│  │  • click_events table                                │ │
│  │  • whitelist table                                   │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
          │                                    │
          │     HTTP API                       │ (Optional)
          ▼                                    ▼
┌─────────────────────────┐    ┌──────────────────────────────┐
│  Frontend Dashboard     │    │  Native Monitor (macOS)      │
│  (Next.js - Port 3000)  │    │  • OS-level click capture    │
│  • Real-time stats      │    │  • Sends to backend via API  │
│  • Request monitoring   │    │  • bridge.py + native binary │
│  • Click detection      │    └──────────────────────────────┘
│  • Pagination           │
└─────────────────────────┘
```

## 🔄 Data Flow

### 1. **User Interaction** (Browser)
```
User clicks button → content.js captures event → Sends to background.js
                                                         ↓
                                          POST /api/click-detection/events/dom
                                                         ↓
                                               Backend stores & analyzes
```

### 2. **Request Monitoring**
```
Page makes POST request → background.js intercepts
                                ↓
                    Correlates with recent clicks (3-second window)
                                ↓
                    Classifies as human/bot activity
                                ↓
                    POST /api/blocked-requests
                                ↓
                    Backend stores in database
                                ↓
                    Chrome notification + In-page alert
```

### 3. **Dashboard Visualization**
```
Frontend polls backend APIs (every 2-5 seconds)
                ↓
    GET /api/stats
    GET /api/click-detection/stats
    GET /api/blocked-requests
                ↓
    Display in real-time dashboard with pagination
```

## 🚀 Quick Start

### 1. Start Unified Backend
```bash
cd backend
/Users/rishabharya/Desktop/context/blocker/venv/bin/python main.py
# Server starts on http://127.0.0.1:8000
```

### 2. Start Frontend Dashboard
```bash
cd contextfort-dashboard
npm run dev
# Dashboard available at http://localhost:3000
```

### 3. Load Chrome Extension
1. Open Chrome → `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select: `/Users/rishabharya/Desktop/context/blocker/chrome-extension`

### 4. (Optional) Start Native Monitor
```bash
cd browser-ai-detector/native
python3 bridge.py
# Sends OS-level clicks to backend
```

## 📊 Database Schema

### blocked_requests table
```sql
- id (Primary Key)
- timestamp (DateTime)
- target_url (String)
- target_hostname (String)
- source_url (String)
- matched_fields (JSON Array)
- matched_values (JSON Object)
- request_method (String)
- status (String)
- is_bot (Boolean) - Human/Bot classification
- click_correlation_id (Integer)
- click_time_diff_ms (Integer)
- click_coordinates (JSON)
- has_click_correlation (Boolean)
```

### click_events table
```sql
- id (Primary Key)
- timestamp (Float) - Unix timestamp with ms precision
- x (Float) - Click X coordinate
- y (Float) - Click Y coordinate
- is_suspicious (Boolean)
- confidence (Float)
- reason (Text)
- action_type (String)
- page_url (String)
- page_title (String)
- target_tag (String)
- target_id (String)
- target_class (String)
- is_trusted (Boolean)
- created_at (DateTime)
```

### whitelist table
```sql
- id (Primary Key)
- url (String, Unique)
- hostname (String)
- added_at (DateTime)
- notes (Text)
```

## 🔧 Configuration

### Backend (`backend/main.py`)
- **Port**: 8000
- **Database**: SQLite (`post_monitor.db`)
- **CORS**: Enabled for all origins
- **Click correlation window**: 3000ms
- **OS click buffer**: 1000 recent clicks

### Frontend (`contextfort-dashboard/.env.local`)
```env
NEXT_PUBLIC_POST_MONITOR_API=http://127.0.0.1:8000
NEXT_PUBLIC_CLICK_DETECTION_API=http://localhost:8000
NEXT_PUBLIC_REFRESH_INTERVAL_POST=5000
NEXT_PUBLIC_REFRESH_INTERVAL_CLICK=1000
```

### Chrome Extension (`chrome-extension/background.js`)
```javascript
const API_URL = 'http://127.0.0.1:8000';
const CLICK_DETECTION_API_URL = 'http://127.0.0.1:8000';
const MONITORING_WINDOW = 2000; // 2 seconds
const CORRELATION_WINDOW = 3000; // 3 seconds
```

## 🧪 Testing

### Manual Testing
1. Load extension in Chrome
2. Visit any website with forms
3. Fill in form data
4. Click submit button
5. Check:
   - Chrome notification appears
   - In-page alert shows
   - Dashboard updates
   - Backend logs show request

### Test Files
- `chrome-extension/tests/integration-test.html` - Full integration test
- `chrome-extension/tests/screenshot-test.html` - Screenshot capture test

## 🐛 Debugging

### Backend Logs
```bash
cd backend
tail -f /tmp/claude/-Users-rishabharya-Desktop-context-blocker/tasks/[TASK_ID].output
```

### Frontend Logs
- Open http://localhost:3000
- Open Browser DevTools (F12) → Console

### Extension Logs
- Go to `chrome://extensions/`
- Click "Service Worker" link under extension
- View background.js logs

### Database Inspection
```bash
sqlite3 backend/post_monitor.db
sqlite> SELECT * FROM blocked_requests LIMIT 10;
sqlite> SELECT * FROM click_events LIMIT 10;
```

## 📝 Development Workflow

### Making Changes to Extension
1. Edit files in `chrome-extension/`
2. Go to `chrome://extensions/`
3. Click refresh icon ↻ for the extension
4. Test changes

### Making Changes to Backend
1. Edit `backend/main.py` or `backend/database.py`
2. Stop backend server (Ctrl+C)
3. Restart: `python main.py`
4. Changes take effect immediately

### Making Changes to Frontend
1. Edit files in `contextfort-dashboard/src/`
2. Next.js hot-reloads automatically
3. Refresh browser if needed

## 🔐 Security Considerations

- Extension monitors all HTTP requests (requires `<all_urls>` permission)
- Sensitive data stored in local SQLite database
- No data sent to external servers
- Chrome extension storage persists settings securely
- All processing happens locally

## 📦 Dependencies

### Backend (Python)
- FastAPI
- SQLAlchemy
- Uvicorn
- Pydantic

### Frontend (Node.js)
- Next.js 16.1.0
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui

### Extension
- Chrome Extension Manifest V3
- No external dependencies

## 🎯 Key Features

✅ **Request Monitoring** - Detects POST requests with user data
✅ **Click Detection** - Distinguishes human vs bot clicks
✅ **Human/Bot Classification** - AI-based activity analysis
✅ **Real-time Dashboard** - Live stats and monitoring
✅ **Global Toggle** - Enable/disable across all tabs
✅ **Pagination** - Handle large datasets efficiently
✅ **Chrome Notifications** - Instant alerts
✅ **Unified Backend** - Single API for all features

## 📚 Documentation

- **Main README**: `/README.md`
- **Extension Guide**: `/chrome-extension/README.md`
- **Backend Docs**: `/backend/README.md`
- **Dashboard Docs**: `/contextfort-dashboard/CONTEXTFORT_README.md`
- **Setup Guide**: `/SETUP.md`
- **Testing Guide**: `/TESTING.md`

## 🔗 Useful Links

- Backend API: http://127.0.0.1:8000
- Dashboard: http://localhost:3000
- Chrome Extensions: chrome://extensions/
- Extension Service Worker: chrome://inspect/#service-workers

---

**Version**: 2.0.0 (Unified Backend)
**Last Updated**: December 23, 2024
