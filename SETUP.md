# POST Monitor - Complete Setup Guide

A Chrome extension with backend dashboard for monitoring suspicious POST requests containing user input data.

## 🎯 Features

- **Real-time Monitoring**: Detects POST requests containing your input data
- **Visual Alerts**: On-screen notifications when suspicious requests are detected
- **Backend Storage**: Stores all detections in SQLite database
- **Beautiful Dashboard**: Web dashboard to view all detected requests with statistics
- **Auto-refresh**: Dashboard updates every 5 seconds

## 📁 Project Structure

```
blocker/
├── manifest.json           # Chrome extension manifest
├── background.js           # Background service worker
├── content.js             # Content script for page monitoring
├── popup.html             # Extension popup UI
├── popup.js               # Popup script
├── dashboard.html         # Web dashboard
├── test-page.html         # Test page for extension
├── backend/
│   ├── main.py           # FastAPI server
│   ├── database.py       # SQLite database models
│   ├── requirements.txt  # Python dependencies
│   ├── start.sh         # Startup script
│   └── post_monitor.db  # SQLite database (created automatically)
```

## 🚀 Quick Start

### Step 1: Start the Backend Server

```bash
cd backend
./start.sh
```

The server will start on `http://127.0.0.1:8000`

You should see:
```
✓ Server starting on http://127.0.0.1:8000
✓ API documentation available at http://127.0.0.1:8000/docs
```

**Note**: Keep this terminal window open - the server needs to run continuously.

### Step 2: Load the Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the `blocker` folder
5. The extension should now be loaded

### Step 3: Open the Dashboard

**Option 1**: Click the extension icon → Click "📊 Open Dashboard"

**Option 2**: Open `dashboard.html` directly in your browser:
```bash
open dashboard.html
```

### Step 4: Test It!

1. Open `test-page.html` in Chrome
2. The form is pre-filled with test data
3. Click the "Submit Form" button
4. You should see:
   - ✅ Red alert banner on the page
   - ✅ Chrome notification
   - ✅ Console logs showing detection
   - ✅ New entry in the dashboard

## 📊 Dashboard Features

### Statistics Cards
- **Total Requests**: Lifetime count of detected requests
- **Today**: Requests detected today
- **Unique Domains**: Number of unique domains targeted

### Request List
Each detected request shows:
- Timestamp (relative time)
- Target URL and hostname
- Source page URL
- Matched input fields
- Delete button

### Controls
- **🔄 Refresh**: Manually refresh data
- **🗑️ Clear All**: Delete all stored requests

## 🔧 API Endpoints

The backend provides these REST API endpoints:

### GET `/`
Server info and available endpoints

### POST `/api/blocked-requests`
Store a new blocked request
```json
{
  "target_url": "https://example.com/api",
  "target_hostname": "example.com",
  "source_url": "https://source.com",
  "matched_fields": ["email", "password"],
  "matched_values": {"email": "user@example.com", "password": "***"},
  "request_method": "POST",
  "status": "detected"
}
```

### GET `/api/blocked-requests`
Get all blocked requests (paginated)
- Query params: `skip`, `limit`, `hostname`

### GET `/api/stats`
Get statistics about blocked requests

### DELETE `/api/blocked-requests/{id}`
Delete a specific request

### DELETE `/api/blocked-requests`
Clear all requests

### API Documentation
Interactive API docs available at: `http://127.0.0.1:8000/docs`

## 🧪 Testing

### Manual Testing
1. Open `test-page.html`
2. Fill in form fields (or use pre-filled data)
3. Click "Submit Form (POST Request)"
4. Check for alerts and dashboard updates

### Test Different POST Formats
The test page includes buttons for:
- **Submit Form**: Regular JSON POST
- **Test JSON POST**: Explicit JSON payload
- **Test FormData POST**: multipart/form-data

### Checking Logs

**Content Script Console** (test page):
```
[POST Monitor] Click detected! Sending input data...
[POST Monitor] Tracking 5 input fields
```

**Background Console** (service worker):
```
[POST Monitor] ⚡ Click detected with 5 input fields
[POST Monitor] 📡 POST request detected to: httpbin.org
[POST Monitor] ✓ MATCH FOUND for field: name
[POST Monitor] ✓ Saved to backend with ID: 1
```

## 🛠️ Troubleshooting

### Extension Issues

**"Extension context invalidated" error:**
- Solution: Refresh the webpage after reloading the extension

**No click detection:**
- Check content script console for errors
- Make sure input fields have values
- Try clicking on different elements

**No POST detection:**
- Check background console (click "service worker" in chrome://extensions/)
- Verify click was detected first
- Check if POST happened within 3 seconds of click

### Backend Issues

**"Connection Error" in dashboard:**
- Make sure backend server is running: `cd backend && ./start.sh`
- Check server is on `http://127.0.0.1:8000`
- Look for errors in server terminal

**Module not found errors:**
- Make sure you're in the backend directory
- Run: `pip install -r requirements.txt`

**Database errors:**
- Delete `post_monitor.db` and restart server
- Server will create a fresh database

### Notification Issues

**No browser notifications:**
- Check macOS System Preferences → Notifications → Chrome
- Enable notifications and set to "Alerts" (not "Banners")
- Check Chrome settings: `chrome://settings/content/notifications`

**On-screen alert not showing:**
- Check content script console for errors
- Make sure page has finished loading
- Try clicking submit again

## 📝 Configuration

### Change Monitoring Window

Edit `background.js`:
```javascript
const MONITORING_WINDOW = 3000; // milliseconds (default: 3 seconds)
```

### Change Backend URL

Edit `background.js`:
```javascript
const API_URL = 'http://127.0.0.1:8000'; // Change if needed
```

Also update in `dashboard.html`:
```javascript
const API_URL = 'http://127.0.0.1:8000';
```

### Change Server Port

Edit `backend/main.py`:
```python
uvicorn.run(app, host="127.0.0.1", port=8000)  # Change port here
```

## 🔒 Security Notes

- The extension stores sensitive data (passwords, emails, etc.) in the database
- Keep the database file secure
- The backend accepts connections from any origin (CORS enabled)
- In production, restrict CORS to specific origins
- Consider encrypting sensitive fields in the database

## 📦 Production Deployment

### Backend
1. Use a production WSGI server (not uvicorn dev mode)
2. Configure proper CORS origins
3. Use environment variables for configuration
4. Set up database backups
5. Add authentication/authorization
6. Use HTTPS

### Extension
1. Generate proper extension icons
2. Publish to Chrome Web Store
3. Use extension-specific backend URL
4. Add user preferences for backend URL

## 🎨 Customization

### Change Alert Colors
Edit `content.js` `showPageAlert()` function:
```javascript
background: #ff5252;  // Red by default
```

### Dashboard Theme
Edit `dashboard.html` CSS:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## 📄 License

This is a personal project for security monitoring purposes.

## 🤝 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review console logs in both content and background scripts
3. Check backend server logs
4. Verify all files are in correct locations
