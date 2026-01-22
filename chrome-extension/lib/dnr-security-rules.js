// ============================================================================
// DNR SECURITY RULES - Declarative Net Request Rule Management for Agent Tabs
// ============================================================================
// Manages Chrome's declarativeNetRequest API for agent tab security:
// - Internal network blocking (localhost, private IPs, cloud metadata)
// - Cookie sandboxing (strip cookies except allowlisted domains)
// - Auth header stripping (strip Authorization header)
// - Write method blocking (block POST/PUT/PATCH/DELETE except allowlisted)
//
// Usage:
//   import { updateSecurityRules, setAgentTabs, ... } from './lib/dnr-security-rules.js';
// ============================================================================

// ============================================================================
// RULE IDS
// ============================================================================
const RULE_IDS = {
  INTERNAL_NETWORK: 2000,
  COOKIE_SANDBOX: 2001,
  AUTH_HEADER_STRIP: 2002,
  BLOCK_WRITE_METHODS: 2003
};

// ============================================================================
// CONFIGURATION
// ============================================================================

// Domains that should always be allowed (Claude's own domains)
const ALWAYS_ALLOWED_DOMAINS = ['claude.ai', 'claude.com', 'anthropic.com'];

// Regex pattern for internal network addresses (SSRF protection)
const INTERNAL_NETWORK_REGEX =
  '^(https?|wss?)://(' +
    'localhost|' +
    '127\\.0\\.0\\.1|' +
    '0\\.0\\.0\\.0|' +
    '\\[::1\\]|' +
    '10\\.(?:\\d{1,3}\\.){2}\\d{1,3}|' +                        // 10.x.x.x
    '192\\.168\\.(?:\\d{1,3}\\.)\\d{1,3}|' +                    // 192.168.x.x
    '172\\.(?:1[6-9]|2\\d|3[0-1])\\.(?:\\d{1,3}\\.)\\d{1,3}|' + // 172.16-31.x.x
    '169\\.254\\.(?:\\d{1,3}\\.)\\d{1,3}' +                     // 169.254.x.x (cloud metadata)
  ')(?::\\d+)?(?:/.*)?$';

// ============================================================================
// STATE
// ============================================================================

// Currently active agent tab IDs
let activeAgentTabIds = [];

// Domains allowed for write operations (beyond ALWAYS_ALLOWED_DOMAINS)
// This is populated by credential grants
let writeAllowedDomains = [...ALWAYS_ALLOWED_DOMAINS];

// Callback for logging/analytics
let onRuleUpdateCallback = null;

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Set the list of active agent tab IDs
 * Rules will only apply to these tabs
 * @param {number[]} tabIds - Array of tab IDs with active agents
 */
export function setAgentTabs(tabIds) {
  activeAgentTabIds = [...tabIds];
}

/**
 * Set domains allowed for write operations (POST/PUT/PATCH/DELETE)
 * @param {string[]} domains - Additional domains to allow writes to
 */
export function setWriteAllowedDomains(domains) {
  writeAllowedDomains = [...ALWAYS_ALLOWED_DOMAINS, ...domains];
}

/**
 * Get the list of always-allowed domains
 * @returns {string[]} Domains that are always allowed
 */
export function getAlwaysAllowedDomains() {
  return [...ALWAYS_ALLOWED_DOMAINS];
}

/**
 * Register callback for rule update events (for logging/analytics)
 * @param {Function} callback - Function called on rule updates
 */
export function onRuleUpdate(callback) {
  onRuleUpdateCallback = callback;
}

/**
 * Update all security rules based on current state
 * Call this whenever agent tabs or allowed domains change
 */
export async function updateSecurityRules() {
  try {
    await Promise.all([
      updateInternalNetworkRule(),
      updateAgentSecurityRules()
    ]);
  } catch (error) {
    console.error('[DNR Security] Failed to update rules:', error);
    throw error;
  }
}

/**
 * Clear all security rules (call when no agent tabs are active)
 */
export async function clearSecurityRules() {
  try {
    await chrome.declarativeNetRequest.updateSessionRules({
      removeRuleIds: Object.values(RULE_IDS)
    });

    notifyRuleUpdate('cleared', { ruleIds: Object.values(RULE_IDS) });
  } catch (error) {
    console.error('[DNR Security] Failed to clear rules:', error);
    throw error;
  }
}

// ============================================================================
// INTERNAL NETWORK BLOCKING
// ============================================================================

/**
 * Update the internal network blocking rule
 * Blocks requests to localhost, private IPs, cloud metadata endpoints
 */
async function updateInternalNetworkRule() {
  try {
    // Always remove first
    await chrome.declarativeNetRequest.updateSessionRules({
      removeRuleIds: [RULE_IDS.INTERNAL_NETWORK]
    });

    // Only add if there are active agent tabs
    if (activeAgentTabIds.length === 0) {
      return;
    }

    await chrome.declarativeNetRequest.updateSessionRules({
      addRules: [{
        id: RULE_IDS.INTERNAL_NETWORK,
        priority: 1,
        action: { type: 'block' },
        condition: {
          tabIds: activeAgentTabIds,
          regexFilter: INTERNAL_NETWORK_REGEX
        }
      }]
    });

    notifyRuleUpdate('internal_network_updated', {
      tabCount: activeAgentTabIds.length
    });
  } catch (error) {
    console.error('[DNR Security] Failed to update internal network rule:', error);
    throw error;
  }
}

// ============================================================================
// AGENT TAB SECURITY RULES
// ============================================================================

/**
 * Update cookie sandboxing, auth header stripping, and write method blocking
 */
async function updateAgentSecurityRules() {
  try {
    // Remove all existing rules first
    await chrome.declarativeNetRequest.updateSessionRules({
      removeRuleIds: [
        RULE_IDS.COOKIE_SANDBOX,
        RULE_IDS.AUTH_HEADER_STRIP,
        RULE_IDS.BLOCK_WRITE_METHODS
      ]
    });

    // Only add if there are active agent tabs
    if (activeAgentTabIds.length === 0) {
      return;
    }

    await chrome.declarativeNetRequest.updateSessionRules({
      addRules: [
        // Rule 1: Strip cookies (except always-allowed domains)
        {
          id: RULE_IDS.COOKIE_SANDBOX,
          priority: 1,
          action: {
            type: 'modifyHeaders',
            requestHeaders: [
              { header: 'cookie', operation: 'remove' }
            ],
            responseHeaders: [
              { header: 'set-cookie', operation: 'remove' }
            ]
          },
          condition: {
            tabIds: activeAgentTabIds,
            excludedRequestDomains: ALWAYS_ALLOWED_DOMAINS,
            regexFilter: '.*'
          }
        },

        // Rule 2: Strip Authorization header (except always-allowed domains)
        {
          id: RULE_IDS.AUTH_HEADER_STRIP,
          priority: 1,
          action: {
            type: 'modifyHeaders',
            requestHeaders: [
              { header: 'authorization', operation: 'remove' }
            ]
          },
          condition: {
            tabIds: activeAgentTabIds,
            excludedRequestDomains: ALWAYS_ALLOWED_DOMAINS,
            regexFilter: '.*'
          }
        },

        // Rule 3: Block write methods (except allowlisted domains including credential grants)
        {
          id: RULE_IDS.BLOCK_WRITE_METHODS,
          priority: 2,
          action: { type: 'block' },
          condition: {
            tabIds: activeAgentTabIds,
            excludedRequestDomains: writeAllowedDomains,
            requestMethods: ['post', 'put', 'patch', 'delete']
          }
        }
      ]
    });

    notifyRuleUpdate('security_rules_updated', {
      tabCount: activeAgentTabIds.length,
      writeAllowedCount: writeAllowedDomains.length
    });
  } catch (error) {
    console.error('[DNR Security] Failed to update agent security rules:', error);
    throw error;
  }
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Get the current state of security rules
 * @returns {Promise<Object>} Current rule state
 */
export async function getSecurityRulesState() {
  try {
    const rules = await chrome.declarativeNetRequest.getSessionRules();
    const ruleMap = {};

    for (const rule of rules) {
      if (rule.id === RULE_IDS.INTERNAL_NETWORK) {
        ruleMap.internalNetwork = true;
      } else if (rule.id === RULE_IDS.COOKIE_SANDBOX) {
        ruleMap.cookieSandbox = true;
      } else if (rule.id === RULE_IDS.AUTH_HEADER_STRIP) {
        ruleMap.authHeaderStrip = true;
      } else if (rule.id === RULE_IDS.BLOCK_WRITE_METHODS) {
        ruleMap.blockWriteMethods = true;
      }
    }

    return {
      activeAgentTabs: activeAgentTabIds.length,
      writeAllowedDomains: writeAllowedDomains.length,
      rules: ruleMap
    };
  } catch (error) {
    console.error('[DNR Security] Failed to get rules state:', error);
    return null;
  }
}

/**
 * Notify callback about rule updates
 */
function notifyRuleUpdate(event, details) {
  if (onRuleUpdateCallback) {
    try {
      onRuleUpdateCallback(event, details);
    } catch (error) {
      console.error('[DNR Security] Error in onRuleUpdate callback:', error);
    }
  }
}

// ============================================================================
// MODULE INFO
// ============================================================================
export const RULE_ID_CONSTANTS = RULE_IDS;
export const MODULE_VERSION = '1.0.0';
export const MODULE_NAME = 'dnr-security-rules';
