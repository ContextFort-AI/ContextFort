# Privacy Policy

**Last Updated:** January 2025

ContextFort is committed to protecting your privacy. This policy explains our data practices.

---

## Quick Summary

✅ **All data stored locally** on your machine - Chrome Extension Storage
✅ **No external transmission** of screenshots or session data
✅ **No third party cloud services** - Everything stays on your device
⚠️  **Screenshots may contain PII/PHI** - You control all data
✅ **Optional analytics** - PostHog can be disabled with one line change

---

## What We Collect

### Local Storage (Your Device Only)

**Screenshots:**
- Captured during agent sessions
- May contain Personal Information (PII) or Protected Health Information (PHI)
- Stored locally in Chrome Extension Storage
- **Never transmitted to external servers**
- Encrypted at rest by Chrome

**Session Data:**
- URLs visited during agent sessions
- Timestamps and agent actions
- Domain transitions
- Stored locally only

**Configuration:**
- Blocking rules and governance settings
- User preferences
- Stored locally only

### Optional Analytics (PostHog)

When analytics are **enabled** (default):
- Event names: agent_start, agent_stop, rule_updated
- Event timestamps
- Extension version
- **No PII, no screenshots, no session data**

**Disable analytics:** Edit `background.js` line 2: `ENABLE_POSTHOG = false`

---

## How We Use Data

**Local Data:**
- Display in ContextFort dashboard
- Enforce blocking and governance rules
- Export via Downloads page

**Analytics Data (if enabled):**
- Understand feature usage
- Identify bugs and issues
- Improve the extension

---

## Data Sharing

We **do not**:
- Sell your data
- Share data with third parties (except PostHog for optional analytics)
- Transmit screenshots or session data externally
- Use data for advertising
- Track you across websites

---

## Your Control

**View Data:** Open ContextFort dashboard
**Delete Data:** `chrome://extensions/` → ContextFort → "Clear storage"
**Disable Analytics:** Set `ENABLE_POSTHOG = false` in `background.js`
**Uninstall:** Remove extension to delete all data immediately

---

## Data Security

- **Encryption:** Chrome encrypts extension storage at rest
- **Isolation:** Only ContextFort can access its storage
- **No transmission:** No external servers or cloud storage
- **Local only:** All data stays on your device

---

## Compliance

**Current Architecture (Local Only):**
- ✅ GDPR compliant - No data processing or transmission
- ✅ CCPA compliant - No sale of personal information
- ✅ HIPAA compliant - No PHI transmission (local storage only)

**Future (Enterprise Phase):**
- SOC2 Type 2 certification (Q2 2025)
- ISO 27001 certification (Q3 2025)
- Enhanced GDPR compliance documentation

---

## Children's Privacy

ContextFort is not intended for children under 13. We do not knowingly collect data from children.

---

## Changes to This Policy

We may update this policy. Changes will be posted with an updated "Last Updated" date.

---

## Detailed Information

For comprehensive data policy details, see:
- [DATA_POLICY.md](DATA_POLICY.md) - Complete data handling documentation
- [SECURITY.md](SECURITY.md) - Security policies and vulnerability reporting
- [COMPLIANCE.md](COMPLIANCE.md) - Compliance roadmap and certifications

---

## Contact

**Email:** security@contextfort.ai
**GitHub:** [Report an issue](https://github.com/ContextFort-AI/ContextFort/issues)

For security vulnerabilities, see [SECURITY.md](SECURITY.md) for private reporting.
