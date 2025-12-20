# Testing Guide for POST Monitor Extension

## Step-by-Step Testing Instructions

### 1. Reload the Extension
1. Go to `chrome://extensions/`
2. Find "POST Request Monitor"
3. Click the reload button (circular arrow icon)
4. Click "service worker" to open the background console
5. You should see:
   ```
   [POST Monitor] Background script starting...
   [POST Monitor] Extension loaded and ready
   [POST Monitor] Monitoring strategy: Click-based POST request analysis
   ```

### 2. Open Test Page
1. Open `test-page.html` in Chrome
2. Press F12 to open DevTools
3. Go to Console tab
4. You should see:
   ```
   [POST Monitor] Content script starting...
   [POST Monitor] DOM already loaded, initializing immediately...
   [POST Monitor] Content script initialized - monitoring X input fields
   [POST Monitor] Click anywhere to start monitoring POST requests
   [Test Page] Page loaded. Extension should be monitoring this page.
   ```

### 3. Test the Flow
1. On the test page, the form is pre-filled with test data
2. Click the "Submit Form (POST Request)" button
3. **IMMEDIATELY** check both consoles:

**In Content Console (test page DevTools):**
```
[POST Monitor] Click detected! Sending input data to monitor POST requests...
[POST Monitor] Tracking 5 input fields
```

**In Background Console (service worker):**
```
[POST Monitor] ⚡ Click detected with 5 input fields
[POST Monitor] Input data: {name: "John Doe", email: "john.doe@example.com", ...}
[POST Monitor] Monitoring POST requests for next 3 seconds...
[POST Monitor] Active monitoring entries: 1
[POST Monitor] 📡 POST request detected to: httpbin.org
[POST Monitor] Checking against 1 monitoring entries
[POST Monitor] Checking entry from XXX ms ago
[POST Monitor] Entry has 5 input fields
[POST Monitor] Checking field: name = "John Doe"...
[POST Monitor] ✓ MATCH FOUND for field: name
... (more fields)
[POST Monitor] Total matches found: 5
[POST Monitor] ⚠️ DETECTED POST request with user input!
[POST Monitor] Target: https://httpbin.org/post
[POST Monitor] Matched fields: name, email, password, phone, message
[POST Monitor] Attempting to create notification...
[POST Monitor] Notification created with ID: ...
```

### 4. Check for Notification
- You should see a Chrome notification in the top-right corner
- Title: "⚠️ Suspicious POST Request Detected"
- Message: "Request to httpbin.org contains 5 field(s) from your input: name, email, password, phone, message"

## Troubleshooting

### No logs in content console?
- Make sure you're looking at the test page's console, not the extension popup
- Reload the test page

### No logs about click detection?
- Make sure the form fields have values (they should be pre-filled)
- Try clicking the submit button again

### No POST request detected?
- Check if the background console shows "POST request detected but no active monitoring"
- This means the click detection didn't work - check content console for errors

### POST detected but no matches?
- Look for the detailed field checking logs
- Check what the POST body contains (it will be logged)
- Make sure the request body actually contains your input values

### Notification not appearing?
- Check background console for "Notification error"
- Make sure Chrome notifications are enabled for your browser
- Check Chrome notification settings (System Preferences on Mac)
