# 🚀 Loading ContextFort Extension in Chrome

## ✅ Backend Status: READY

- **POST Monitor Backend:** ✅ Running on port 8000 (PID: 7775)
- **Click Detection Backend:** ✅ Running on port 9999 (PID: 6816)

---

## 📥 Step 1: Open Chrome Extensions Page

**Option A:** Type in address bar:
```
chrome://extensions/
```

**Option B:** Menu navigation:
1. Click the three dots (⋮) in top-right corner
2. Click "Extensions" → "Manage Extensions"

---

## 🔧 Step 2: Enable Developer Mode

1. Look for the **"Developer mode"** toggle in the top-right corner
2. Click to **turn it ON** (should turn blue)
3. Three new buttons will appear: "Load unpacked", "Pack extension", "Update"

---

## 📂 Step 3: Load the Extension

1. Click the **"Load unpacked"** button
2. A file picker dialog will open
3. Navigate to: `/Users/rishabharya/Desktop/context/blocker`
4. Click **"Select"** or **"Open"**

---

## ✅ Step 4: Verify Extension Loaded

You should see a new card appear with:
- **Name:** ContextFort - Security Suite
- **Version:** 1.0.0
- **Description:** POST request monitoring, AI click detection, and screenshot auto-blur protection
- **ID:** (a random string like `abcdefghij...`)
- Extension icon (if any)

**If you see errors:** Check the console below the extension card for details.

---

## 🎯 Step 5: Pin the Extension

1. Click the **puzzle piece icon** (🧩) in the Chrome toolbar
2. Find "ContextFort - Security Suite"
3. Click the **pin icon** (📌) next to it
4. The extension icon should now appear in your toolbar

---

## 🔄 Step 6: Refresh Your Test Page

Since we've just loaded the extension, refresh the integration test page:
1. Go to the integration-test.html tab
2. Press **Cmd+R** (or Ctrl+R on Windows)
3. The extension should now be active on the page

---

## ⚙️ Step 7: Enable Features

1. **Click the extension icon** in your toolbar
2. You should see the popup with three sections:
   - POST Request Monitor (always active)
   - Auto-Blur on Screenshot
   - Click Detection (AI Protection)

### Enable Auto-Blur:
1. In the "Auto-Blur on Screenshot" section
2. Type words to blur (e.g., "Rishabh, Arya")
3. Click **"Enable Auto-Blur"** button
4. Status should change to "Active - Monitoring screenshots"

### Enable Click Detection:
1. In the "Click Detection (AI Protection)" section
2. Click **"Enable Click Detection"** button
3. Status should change to "Active - Monitoring clicks"

---

## 🧪 Step 8: Run Tests

Go to the **integration-test.html** page and test each feature:

### Test 1: POST Request Detection
1. Fill in name, email, and message
2. Click "Submit Form (Test POST Detection)"
3. **Expected Results:**
   - ✅ Alert popup on page (red banner at top-right)
   - ✅ Browser notification
   - ✅ Entry appears in POST Monitor Dashboard

### Test 2: Click Detection
1. Click "Click Me Manually (Legitimate)" button
   - ✅ Should see green checkmark
   - ✅ Check Click Detection Dashboard - marked as LEGITIMATE

2. Click "Trigger Automated Click (Suspicious)"
   - ✅ Should see red circle warning on page
   - ✅ Check Click Detection Dashboard - marked as SUSPICIOUS

### Test 3: Screenshot Blur
1. Type your name in the form
2. Click "Update Name Display"
3. Make sure Auto-Blur is enabled
4. Take a screenshot (Cmd+Shift+4 or DevTools)
5. **Expected:** Your name appears blurred in screenshot

---

## 📊 Step 9: View Dashboards

Open the dashboards to see real-time data:

### POST Monitor Dashboard:
1. Click extension icon
2. Click "📊 POST Monitor" button
3. Or open: `/Users/rishabharya/Desktop/context/blocker/dashboard.html`

### Click Detection Dashboard:
1. Click extension icon
2. Click "🛡️ Click Detection" button
3. Or open: `/Users/rishabharya/Desktop/context/blocker/click-detection-dashboard.html`

---

## 🐛 Troubleshooting

### Extension Won't Load
- **Error:** Check for red error messages under the extension card
- **Solution:** Look at browser console (F12) for details

### Features Not Working
1. **Refresh the page** after loading extension
2. Make sure both backends are running (check above)
3. Open browser console (F12) and look for errors

### Backend Connection Errors
- **Error:** "Failed to fetch" or connection refused
- **Solution:** Both backends should be running:
  ```bash
  # Check if running:
  lsof -i :8000 -i :9999 | grep LISTEN
  ```

### POST Detection Not Working
- Make sure you've **clicked on something** on the page with input fields filled
- Extension monitors POST requests for 2 seconds after clicking

### Click Detection Not Working
- Backend must be running on port 9999
- Extension must be enabled in popup
- Check browser console for CORS or connection errors

---

## 🎉 Success Checklist

- [ ] Extension appears in chrome://extensions/
- [ ] No errors shown under extension card
- [ ] Extension icon appears in toolbar
- [ ] Popup opens when clicking icon
- [ ] Both backends running (ports 8000 and 9999)
- [ ] Features can be enabled in popup
- [ ] Test page can connect to backends
- [ ] POST requests are detected
- [ ] Click detection distinguishes manual vs automated
- [ ] Dashboards display real-time data

---

## 📞 Quick Reference

**Extension Location:**
```
/Users/rishabharya/Desktop/context/blocker
```

**Test Page:**
```
file:///Users/rishabharya/Desktop/context/blocker/integration-test.html
```

**Backend URLs:**
- POST Monitor: http://localhost:8000/api/stats
- Click Detection: http://localhost:9999/api/stats

**Chrome Extensions:**
```
chrome://extensions/
```

---

Ready to load? Follow Step 1 above! 🚀
