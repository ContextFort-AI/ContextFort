# Security Policy

## Reporting Security Vulnerabilities

**Please report security vulnerabilities privately.**

**Email:** security@contextfort.ai
**GitHub:** Use [Private Vulnerability Reporting](https://github.com/ContextFort-AI/ContextFort/security/advisories/new)

**Do NOT open public issues for security vulnerabilities.**

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

---

## Response Timeline

- **Initial Response:** Within 48 hours
- **Status Update:** Within 5 business days
- **Fix Timeline:** Based on severity
  - Critical: 1-3 days
  - High: 1 week
  - Medium: 2 weeks
  - Low: 1 month

---

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | ✅ Yes             |
| < 1.0   | ❌ No              |

---

## Security Update Process

1. **Vulnerability Reported** - Via email or private GitHub report
2. **Assessment** - Security team evaluates severity and impact
3. **Fix Development** - Patch developed and tested
4. **Release** - Security update pushed to Chrome Web Store
5. **Disclosure** - Public disclosure after fix is deployed (coordinated disclosure)

---

## Security Features

### Current Implementation

- **Local Storage Only** - No data transmitted to external servers
- **No Cloud Dependencies** - All processing happens in-browser
- **Content Security Policy** - Strict CSP prevents XSS attacks
- **Permissions** - Minimal required permissions
- **Open Source** - Full code audit available

### Data Security

- **Screenshots:** Stored locally in Chrome storage, encrypted at rest by Chrome
- **Sessions:** Stored locally, no transmission to external servers
- **Rules:** Stored locally in Chrome storage
- **Analytics:** Optional PostHog (can be disabled with one line change)

---

## Third Party Dependencies

### Runtime Dependencies

- `posthog-js` - Analytics (optional, can be disabled)

### Security Scanning

- Automated dependency scanning via GitHub Dependabot
- Regular security audits of dependencies
- Prompt updates for known vulnerabilities

---

## Compliance

### Current Status

- **GDPR:** Data processing happens locally, no data transmission
- **CCPA:** No sale of personal information
- **SOC2:** In progress (Q2 2025)
- **ISO 27001:** Planned (Q3 2025)

---

## Code Security

### Repository Security

- Protected main branch
- Pull request reviews required
- Automated security scanning
- Signed commits recommended

### Extension Security

- Manifest V3 compliance
- No eval() or inline scripts
- Strict Content Security Policy
- Chrome Web Store security review (pending)

---

## Contact

For security concerns:
- **Email:** security@contextfort.ai
- **GitHub:** [@ContextFort-AI](https://github.com/ContextFort-AI/ContextFort)

For general questions, see [README.md](README.md).
