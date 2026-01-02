# ContextFort Database Entity Relationship Diagram

## Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────┐
│                     Chrome Storage (chrome.storage.local)        │
└─────────────────────────────────────────────────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
        ▼                         ▼                         ▼
┌───────────────┐         ┌──────────────┐        ┌─────────────────┐
│   sessions    │         │ screenshots  │        │ recentScreenshots│
│   (Array)     │         │   (Array)    │        │    (Array)       │
└───────────────┘         └──────────────┘        └─────────────────┘
        │                         │                         │
        │ 1                  N    │                         │
        └────────────┬────────────┘                         │
                     │                                      │
                Relationship                          (Cache for
              (sessionId FK)                        POST correlation)


┌─────────────────────────────────────────────────────────────────┐
│                          Session Entity                          │
├─────────────────────────────────────────────────────────────────┤
│ PK  id: number (timestamp)                                       │
│     status: 'active' | 'ended'                                   │
│     startTime: string (ISO 8601)                                 │
│     endTime: string | null                                       │
│     duration: number | null (seconds)                            │
│     tabId: number                                                │
│     tabTitle: string                                             │
│     tabUrl: string                                               │
│     screenshotCount: number (calculated)                         │
└─────────────────────────────────────────────────────────────────┘
                             │
                             │ 1:N
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Screenshot Entity                          │
├─────────────────────────────────────────────────────────────────┤
│ PK  id: number (timestamp + random)                             │
│ FK  sessionId: number | null → Session.id                       │
│     tabId: number                                                │
│     url: string                                                  │
│     title: string                                                │
│     dataUrl: string (Base64 PNG)                                 │
│     timestamp: string (ISO 8601)                                 │
│     reason: string                                               │
│     eventType: EventType                                         │
│     eventDetails: EventDetails                                   │
│     clickedElement?: ClickElement (legacy)                       │
│     clickCoordinates?: Coordinates (legacy)                      │
│     inputFields?: string[] (legacy)                              │
│     inputValues?: object (legacy)                                │
│     postRequest?: object | null (legacy)                         │
└─────────────────────────────────────────────────────────────────┘
                             │
                             │ Composition
                             ▼
                  ┌──────────────────────┐
                  │   EventDetails       │
                  ├──────────────────────┤
                  │ element: ElementInfo │
                  │ coordinates: {...}   │
                  │ inputValue: ...      │
                  │ actionType: string   │
                  └──────────────────────┘
                             │
                             ▼
        ┌────────────────────────────────────────────┐
        │           ElementInfo (Union Type)         │
        ├────────────────────────────────────────────┤
        │ Standard Element:                          │
        │   tag, id, className, text, type, name     │
        │                                            │
        │ Navigation Element:                        │
        │   navigationType, fromUrl, toUrl           │
        │                                            │
        │ New Tab Element:                           │
        │   newTabUrl, newTabTitle                   │
        └────────────────────────────────────────────┘
```

---

## Data Flow Diagram

### Session Lifecycle
```
┌──────────────────────────────────────────────────────────────────┐
│                        Agent Mode Starts                          │
└──────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │  Background Script       │
                    │  checkDebuggers()        │
                    └──────────────────────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │  Create Session Object   │
                    │  id = Date.now()         │
                    │  status = 'active'       │
                    └──────────────────────────┘
                                  │
                  ┌───────────────┴────────────────┐
                  ▼                                ▼
    ┌────────────────────────┐      ┌──────────────────────────┐
    │ activeSessionsByTab    │      │ chrome.storage.local     │
    │ .set(tabId, sessionId) │      │ sessions.push(session)   │
    └────────────────────────┘      └──────────────────────────┘
                                                  │
                                                  ▼
                                    ┌──────────────────────────┐
                                    │ Content Script Notified  │
                                    │ AGENT_MODE_STARTED       │
                                    └──────────────────────────┘
```

### Screenshot Capture Flow
```
┌──────────────────────────────────────────────────────────────────┐
│                    User/Agent Event Occurs                        │
│              (click, input, navigation, etc.)                     │
└──────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │  Content Script          │
                    │  trackAgentClick()       │
                    │  trackAgentInput()       │
                    │  trackAgentNavigation()  │
                    └──────────────────────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │  Send Message to BG:     │
                    │  CAPTURE_AGENT_EVENT_    │
                    │  SCREENSHOT              │
                    └──────────────────────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │  Background Script       │
                    │  Get sessionId from      │
                    │  activeSessionsByTab     │
                    └──────────────────────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │  chrome.tabs.            │
                    │  captureVisibleTab()     │
                    └──────────────────────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │  Create Screenshot       │
                    │  Object with:            │
                    │  - sessionId (FK)        │
                    │  - eventType             │
                    │  - eventDetails          │
                    │  - dataUrl (Base64)      │
                    └──────────────────────────┘
                                  │
                  ┌───────────────┴────────────────┐
                  ▼                                ▼
    ┌────────────────────────┐      ┌──────────────────────────┐
    │ chrome.storage.local   │      │ Update Session:          │
    │ screenshots.push()     │      │ screenshotCount++        │
    └────────────────────────┘      └──────────────────────────┘
```

### Session End Flow
```
┌──────────────────────────────────────────────────────────────────┐
│                   Agent Mode Ends / Tab Closes                    │
└──────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │  Background Script       │
                    │  chrome.tabs.onRemoved   │
                    │  or debugger detached    │
                    └──────────────────────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │  Get sessionId from      │
                    │  activeSessionsByTab     │
                    └──────────────────────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │  Update Session:         │
                    │  status = 'ended'        │
                    │  endTime = now           │
                    │  duration = (end-start)  │
                    └──────────────────────────┘
                                  │
                  ┌───────────────┴────────────────┐
                  ▼                                ▼
    ┌────────────────────────┐      ┌──────────────────────────┐
    │ chrome.storage.local   │      │ activeSessionsByTab      │
    │ sessions[i] = updated  │      │ .delete(tabId)           │
    └────────────────────────┘      └──────────────────────────┘
                                                  │
                                                  ▼
                                    ┌──────────────────────────┐
                                    │ Content Script Notified  │
                                    │ AGENT_MODE_ENDED         │
                                    └──────────────────────────┘
```

---

## Storage Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                  Browser Extension Architecture                  │
└─────────────────────────────────────────────────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
        ▼                         ▼                         ▼
┌───────────────┐         ┌──────────────┐        ┌─────────────────┐
│   Background  │         │   Content    │        │   Dashboard     │
│    Script     │         │   Script     │        │   (Override)    │
│               │         │              │        │                 │
│ - Session Mgmt│◄───────►│ - Event      │        │ - Data Display  │
│ - Screenshot  │         │   Detection  │        │ - Queries       │
│   Capture     │         │ - Agent Mode │        │ - Stats         │
│ - Storage I/O │         │   Tracking   │        │                 │
└───────┬───────┘         └──────────────┘        └────────┬────────┘
        │                                                   │
        │                                                   │
        └───────────────────┬───────────────────────────────┘
                            ▼
                ┌───────────────────────────┐
                │  chrome.storage.local     │
                │                           │
                │  ┌─────────────────────┐  │
                │  │ sessions: [...]     │  │
                │  │ screenshots: [...]  │  │
                │  │ recentScreenshots   │  │
                │  │ clickEvents         │  │
                │  │ blockedRequests     │  │
                │  │ downloadRequests    │  │
                │  │ whitelist           │  │
                │  │ sensitiveWords      │  │
                │  └─────────────────────┘  │
                └───────────────────────────┘
                            │
                            ▼
                ┌───────────────────────────┐
                │  Browser Disk Storage     │
                │  (Persistent, ~10MB max)  │
                └───────────────────────────┘
```

---

## Event Type Hierarchy

```
EventType (Union)
├── click
│   └── eventDetails.element: { tag, id, className, text }
│
├── input
│   └── eventDetails.element: { tag, id, className, name, type }
│   └── eventDetails.inputValue: number (length)
│
├── change
│   └── eventDetails.element: { tag, id, className, name, type }
│   └── eventDetails.inputValue: string | boolean
│
├── submit
│   └── eventDetails.element: { tag, id, className, action }
│
├── keypress
│   └── eventDetails.element: { tag, id, className, type }
│   └── eventDetails.key: string ('Enter' | 'Tab')
│
├── navigation
│   └── eventDetails.element: {
│         tag: 'NAVIGATION',
│         navigationType: 'pushState' | 'replaceState' | 'popstate' | 'beforeunload',
│         fromUrl: string,
│         toUrl: string
│       }
│
└── new_tab
    └── eventDetails.element: {
          tag: 'NEW_TAB',
          text: 'Opened in new tab',
          newTabUrl: string,
          newTabTitle: string
        }
```

---

## Query Patterns

### Pattern 1: Get All Data for a Session
```javascript
// Get session and all its screenshots
async function getSessionWithScreenshots(sessionId) {
  const result = await chrome.storage.local.get(['sessions', 'screenshots']);

  const session = result.sessions.find(s => s.id === sessionId);
  const screenshots = result.screenshots.filter(s => s.sessionId === sessionId);

  return {
    session,
    screenshots,
    eventTypeCounts: screenshots.reduce((acc, s) => {
      acc[s.eventType] = (acc[s.eventType] || 0) + 1;
      return acc;
    }, {})
  };
}
```

### Pattern 2: Group Screenshots by Session
```javascript
// Build session -> screenshots map
async function groupScreenshotsBySession() {
  const result = await chrome.storage.local.get(['sessions', 'screenshots']);

  const sessionMap = new Map();

  result.sessions.forEach(session => {
    sessionMap.set(session.id, {
      session: session,
      screenshots: result.screenshots.filter(s => s.sessionId === session.id)
    });
  });

  return sessionMap;
}
```

### Pattern 3: Get Statistics
```javascript
// Calculate dashboard statistics
async function getStatistics() {
  const result = await chrome.storage.local.get(['sessions', 'screenshots']);

  return {
    sessions: {
      total: result.sessions.length,
      active: result.sessions.filter(s => s.status === 'active').length,
      ended: result.sessions.filter(s => s.status === 'ended').length
    },
    screenshots: {
      total: result.screenshots.length,
      byEventType: result.screenshots.reduce((acc, s) => {
        acc[s.eventType] = (acc[s.eventType] || 0) + 1;
        return acc;
      }, {}),
      withPostRequests: result.screenshots.filter(s => s.postRequest).length
    }
  };
}
```

---

## Memory Management

### In-Memory State (Background Script)
```
┌───────────────────────────────────────┐
│  activeSessionsByTab: Map             │
│  ┌─────────────────────────────────┐  │
│  │ tabId → sessionId               │  │
│  │ 1295795555 → 1767331812953      │  │
│  │ 1295795558 → 1767331987603      │  │
│  └─────────────────────────────────┘  │
└───────────────────────────────────────┘

┌───────────────────────────────────────┐
│  debuggerState: Map                   │
│  ┌─────────────────────────────────┐  │
│  │ tabId → isAttached (boolean)    │  │
│  │ 1295795555 → true               │  │
│  │ 1295795558 → true               │  │
│  └─────────────────────────────────┘  │
└───────────────────────────────────────┘
```

### Persistent Storage (chrome.storage.local)
```
┌────────────────────────────────────────────────┐
│  Storage Size Breakdown (Estimated)            │
├────────────────────────────────────────────────┤
│  sessions (100 records):        ~20 KB         │
│  screenshots (100 records):     ~27 MB         │
│  recentScreenshots (10):        ~2.7 MB        │
│  clickEvents:                   Variable       │
│  blockedRequests:               Variable       │
│  downloadRequests:              Variable       │
│  whitelist:                     ~1 KB          │
│  sensitiveWords:                ~1 KB          │
├────────────────────────────────────────────────┤
│  TOTAL (approx):                ~30 MB         │
│  Chrome Limit:                  ~10 MB         │
│  ⚠️  EXCEEDS LIMIT WITH 100 SCREENSHOTS!      │
└────────────────────────────────────────────────┘
```

**Note:** Current implementation may exceed Chrome storage limits. Consider:
1. Reducing max screenshots to 30-35
2. Compressing images
3. Using IndexedDB for large data
4. Implementing progressive cleanup

---

## Indexes for Performance

### Primary Keys
- `Session.id` - Unique, timestamp-based
- `Screenshot.id` - Unique, timestamp + random

### Foreign Keys
- `Screenshot.sessionId` → `Session.id`

### Lookup Performance
```
Operation                    Complexity    Method
─────────────────────────────────────────────────────
Find session by ID          O(n)          .find()
Find screenshots by session O(n)          .filter()
Get active sessions         O(n)          .filter()
Group by session            O(n + m)      Map creation

Where:
  n = number of sessions
  m = number of screenshots
```

### Optimization Opportunities
1. Build in-memory index on page load
2. Cache grouped data
3. Use Map instead of Array for O(1) lookups
4. Implement lazy loading for screenshots
