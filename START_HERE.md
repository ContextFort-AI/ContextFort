# 🚀 Quick Start Guide

## Get Everything Running in 3 Steps

### Step 1: Start the Backend Server

Open a terminal and run:

```bash
cd /Users/rishabharya/Desktop/context/blocker/backend
./start.sh
```

Keep this terminal window open! You should see:
```
✓ Server starting on http://127.0.0.1:8000
```

### Step 2: Load the Extension

1. Open Chrome
2. Go to `chrome://extensions/`
3. Enable "Developer mode" (top-right toggle)
4. Click "Load unpacked"
5. Select: `/Users/rishabharya/Desktop/context/blocker`

### Step 3: Open the Dashboard

```bash
open /Users/rishabharya/Desktop/context/blocker/dashboard.html
```

OR click the extension icon in Chrome and click "📊 Open Dashboard"

---

## Test It!

Open the test page:
```bash
open /Users/rishabharya/Desktop/context/blocker/test-page.html
```

1. Click "Submit Form (POST Request)"
2. Watch for:
   - Red alert on the page
   - Browser notification
   - New entry in dashboard

---

## What You'll See

### On the Test Page:
- 🔴 Red alert banner in top-right corner
- Details about matched fields

### In the Dashboard:
- 📊 Statistics (Total requests, Today's count, Unique domains)
- 📋 List of all detected requests
- 🔄 Auto-refreshes every 5 seconds

### In Browser Console (F12):
```
[POST Monitor] Click detected! Sending input data...
[POST Monitor] ⚠️ DETECTED POST request with user input!
[POST Monitor] ✓ Saved to backend with ID: 1
```

---

## Troubleshooting

### Backend not starting?
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

### Extension not working?
1. Reload extension in chrome://extensions/
2. Refresh any open web pages
3. Check "service worker" console for errors

### Dashboard shows connection error?
- Make sure backend server is running
- Check terminal for errors
- Visit http://127.0.0.1:8000 to verify server is up

---

## Next Steps

📖 Read the full documentation: [SETUP.md](SETUP.md)

🎯 Key Features:
- Real-time POST request monitoring
- SQLite database storage
- Beautiful web dashboard
- Visual alerts on pages
- Chrome notifications

Happy monitoring! 🛡️
