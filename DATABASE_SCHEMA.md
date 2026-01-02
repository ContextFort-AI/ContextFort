# ContextFort Database Schema

## Storage Technology
**Chrome Extension Local Storage** (`chrome.storage.local`)
- Key-Value storage (JSON-based)
- Maximum size: ~10MB per extension
- Persistent across browser sessions

---

## Storage Keys

| Key | Type | Description | Max Records |
|-----|------|-------------|-------------|
| `sessions` | Array | Agent mode sessions | Unlimited (auto-cleanup >24h) |
| `screenshots` | Array | Captured screenshots with events | 100 (FIFO) |
| `recentScreenshots` | Array | Cache for POST correlation | 10 (last 5 seconds) |
| `clickEvents` | Array | Click detection events | Unlimited |
| `blockedRequests` | Array | Blocked suspicious requests | Unlimited |
| `downloadRequests` | Array | Download monitoring | Unlimited |
| `whitelist` | Object | Whitelisted URLs/hostnames | N/A |
| `sensitiveWords` | Array | Custom sensitive words | N/A |
| `clickDetectionEnabled` | Boolean | Click detection toggle | N/A |
| `botModeEnabled` | Boolean | Bot mode toggle | N/A |

---

## Primary Schemas

### 1. Session Schema

**Storage Key:** `sessions`

```typescript
interface Session {
  // Primary Identifier
  id: number;              // Timestamp-based unique ID (e.g., 1767331812953)

  // Status & Lifecycle
  status: 'active' | 'ended';
  startTime: string;       // ISO 8601 format (e.g., "2025-01-01T10:30:00.000Z")
  endTime: string | null;  // ISO 8601 format or null if still active
  duration: number | null; // Duration in seconds (calculated on end)

  // Tab Information
  tabId: number;           // Chrome tab ID
  tabTitle: string;        // Page title at session start
  tabUrl: string;          // Page URL at session start

  // Metrics
  screenshotCount: number; // Total screenshots captured in this session
}
```

**Example:**
```json
{
  "id": 1767331812953,
  "status": "active",
  "startTime": "2025-01-01T10:30:00.000Z",
  "endTime": null,
  "duration": null,
  "tabId": 1295795555,
  "tabTitle": "Gmail - Inbox",
  "tabUrl": "https://mail.google.com/mail/u/0/#inbox",
  "screenshotCount": 15
}
```

---

### 2. Screenshot Schema

**Storage Key:** `screenshots`

```typescript
interface Screenshot {
  // Primary Identifier
  id: number;              // Timestamp + random (e.g., 1767331812953.123)

  // Relationship (Foreign Key)
  sessionId: number | null; // Links to Session.id

  // Tab Information
  tabId: number;           // Chrome tab ID
  url: string;             // Page URL where screenshot was taken
  title: string;           // Page title

  // Screenshot Data
  dataUrl: string;         // Base64 PNG data URL
  timestamp: string;       // ISO 8601 format
  reason: string;          // 'agent_event' | 'suspicious_click'

  // Event Classification
  eventType: EventType;    // Type of event that triggered screenshot

  // Event Metadata
  eventDetails: EventDetails;

  // Legacy Fields (for suspicious clicks)
  clickedElement?: ClickElement;
  clickCoordinates?: Coordinates;
  inputFields?: string[];
  inputValues?: object;
  postRequest?: object | null;
}
```

**Event Types:**
```typescript
type EventType =
  | 'click'      // User/agent clicked an element
  | 'input'      // Text input or textarea
  | 'change'     // Select, checkbox, radio change
  | 'submit'     // Form submission
  | 'keypress'   // Enter/Tab key press
  | 'navigation' // Page navigation (pushState, popstate, etc.)
  | 'new_tab'    // New tab opened
  | 'unknown';   // Fallback
```

---

### 3. Event Details Schema

```typescript
interface EventDetails {
  element: ElementInfo | null;
  coordinates: Coordinates | null;
  inputValue: number | string | null;
  actionType: string | null;
}

interface ElementInfo {
  // Standard Elements (click, input, change, submit, keypress)
  tag?: string;              // HTML tag name (e.g., "BUTTON", "INPUT")
  id?: string | null;        // Element ID
  className?: string | null; // CSS class name
  text?: string | null;      // Element text content (max 50 chars)
  type?: string | null;      // Input type (for INPUT elements)
  name?: string | null;      // Input name attribute
  action?: string | null;    // Form action URL

  // Navigation Events
  navigationType?: string;   // 'pushState' | 'replaceState' | 'popstate' | 'beforeunload'
  fromUrl?: string;          // Source URL
  toUrl?: string;            // Destination URL

  // New Tab Events
  newTabUrl?: string;        // URL opened in new tab
  newTabTitle?: string;      // Title of new tab
}

interface Coordinates {
  x: number;  // Click X coordinate
  y: number;  // Click Y coordinate
}
```

---

## Example Screenshots by Event Type

### Click Event
```json
{
  "id": 1767331812953.456,
  "sessionId": 1767331812953,
  "tabId": 1295795555,
  "url": "https://mail.google.com/mail/u/0/#inbox",
  "title": "Gmail - Inbox",
  "dataUrl": "data:image/png;base64,iVBORw0KGgo...",
  "timestamp": "2025-01-01T10:30:15.000Z",
  "reason": "agent_event",
  "eventType": "click",
  "eventDetails": {
    "element": {
      "tag": "BUTTON",
      "id": "send-button",
      "className": "btn btn-primary",
      "text": "Send"
    },
    "coordinates": {
      "x": 652,
      "y": 567
    },
    "inputValue": null,
    "actionType": "click"
  }
}
```

### Input Event
```json
{
  "id": 1767331813000.789,
  "sessionId": 1767331812953,
  "tabId": 1295795555,
  "url": "https://mail.google.com/mail/u/0/#inbox",
  "title": "Gmail - Compose",
  "dataUrl": "data:image/png;base64,iVBORw0KGgo...",
  "timestamp": "2025-01-01T10:30:20.000Z",
  "reason": "agent_event",
  "eventType": "input",
  "eventDetails": {
    "element": {
      "tag": "INPUT",
      "id": "subject",
      "className": "form-control",
      "name": "subject",
      "type": "text"
    },
    "coordinates": null,
    "inputValue": 25,
    "actionType": "input"
  }
}
```

### Navigation Event
```json
{
  "id": 1767331814000.123,
  "sessionId": 1767331812953,
  "tabId": 1295795555,
  "url": "https://mail.google.com/mail/u/0/#sent",
  "title": "Gmail - Sent Mail",
  "dataUrl": "data:image/png;base64,iVBORw0KGgo...",
  "timestamp": "2025-01-01T10:30:25.000Z",
  "reason": "agent_event",
  "eventType": "navigation",
  "eventDetails": {
    "element": {
      "tag": "NAVIGATION",
      "navigationType": "pushState",
      "fromUrl": "https://mail.google.com/mail/u/0/#inbox",
      "toUrl": "https://mail.google.com/mail/u/0/#sent"
    },
    "coordinates": null,
    "inputValue": null,
    "actionType": "navigation"
  }
}
```

### New Tab Event
```json
{
  "id": 1767331815000.456,
  "sessionId": 1767331812953,
  "tabId": 1295795556,
  "url": "https://docs.google.com/document/d/abc123",
  "title": "Untitled Document - Google Docs",
  "dataUrl": "data:image/png;base64,iVBORw0KGgo...",
  "timestamp": "2025-01-01T10:30:30.000Z",
  "reason": "agent_event",
  "eventType": "new_tab",
  "eventDetails": {
    "element": {
      "tag": "NEW_TAB",
      "text": "Opened in new tab",
      "newTabUrl": "https://docs.google.com/document/d/abc123",
      "newTabTitle": "Untitled Document - Google Docs"
    },
    "coordinates": null,
    "inputValue": null,
    "actionType": "new_tab_navigation"
  }
}
```

---

## Relationships

### One-to-Many: Session → Screenshots

```
sessions (1) ←→ (N) screenshots
   ↓                    ↓
Session.id ← sessionId (Foreign Key)
```

**Query Pattern:**
```javascript
// Get all screenshots for a specific session
const sessionId = 1767331812953;
const screenshots = allScreenshots.filter(s => s.sessionId === sessionId);

// Group screenshots by session
const sessionMap = new Map();
sessions.forEach(session => {
  sessionMap.set(session.id, {
    session: session,
    screenshots: allScreenshots.filter(s => s.sessionId === session.id)
  });
});
```

---

## Data Flow

### 1. Session Creation
```
Agent Mode Detected (debugger attached)
          ↓
Background: checkDebuggers()
          ↓
Create Session with unique ID
          ↓
Store in activeSessionsByTab Map
          ↓
Save to chrome.storage.local['sessions']
          ↓
Notify content script: AGENT_MODE_STARTED
```

### 2. Screenshot Capture
```
Event Detected in Content Script
          ↓
Send message to Background: CAPTURE_AGENT_EVENT_SCREENSHOT
          ↓
Background: Get sessionId from activeSessionsByTab
          ↓
Capture visible tab screenshot
          ↓
Create Screenshot object with sessionId
          ↓
Save to chrome.storage.local['screenshots']
          ↓
Increment session.screenshotCount
```

### 3. Session End
```
Debugger Detached / Tab Closed
          ↓
Background: Set session.status = 'ended'
          ↓
Calculate duration
          ↓
Save to chrome.storage.local['sessions']
          ↓
Remove from activeSessionsByTab
          ↓
Notify content script: AGENT_MODE_ENDED
```

---

## Storage Limits & Cleanup

### Screenshots
- **Maximum:** 100 records
- **Cleanup:** FIFO (First In, First Out)
- **Trigger:** On every new screenshot
```javascript
if (screenshots.length > 100) {
  screenshots.shift(); // Remove oldest
}
```

### Sessions
- **Maximum:** Unlimited during active use
- **Cleanup:** Sessions older than 24 hours (status='ended')
- **Trigger:** On extension startup/reload
```javascript
const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
sessions = sessions.filter(session => {
  if (session.status === 'ended') {
    const sessionTime = new Date(session.startTime).getTime();
    return sessionTime >= oneDayAgo;
  }
  return true;
});
```

### Recent Screenshots Cache
- **Maximum:** 10 records
- **Cleanup:** Records older than 5 seconds
- **Purpose:** Correlate screenshots with POST requests
```javascript
const fiveSecondsAgo = Date.now() - 5000;
const filteredRecent = recentScreenshots.filter(s => s.timestamp > fiveSecondsAgo);
```

---

## Indexes & Performance

### In-Memory Indexes
```javascript
// Active sessions by tab ID (O(1) lookup)
const activeSessionsByTab = new Map<tabId, sessionId>();

// Debugger state by tab ID (O(1) lookup)
const debuggerState = new Map<tabId, boolean>();
```

### Query Optimization
```javascript
// Efficient session lookup
const sessionIndex = sessions.findIndex(s => s.id === sessionId);

// Efficient filtering
const activeSessions = sessions.filter(s => s.status === 'active');
const sessionScreenshots = screenshots.filter(s => s.sessionId === sessionId);
```

---

## Data Integrity

### Constraints
1. **Session.id** must be unique (timestamp-based)
2. **Screenshot.sessionId** must reference valid Session.id (or null)
3. **Session.status** must be 'active' or 'ended'
4. **Session.duration** calculated as: `(endTime - startTime) / 1000` seconds

### Validation
- Tab IDs validated against Chrome API
- URLs validated as strings
- Timestamps in ISO 8601 format
- Base64 dataUrls validated on capture

### Orphan Prevention
- Sessions marked 'ended' on extension reload
- Screenshots without sessionId stored as null
- Cleanup removes old ended sessions

---

## Dashboard Query Examples

### Get All Active Sessions
```javascript
const result = await chrome.storage.local.get(['sessions']);
const activeSessions = result.sessions.filter(s => s.status === 'active');
```

### Get Screenshots for a Session
```javascript
const result = await chrome.storage.local.get(['screenshots', 'sessions']);
const sessionScreenshots = result.screenshots.filter(s => s.sessionId === 1767331812953);
```

### Get Session Statistics
```javascript
const result = await chrome.storage.local.get(['screenshots', 'sessions']);
const stats = {
  totalSessions: result.sessions.length,
  activeSessions: result.sessions.filter(s => s.status === 'active').length,
  totalScreenshots: result.screenshots.length,
  withPostRequests: result.screenshots.filter(s => s.postRequest !== null).length
};
```

### Group Screenshots by Event Type
```javascript
const result = await chrome.storage.local.get(['screenshots']);
const byEventType = result.screenshots.reduce((acc, screenshot) => {
  const type = screenshot.eventType || 'unknown';
  acc[type] = (acc[type] || 0) + 1;
  return acc;
}, {});
// Result: { click: 45, input: 30, navigation: 12, new_tab: 5, ... }
```

---

## Storage Usage Estimation

### Average Sizes
- **Session Object:** ~200 bytes
- **Screenshot Object (with 200KB image):** ~270 KB
- **100 Screenshots:** ~27 MB (exceeds chrome.storage.local limit)
- **Recommended:** Use compression or external storage for production

### Current Limits
- Max 100 screenshots = ~27 MB (at 270KB each)
- Chrome storage limit: ~10 MB
- **Note:** Current implementation may hit storage limits with large screenshots

### Optimization Recommendations
1. Compress screenshots before storage
2. Store only thumbnail in chrome.storage
3. Use IndexedDB for full-size images
4. Implement progressive cleanup
