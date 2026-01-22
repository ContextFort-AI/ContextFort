# Development Workflow with Real Chrome Storage Data

This guide shows you how to develop the dashboard UI with **instant hot reload** while using **real data from your Chrome extension**.

## 🚀 Quick Start

### 1. Export Chrome Storage Data (One Time / When You Want Fresh Data)

1. Load your Chrome extension
2. Navigate to: `chrome-extension://<YOUR-EXTENSION-ID>/export-storage.html`
   - Or use the full path: `file:///Users/ashwin/agents-blocker/chrome-extension/export-storage.html` if testing locally
3. Click **"Export Storage Data"** button
4. Save the downloaded JSON file as `mock-storage-data.json`
5. Move it to: `/Users/ashwin/agents-blocker/contextfort-dashboard/public/mock-storage-data.json`

**Tip:** You can also click "View Data" to preview what will be exported before downloading.

### 2. Start the Dev Server

```bash
cd contextfort-dashboard
npm run dev
```

The dashboard will now be available at `http://localhost:3000` with:
- ✅ Instant hot reload (changes reflect immediately)
- ✅ Real data from your Chrome extension
- ✅ Full Next.js dev experience

### 3. Iterate on UI

Make changes to any component in `src/app/` and see them instantly in your browser!

## 📊 Updating Mock Data

Whenever you want to refresh the dashboard with new data from your extension:

1. Go to `chrome-extension://<YOUR-EXTENSION-ID>/export-storage.html`
2. Click "Export Storage Data"
3. Replace `contextfort-dashboard/public/mock-storage-data.json` with the new file
4. Refresh your browser at `http://localhost:3000` (dev server will reload automatically)

## 🔧 How It Works

### Mock Chrome API
The dev server loads `/public/mock-chrome-api.js` which creates a mock `chrome.storage.local` API that:
- Reads from `/public/mock-storage-data.json`
- Simulates all Chrome storage methods (`get`, `set`, `remove`, `clear`)
- Only loads in development mode (`process.env.NODE_ENV === 'development'`)

### Storage Keys Exported
The export utility captures all these keys:
- `blockedRequests` - POST requests data
- `clickEvents` - Click detection data
- `downloadRequests` - Download monitoring data
- `screenshots` - Screenshot capture data
- `sessions` - Session tracking data
- `whitelist` - Whitelisted URLs/hostnames
- `sensitiveWords` - Sensitive words configuration

## 🎯 Benefits

**Before (Old Workflow):**
1. Edit code → 2. Build extension → 3. Reload extension → 4. Test changes
   - **~30-60 seconds per iteration**

**After (New Workflow):**
1. Edit code → 2. See changes instantly
   - **~1 second per iteration**

You only need to build and reload the extension when you're done iterating and want to test the full integration!

## 📝 Notes

- Mock data is **read-only** in dev mode - changes won't persist
- When you build for production, the real Chrome API is used
- The mock API logs all calls to console for debugging
- You can edit `mock-storage-data.json` manually if needed

## 🔄 Production Build

When you're ready to build for the extension:

```bash
npm run build
```

This will create a production build without the mock API, ready to be copied to your Chrome extension.
