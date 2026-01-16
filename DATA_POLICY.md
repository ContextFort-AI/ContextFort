# Data Policy

**Last Updated:** January 2025

## Overview

This document describes what data ContextFort collects, how it's stored, and how it's used.

---

## Data Collection

### Screenshots

**What's Captured:**
- Screenshots of web pages during agent sessions
- **May contain PII/PHI** (personal information, health information, financial data)
- Captured automatically when agent mode is active

**Storage:**
- Stored locally in Chrome Extension Storage
- **Encrypted at rest** by Chrome's built-in encryption
- **Never transmitted** to external servers
- Not synced to cloud or other devices

**Retention:**
- Stored indefinitely until manually deleted
- No automatic expiration
- User has full control over deletion

### Session Data

**What's Collected:**
- URLs visited during agent sessions
- Timestamps of agent start/stop
- Actions taken by agent (clicks, inputs)
- Domain transitions

**Storage:**
- Local Chrome Extension Storage only
- Encrypted at rest by Chrome
- Never transmitted externally

### Blocking Rules

**What's Stored:**
- Domain blocking configurations
- URL pair blocking rules
- Element selector rules
- Governance rules

**Storage:**
- Local Chrome Extension Storage
- User-configured, no default rules

---

## Data Usage

### How Data Is Used

**Screenshots:**
- Display in Visibility dashboard
- Export via Downloads page
- User review and audit trail

**Session Data:**
- Display session history
- Enforce blocking rules
- Track agent activity

**Blocking Rules:**
- Enforce security policies
- Prevent unauthorized agent actions
- Context mixing prevention

### Who Has Access

**Only the user** on their local machine has access to data.

**No access by:**
- ContextFort servers (no servers exist)
- Third parties
- Other users
- Cloud storage

---

## Data Security

### Encryption

- **At Rest:** Chrome encrypts extension storage using OS-level encryption
- **In Transit:** N/A - No data transmission occurs

### Access Controls

- Only the ContextFort extension can access its storage
- Isolated from other extensions and websites
- Requires Chrome Extension permissions

### Compliance

**PII/PHI Handling:**
- Screenshots may contain PII/PHI from web pages
- All data remains on user's device
- No HIPAA business associate agreement required (no data transmission)
- User responsible for data on their device

---

## Data Deletion

### Manual Deletion

**Delete All Data:**
1. Go to `chrome://extensions/`
2. Find ContextFort
3. Click "Details"
4. Click "Clear storage" or "Remove extension data"

**Delete Specific Sessions:**
1. Open ContextFort dashboard
2. Go to Instances or Visibility
3. Delete individual sessions (if implemented)

**Uninstall:**
- Removing the extension deletes all local data immediately

### Data Retention

- No automatic deletion
- No server-side retention (no servers)
- User controls all retention policies
- Recommended: Clear data regularly to minimize PII exposure

---

## Analytics (Optional)

### PostHog

**What's Sent:**
- Event names (agent_start, agent_stop, rule_updated)
- Event timestamps
- Extension version
- No PII, no screenshots, no session data

**How to Disable:**
- Edit `background.js` line 2: `ENABLE_POSTHOG = false`
- See [POSTHOG.md](POSTHOG.md) for details

---

## Enterprise Deployment (Future)

### Planned Features

**Centralized Dashboard:**
- Aggregate session data across organization
- Admin console for security team
- Policy management

**When Available:**
- SOC2 compliance required
- Encryption in transit (HTTPS)
- Role-based access control
- Data retention policies

**Current Status:**
- Not implemented
- All data local only
- No centralized collection

---

## Third Party Services

### Current

- **PostHog** (optional, can be disabled)
  - Analytics only
  - No PII transmission
  - Event names and timestamps only

### Future

- Centralized cloud storage (when enterprise features launch)
- Will require separate compliance documentation
- Will be opt-in for enterprise customers

---

## User Rights

### Your Rights

- **Right to Access:** View all your data in the dashboard
- **Right to Delete:** Clear storage or uninstall extension
- **Right to Export:** Use Downloads page to export sessions/screenshots
- **Right to Opt-Out:** Disable PostHog analytics

### How to Exercise Rights

- Access: Open ContextFort dashboard
- Delete: Clear storage via `chrome://extensions/`
- Export: Use Downloads page in dashboard
- Opt-Out: Set `ENABLE_POSTHOG = false`

---

## Changes to This Policy

We may update this data policy. Changes will be posted in this file with an updated "Last Updated" date.

---

## Contact

For data policy questions:
- Open an issue on [GitHub](https://github.com/ContextFort-AI/ContextFort/issues)
- Email: security@contextfort.ai

---

## Summary

✅ **All data stored locally** on your machine
✅ **No external transmission** of screenshots or session data
✅ **Encrypted at rest** by Chrome
✅ **User controls deletion** - Clear anytime
⚠️  **May contain PII/PHI** in screenshots - User responsible for data on their device
✅ **Optional analytics** - Can be disabled with one line change
