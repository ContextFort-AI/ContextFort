// ============================================================================
// CREDENTIAL GRANTS - Time-Limited Access Control for Agent Tabs
// ============================================================================
// Implements macaroon-like credential grants with time-based caveats.
// This module manages temporary access grants that allow agent tabs to make
// authenticated requests to specific domains for a limited time.
//
// Usage:
//   import { grantCredentialAccess, revokeCredentialAccess, ... } from './lib/credential-grants.js';
// ============================================================================

// In-memory store for active credential grants
// Structure: Map<grantId, CredentialGrant>
const credentialGrants = new Map();

// Callback to notify when grants change (for DNR rule updates)
let onGrantsChangeCallback = null;

// ============================================================================
// TYPES (JSDoc for documentation)
// ============================================================================
/**
 * @typedef {Object} CredentialGrant
 * @property {string} id - Unique grant identifier
 * @property {string} domain - Domain this grant applies to (e.g., "github.com")
 * @property {number} expiresAt - Unix timestamp when grant expires
 * @property {string} grantedAt - ISO timestamp when grant was created
 * @property {string} grantedBy - Who granted this (e.g., "user", "policy")
 * @property {string} [reason] - Optional reason/description for the grant
 */

// ============================================================================
// GRANT MANAGEMENT
// ============================================================================

/**
 * Grant time-limited credential access to a domain
 * @param {string} domain - Domain to grant access to (e.g., "github.com")
 * @param {number} durationMinutes - How long the grant should last (in minutes)
 * @param {Object} options - Additional options
 * @param {string} [options.grantedBy='user'] - Who granted this
 * @param {string} [options.reason] - Reason for the grant
 * @returns {CredentialGrant} The created grant
 */
export function grantCredentialAccess(domain, durationMinutes, options = {}) {
  const grantId = `grant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = Date.now();

  const grant = {
    id: grantId,
    domain: domain.toLowerCase(),
    expiresAt: now + (durationMinutes * 60 * 1000),
    grantedAt: new Date().toISOString(),
    grantedBy: options.grantedBy || 'user',
    reason: options.reason || null
  };

  credentialGrants.set(grantId, grant);

  // Persist to storage
  persistGrants();

  // Notify listeners
  notifyGrantsChanged();

  return grant;
}

/**
 * Revoke a credential grant by ID
 * @param {string} grantId - The grant ID to revoke
 * @returns {boolean} True if grant was found and revoked
 */
export function revokeCredentialAccess(grantId) {
  const deleted = credentialGrants.delete(grantId);

  if (deleted) {
    persistGrants();
    notifyGrantsChanged();
  }

  return deleted;
}

/**
 * Revoke all grants for a specific domain
 * @param {string} domain - Domain to revoke all grants for
 * @returns {number} Number of grants revoked
 */
export function revokeAllForDomain(domain) {
  const normalizedDomain = domain.toLowerCase();
  let revokedCount = 0;

  for (const [grantId, grant] of credentialGrants.entries()) {
    if (grant.domain === normalizedDomain) {
      credentialGrants.delete(grantId);
      revokedCount++;
    }
  }

  if (revokedCount > 0) {
    persistGrants();
    notifyGrantsChanged();
  }

  return revokedCount;
}

/**
 * Get all active (non-expired) grants
 * @returns {CredentialGrant[]} Array of active grants
 */
export function getActiveGrants() {
  const now = Date.now();
  const activeGrants = [];

  for (const grant of credentialGrants.values()) {
    if (grant.expiresAt > now) {
      activeGrants.push(grant);
    }
  }

  return activeGrants;
}

/**
 * Get all domains with active grants
 * @returns {string[]} Array of domains with active credential access
 */
export function getGrantedDomains() {
  const now = Date.now();
  const domains = new Set();

  for (const grant of credentialGrants.values()) {
    if (grant.expiresAt > now) {
      domains.add(grant.domain);
    }
  }

  return Array.from(domains);
}

/**
 * Check if a domain has an active credential grant
 * @param {string} domain - Domain to check
 * @returns {boolean} True if domain has active grant
 */
export function isDomainGranted(domain) {
  const normalizedDomain = domain.toLowerCase();
  const now = Date.now();

  for (const grant of credentialGrants.values()) {
    if (grant.domain === normalizedDomain && grant.expiresAt > now) {
      return true;
    }
  }

  return false;
}

/**
 * Get grant details for a domain
 * @param {string} domain - Domain to get grants for
 * @returns {CredentialGrant|null} Active grant for domain, or null
 */
export function getGrantForDomain(domain) {
  const normalizedDomain = domain.toLowerCase();
  const now = Date.now();

  for (const grant of credentialGrants.values()) {
    if (grant.domain === normalizedDomain && grant.expiresAt > now) {
      return grant;
    }
  }

  return null;
}

// ============================================================================
// EXPIRY MANAGEMENT
// ============================================================================

let expiryCheckInterval = null;

/**
 * Start the automatic expiry checker
 * @param {number} [intervalMs=30000] - How often to check for expired grants (default: 30 seconds)
 */
export function startExpiryChecker(intervalMs = 30000) {
  if (expiryCheckInterval) {
    clearInterval(expiryCheckInterval);
  }

  expiryCheckInterval = setInterval(() => {
    cleanExpiredGrants();
  }, intervalMs);

  // Also run immediately
  cleanExpiredGrants();
}

/**
 * Stop the automatic expiry checker
 */
export function stopExpiryChecker() {
  if (expiryCheckInterval) {
    clearInterval(expiryCheckInterval);
    expiryCheckInterval = null;
  }
}

/**
 * Remove all expired grants
 * @returns {number} Number of grants cleaned up
 */
export function cleanExpiredGrants() {
  const now = Date.now();
  let cleanedCount = 0;

  for (const [grantId, grant] of credentialGrants.entries()) {
    if (grant.expiresAt <= now) {
      credentialGrants.delete(grantId);
      cleanedCount++;
    }
  }

  if (cleanedCount > 0) {
    persistGrants();
    notifyGrantsChanged();
  }

  return cleanedCount;
}

// ============================================================================
// PERSISTENCE
// ============================================================================

/**
 * Persist grants to chrome.storage.local
 */
async function persistGrants() {
  try {
    const grantsArray = Array.from(credentialGrants.values());
    await chrome.storage.local.set({ credentialGrants: grantsArray });
  } catch (error) {
    console.error('[CredentialGrants] Failed to persist grants:', error);
  }
}

/**
 * Load grants from chrome.storage.local
 * Call this on extension startup
 */
export async function loadGrants() {
  try {
    const result = await chrome.storage.local.get(['credentialGrants']);
    const grantsArray = result.credentialGrants || [];

    // Clear existing and load from storage
    credentialGrants.clear();

    const now = Date.now();
    for (const grant of grantsArray) {
      // Only load non-expired grants
      if (grant.expiresAt > now) {
        credentialGrants.set(grant.id, grant);
      }
    }

    // Start expiry checker
    startExpiryChecker();

    return getActiveGrants();
  } catch (error) {
    console.error('[CredentialGrants] Failed to load grants:', error);
    return [];
  }
}

// ============================================================================
// CHANGE NOTIFICATIONS
// ============================================================================

/**
 * Register a callback to be notified when grants change
 * @param {Function} callback - Function to call when grants change
 */
export function onGrantsChange(callback) {
  onGrantsChangeCallback = callback;
}

/**
 * Notify listeners that grants have changed
 */
function notifyGrantsChanged() {
  if (onGrantsChangeCallback) {
    try {
      onGrantsChangeCallback(getGrantedDomains());
    } catch (error) {
      console.error('[CredentialGrants] Error in onGrantsChange callback:', error);
    }
  }
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Get time remaining for a grant in human-readable format
 * @param {CredentialGrant} grant - The grant to check
 * @returns {string} Human-readable time remaining (e.g., "5m 30s")
 */
export function getTimeRemaining(grant) {
  const now = Date.now();
  const remaining = grant.expiresAt - now;

  if (remaining <= 0) {
    return 'Expired';
  }

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

/**
 * Extend an existing grant's expiry time
 * @param {string} grantId - Grant ID to extend
 * @param {number} additionalMinutes - Minutes to add
 * @returns {CredentialGrant|null} Updated grant or null if not found
 */
export function extendGrant(grantId, additionalMinutes) {
  const grant = credentialGrants.get(grantId);

  if (!grant) {
    return null;
  }

  grant.expiresAt = grant.expiresAt + (additionalMinutes * 60 * 1000);
  persistGrants();
  notifyGrantsChanged();

  return grant;
}

// ============================================================================
// MODULE INFO
// ============================================================================
export const MODULE_VERSION = '1.0.0';
export const MODULE_NAME = 'credential-grants';
