# PostHog Analytics Documentation

## Overview

PostHog is used for analytics to track extension usage, agent sessions, and blocking events. It can be completely disabled with a single line change.

## Quick Disable

**To disable PostHog:** Change line 2 in [`chrome-extension/background.js:2`](chrome-extension/background.js#L2) from `true` to `false`:

```javascript
const ENABLE_POSTHOG = false;
```

All tracking stops when this is false. No other changes needed.

---

## Code Locations

### 1. Feature Flag

**[`chrome-extension/background.js:2`](chrome-extension/background.js#L2)**
```javascript
const ENABLE_POSTHOG = true;  // Set to false to disable
```

### 2. Wrapper Functions

**[`chrome-extension/background.js:16-20`](chrome-extension/background.js#L16-L20)**
```javascript
function safeTrackEvent(eventName, properties) {
  if (ENABLE_POSTHOG) {
    trackEvent(eventName, properties);
  }
}
```

**[`chrome-extension/background.js:22-26`](chrome-extension/background.js#L22-L26)**
```javascript
function safeIdentifyUser(userId, userProperties) {
  if (ENABLE_POSTHOG) {
    identifyUser(userId, userProperties);
  }
}
```

### 3. Initialization

**[`chrome-extension/background.js:10-12`](chrome-extension/background.js#L10-L12)**
```javascript
import { initPostHog, trackEvent, identifyUser } from './posthog-config.js';
if (ENABLE_POSTHOG) {
  initPostHog();
}
```

**[`chrome-extension/posthog-config.js:1-31`](chrome-extension/posthog-config.js)**
- Contains PostHog initialization and API configuration
- API host: `https://us.i.posthog.com`

### 4. Events Tracked

**Extension Lifecycle:**
- [`background.js:34`](chrome-extension/background.js#L34) - Extension installed
- [`background.js:38`](chrome-extension/background.js#L38) - Extension updated
- [`background.js:45`](chrome-extension/background.js#L45) - Extension started

**Rule Updates:**
- [`background.js:86`](chrome-extension/background.js#L86) - Domain blocking rules updated
- [`background.js:94`](chrome-extension/background.js#L94) - URL pair blocking rules updated
- [`background.js:102`](chrome-extension/background.js#L102) - Action blocking rules updated
- [`background.js:110`](chrome-extension/background.js#L110) - Governance rules updated

**Agent Activity:**
- [`background.js:478`](chrome-extension/background.js#L478) - Agent detected
- [`background.js:499`](chrome-extension/background.js#L499) - Agent stopped
- [`background.js:506`](chrome-extension/background.js#L506) - Action blocked
- [`background.js:483`](chrome-extension/background.js#L483) - Navigation blocked (agent start)
- [`background.js:904`](chrome-extension/background.js#L904) - Navigation blocked (onBeforeNavigate)
- [`background.js:935`](chrome-extension/background.js#L935) - Navigation blocked (onUpdated #1)
- [`background.js:990`](chrome-extension/background.js#L990) - Navigation blocked (onUpdated #2)

**User Authentication:**
- [`background.js:646-647`](chrome-extension/background.js#L646-L647) - User identified after auth
- [`contextfort-dashboard/src/app/(main)/dashboard/_components/AuthModal.tsx:97`](contextfort-dashboard/src/app/(main)/dashboard/_components/AuthModal.tsx#L97) - User identify on login
- [`contextfort-dashboard/src/app/(main)/dashboard/_components/AuthModal.tsx:161`](contextfort-dashboard/src/app/(main)/dashboard/_components/AuthModal.tsx#L161) - User identify on verification

### 5. Permissions & Configuration

**[`chrome-extension/manifest.json:51`](chrome-extension/manifest.json#L51)**
```json
"connect-src 'self' https://*.posthog.com"
```

**[`chrome-extension/package.json:9`](chrome-extension/package.json#L9)**
```json
"posthog-js": "^1.313.0"
```

---

## Data Collected

When enabled, PostHog collects:

1. **Session Events**: When agent mode starts/stops
2. **Blocking Events**: When navigation or actions are blocked
3. **Rule Changes**: When users update blocking/governance rules
4. **Extension Lifecycle**: Install, update, startup events
5. **User Identification**: Email (only if auth is enabled)

**No personal browsing data** is collected. Only metadata about agent sessions and rule usage.

---

## Complete Removal (Optional)

If you want to completely remove PostHog code:

1. **Set feature flag**: [`background.js:2`](chrome-extension/background.js#L2) → `ENABLE_POSTHOG = false`
2. **Delete config file**: `chrome-extension/posthog-config.js`
3. **Remove import**: Delete [`background.js:10`](chrome-extension/background.js#L10)
4. **Remove CSP entry**: Remove `https://*.posthog.com` from [`manifest.json:51`](chrome-extension/manifest.json#L51)
5. **Remove dependency**: Delete line from [`package.json:9`](chrome-extension/package.json#L9)
6. **Rebuild**: Run `./build-all.sh`

**Note:** Just setting `ENABLE_POSTHOG = false` is sufficient. Complete removal is optional.

---

## Privacy

- PostHog is self-hosted analytics (not Google Analytics)
- No third-party cookies
- Data stored on PostHog's servers (US region)
- Users can disable with one line change
- Complies with privacy policy disclosure requirements
