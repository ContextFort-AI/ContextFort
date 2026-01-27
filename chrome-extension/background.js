// ============================================================================
const ENABLE_POSTHOG = true;
const ENABLE_AUTH = false;
// ============================================================================

import { loginWithEmail, verifyOTP, resendOTP, getCurrentUser, isLoggedIn, logout} from './auth.js';

// POSTHOG
// ============================================================================
import { initPostHog, trackEvent, identifyUser } from './posthog-config.js';
if (ENABLE_POSTHOG) {
  initPostHog();
}

// Wrapper functions that respect feature flags
function safeTrackEvent(eventName, properties) {
  if (ENABLE_POSTHOG) {
    trackEvent(eventName, properties);
  }
}

function safeIdentifyUser(userId, userProperties) {
  if (ENABLE_POSTHOG) {
    identifyUser(userId, userProperties);
  }
}
// ============================================================================


// EXTENSION BASICS
// ============================================================================
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    safeTrackEvent('extension_installed', {
      version: chrome.runtime.getManifest().version
    });
  } else if (details.reason === 'update') {
    safeTrackEvent('extension_updated', {
      version: chrome.runtime.getManifest().version,
      previousVersion: details.previousVersion
    });
  }
});

safeTrackEvent('extension_started', {
  version: chrome.runtime.getManifest().version
});


chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('dashboard/visibility/index.html')
  });
});


const sessions = new Map();
const activeAgentTabs = new Map();
let urlBlockingRules = [];
let urlPairBlockingRules = [];
let blockedActions = [];
let governanceRules = {};

// ============================================================================
// SESSION ISOLATION: Data structures and state
// ============================================================================
// Track which domains have been session-swapped in the current agent session (by groupId)
// This prevents double-swapping the same domain during one agent session
const swappedDomainsPerSession = new Map(); // groupId -> Set of domains

// Session profile structure:
// {
//   domain: string,
//   capturedAt: ISO timestamp,
//   cookies: array of cookie objects,
//   localStorage: object (key-value pairs),
//   sessionStorage: object (key-value pairs)
// }

// Get root domain from hostname (e.g., "app.atlassian.com" -> "atlassian.com")
function getRootDomain(hostname) {
  const parts = hostname.split('.');
  if (parts.length <= 2) return hostname;
  const rootDomain = parts.slice(-2).join('.');
  console.log(`[SessionIsolation] getRootDomain: ${hostname} -> ${rootDomain}`);
  return rootDomain;
}

// Capture all cookies for a domain (includes subdomains)
async function captureCookies(domain) {
  console.log(`[SessionIsolation] captureCookies: Starting for domain ${domain}`);
  const rootDomain = getRootDomain(domain);
  const cookies = await chrome.cookies.getAll({ domain: rootDomain });
  console.log(`[SessionIsolation] captureCookies: Found ${cookies.length} cookies for ${rootDomain}`);

  const subdomainCookies = await chrome.cookies.getAll({ domain: '.' + rootDomain });
  console.log(`[SessionIsolation] captureCookies: Found ${subdomainCookies.length} cookies for .${rootDomain}`);

  // Combine and deduplicate
  const allCookies = [...cookies];
  for (const cookie of subdomainCookies) {
    const exists = allCookies.some(c =>
      c.name === cookie.name && c.domain === cookie.domain && c.path === cookie.path
    );
    if (!exists) {
      allCookies.push(cookie);
    }
  }
  console.log(`[SessionIsolation] captureCookies: Total ${allCookies.length} unique cookies captured`);
  console.log(`[SessionIsolation] captureCookies: Cookie names: ${allCookies.map(c => c.name).join(', ')}`);
  return allCookies;
}

// Clear all cookies for a domain
async function clearCookies(domain) {
  console.log(`[SessionIsolation] clearCookies: Starting for domain ${domain}`);
  const cookies = await captureCookies(domain);
  console.log(`[SessionIsolation] clearCookies: Removing ${cookies.length} cookies`);
  let removed = 0;
  for (const cookie of cookies) {
    const protocol = cookie.secure ? 'https://' : 'http://';
    const cookieDomain = cookie.domain.startsWith('.') ? cookie.domain.slice(1) : cookie.domain;
    const url = `${protocol}${cookieDomain}${cookie.path}`;
    try {
      await chrome.cookies.remove({ url, name: cookie.name });
      removed++;
    } catch (e) {
      console.error('[SessionIsolation] Failed to remove cookie:', cookie.name, e);
    }
  }
  console.log(`[SessionIsolation] clearCookies: Successfully removed ${removed}/${cookies.length} cookies`);
}

// Restore cookies from a saved session
async function restoreCookies(cookies) {
  console.log(`[SessionIsolation] restoreCookies: Restoring ${cookies.length} cookies`);
  console.log(`[SessionIsolation] restoreCookies: Cookie names: ${cookies.map(c => c.name).join(', ')}`);
  let restored = 0;
  for (const cookie of cookies) {
    // Remove properties that can't be set
    const { hostOnly, session, storeId, ...cookieData } = cookie;

    const protocol = cookie.secure ? 'https://' : 'http://';
    const cookieDomain = cookie.domain.startsWith('.') ? cookie.domain.slice(1) : cookie.domain;
    const url = `${protocol}${cookieDomain}${cookie.path}`;

    try {
      await chrome.cookies.set({
        url,
        ...cookieData,
        // Don't set expirationDate for session cookies
        expirationDate: session ? undefined : cookieData.expirationDate
      });
      restored++;
    } catch (e) {
      console.error('[SessionIsolation] Failed to restore cookie:', cookie.name, e);
    }
  }
  console.log(`[SessionIsolation] restoreCookies: Successfully restored ${restored}/${cookies.length} cookies`);
}

// Capture full session (cookies + storage) via content script
async function captureFullSession(tabId, domain) {
  console.log(`[SessionIsolation] captureFullSession: Starting for tab ${tabId}, domain ${domain}`);

  // Capture cookies
  const cookies = await captureCookies(domain);

  // Capture localStorage and sessionStorage via content script
  let storageData = { localStorage: {}, sessionStorage: {} };
  try {
    console.log(`[SessionIsolation] captureFullSession: Sending CAPTURE_STORAGE message to tab ${tabId}`);
    storageData = await chrome.tabs.sendMessage(tabId, { type: 'CAPTURE_STORAGE' });
    console.log(`[SessionIsolation] captureFullSession: Received storage data - localStorage keys: ${Object.keys(storageData.localStorage || {}).length}, sessionStorage keys: ${Object.keys(storageData.sessionStorage || {}).length}`);
  } catch (e) {
    console.error('[SessionIsolation] Failed to capture storage:', e);
  }

  const session = {
    domain,
    capturedAt: new Date().toISOString(),
    cookies,
    localStorage: storageData.localStorage || {},
    sessionStorage: storageData.sessionStorage || {}
  };

  console.log(`[SessionIsolation] captureFullSession: Complete - ${cookies.length} cookies, ${Object.keys(session.localStorage).length} localStorage, ${Object.keys(session.sessionStorage).length} sessionStorage`);
  return session;
}

// Save session profile to chrome.storage
async function saveSessionProfile(domain, profileType, sessionData) {
  console.log(`[SessionIsolation] saveSessionProfile: Saving ${profileType} session for ${domain}`);
  console.log(`[SessionIsolation] saveSessionProfile: Data size - cookies: ${sessionData.cookies?.length || 0}, localStorage: ${Object.keys(sessionData.localStorage || {}).length}, sessionStorage: ${Object.keys(sessionData.sessionStorage || {}).length}`);

  const result = await chrome.storage.local.get(['sessionProfiles']);
  const profiles = result.sessionProfiles || {};

  if (!profiles[domain]) {
    profiles[domain] = {};
  }
  profiles[domain][profileType] = sessionData;

  await chrome.storage.local.set({ sessionProfiles: profiles });
  console.log(`[SessionIsolation] saveSessionProfile: Successfully saved ${profileType} session for ${domain}`);
}

// Load session profile from chrome.storage
async function loadSessionProfile(domain, profileType) {
  console.log(`[SessionIsolation] loadSessionProfile: Loading ${profileType} session for ${domain}`);
  const result = await chrome.storage.local.get(['sessionProfiles']);
  const profiles = result.sessionProfiles || {};

  if (profiles[domain] && profiles[domain][profileType]) {
    const session = profiles[domain][profileType];
    console.log(`[SessionIsolation] loadSessionProfile: Found ${profileType} session - cookies: ${session.cookies?.length || 0}, capturedAt: ${session.capturedAt}`);
    return session;
  }
  console.log(`[SessionIsolation] loadSessionProfile: No ${profileType} session found for ${domain}`);
  return null;
}

// Check if agent session exists for domain
async function hasAgentSession(domain) {
  console.log(`[SessionIsolation] hasAgentSession: Checking for domain ${domain}`);
  const session = await loadSessionProfile(domain, 'agent');
  const exists = session !== null;
  console.log(`[SessionIsolation] hasAgentSession: ${exists ? 'YES' : 'NO'} for ${domain}`);
  return exists;
}

// Main session swap orchestration function
async function swapSession(tabId, domain, fromProfile, toProfile) {
  console.log(`[SessionIsolation] ========================================`);
  console.log(`[SessionIsolation] swapSession: START`);
  console.log(`[SessionIsolation] swapSession: tab=${tabId}, domain=${domain}, ${fromProfile} -> ${toProfile}`);
  console.log(`[SessionIsolation] ========================================`);

  try {
    // 1. Capture current session state
    console.log(`[SessionIsolation] swapSession: Step 1 - Capturing current ${fromProfile} session`);
    const currentSession = await captureFullSession(tabId, domain);
    await saveSessionProfile(domain, fromProfile, currentSession);
    console.log(`[SessionIsolation] swapSession: Step 1 complete - Saved ${fromProfile} session`);

    // 2. Load target session
    console.log(`[SessionIsolation] swapSession: Step 2 - Loading target ${toProfile} session`);
    const targetSession = await loadSessionProfile(domain, toProfile);

    if (!targetSession) {
      console.log(`[SessionIsolation] swapSession: ABORT - No ${toProfile} session exists for ${domain}`);
      return { success: false, reason: 'no_session' };
    }
    console.log(`[SessionIsolation] swapSession: Step 2 complete - Loaded ${toProfile} session`);

    // 3. Clear current session data
    console.log(`[SessionIsolation] swapSession: Step 3 - Clearing current session data`);
    await clearCookies(domain);
    console.log(`[SessionIsolation] swapSession: Sending CLEAR_STORAGE to tab ${tabId}`);
    await chrome.tabs.sendMessage(tabId, { type: 'CLEAR_STORAGE' });
    console.log(`[SessionIsolation] swapSession: Step 3 complete - Cleared session data`);

    // 4. Restore target session
    console.log(`[SessionIsolation] swapSession: Step 4 - Restoring ${toProfile} session`);
    await restoreCookies(targetSession.cookies);
    console.log(`[SessionIsolation] swapSession: Sending RESTORE_STORAGE to tab ${tabId}`);
    await chrome.tabs.sendMessage(tabId, {
      type: 'RESTORE_STORAGE',
      data: {
        localStorage: targetSession.localStorage,
        sessionStorage: targetSession.sessionStorage
      }
    });
    console.log(`[SessionIsolation] swapSession: Step 4 complete - Restored ${toProfile} session`);

    // 5. Update active profile tracking
    console.log(`[SessionIsolation] swapSession: Step 5 - Updating active profile tracking`);
    activeProfiles.set(domain, toProfile);
    console.log(`[SessionIsolation] swapSession: activeProfiles[${domain}] = ${toProfile}`);

    // 6. Reload the page to apply new session
    console.log(`[SessionIsolation] swapSession: Step 6 - Reloading page`);
    await chrome.tabs.reload(tabId);
    console.log(`[SessionIsolation] swapSession: Step 6 complete - Page reloaded`);

    console.log(`[SessionIsolation] ========================================`);
    console.log(`[SessionIsolation] swapSession: SUCCESS`);
    console.log(`[SessionIsolation] ========================================`);
    return { success: true };
  } catch (error) {
    console.error('[SessionIsolation] ========================================');
    console.error('[SessionIsolation] swapSession: FAILED');
    console.error('[SessionIsolation] swapSession: Error:', error);
    console.error('[SessionIsolation] ========================================');
    return { success: false, reason: 'error', error: error.message };
  }
}

// Swap from human to agent (or clear session if no agent session exists)
async function swapToAgentSession(tabId, domain, groupId, skipReload = false) {
  console.log(`[SessionIsolation] swapToAgentSession: Called for tab ${tabId}, domain ${domain}, group ${groupId}`);

  // Check if we've already swapped this domain in this session
  const swappedDomains = swappedDomainsPerSession.get(groupId) || new Set();
  if (swappedDomains.has(domain)) {
    console.log(`[SessionIsolation] swapToAgentSession: Domain ${domain} already swapped in this session, skipping`);
    return { success: true, reason: 'already_swapped' };
  }

  let humanCookieNames = [];
  let agentCookieNames = [];
  let humanCookieCount = 0;
  let agentCookieCount = 0;

  try {
    // Capture human session first (for both cases)
    console.log(`[SessionIsolation] 📤 PRE-SWAP: Capturing human session for ${domain}`);
    const humanSession = await captureFullSession(tabId, domain);
    humanCookieCount = humanSession.cookies?.length || 0;
    humanCookieNames = humanSession.cookies?.map(c => c.name) || [];
    console.log(`[SessionIsolation] 📤 HUMAN COOKIES (${humanCookieCount}): ${humanCookieNames.join(', ')}`);
    console.log(`[SessionIsolation] 📤 HUMAN localStorage keys: ${Object.keys(humanSession.localStorage || {}).join(', ')}`);
    await saveSessionProfile(domain, 'human', humanSession);

    // Check if agent session exists
    const hasAgent = await hasAgentSession(domain);

    if (hasAgent) {
      console.log(`[SessionIsolation] swapToAgentSession: Agent session found, checking if valid...`);

      // Load agent session
      const agentSession = await loadSessionProfile(domain, 'agent');
      agentCookieCount = agentSession.cookies?.length || 0;
      agentCookieNames = agentSession.cookies?.map(c => c.name) || [];
      console.log(`[SessionIsolation] 📥 AGENT COOKIES (${agentCookieCount}): ${agentCookieNames.join(', ')}`);

      // Check if agent session has ALL the cookies that human session has
      const humanCookieSet = new Set(humanCookieNames);
      const agentCookieSet = new Set(agentCookieNames);
      const missingCookies = [...humanCookieSet].filter(name => !agentCookieSet.has(name));

      if (missingCookies.length > 0) {
        console.log(`[SessionIsolation] ❌ INVALID AGENT SESSION - Missing ${missingCookies.length} cookies:`);
        console.log(`[SessionIsolation] Missing cookies: ${missingCookies.join(', ')}`);
        console.log(`[SessionIsolation] Agent session is incomplete, treating as no valid session`);

        // Treat as no valid session - trigger manual login flow
        console.log(`[SessionIsolation] ████████████████████████████████████████`);
        console.log(`[SessionIsolation] ⚠️ INCOMPLETE AGENT SESSION FOR ${domain}`);
        console.log(`[SessionIsolation] Initiating manual login flow...`);
        console.log(`[SessionIsolation] ████████████████████████████████████████`);

        // CLEAR cookies to give blank slate for login
        console.log(`[SessionIsolation] Step 1: Clearing cookies for ${domain}...`);
        await clearCookies(domain);
        await chrome.tabs.sendMessage(tabId, { type: 'CLEAR_STORAGE' });
        console.log(`[SessionIsolation] 🗑️ Cookies cleared - blank slate ready for login`);

        // Reload page so cleared cookies take effect
        console.log(`[SessionIsolation] Step 2: Reloading page...`);
        await chrome.tabs.reload(tabId);

        // STOP the agent and ask user to login manually
        console.log(`[SessionIsolation] Step 3: Stopping agent on tab ${tabId}...`);
        sendStopAgentMessage(tabId);

        console.log(`[SessionIsolation] Step 4: Stopping agent tracking...`);
        stopAgentTracking(tabId, groupId);

        // Wait for page to load before showing notification
        console.log(`[SessionIsolation] Step 5: Waiting for page to load...`);
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log(`[SessionIsolation] Step 6: Showing login required notification...`);
        showLoginRequiredNotification(domain, tabId, groupId);

        console.log(`[SessionIsolation] ✅ Manual login flow initiated. Waiting for user to login and click I've Logged In.`);
        return { success: false, reason: 'incomplete_agent_session_login_required' };
      }

      console.log(`[SessionIsolation] ✅ Agent session is COMPLETE - has all ${humanCookieCount} cookie types`);

      // Clear and restore
      await clearCookies(domain);
      await chrome.tabs.sendMessage(tabId, { type: 'CLEAR_STORAGE' });
      await restoreCookies(agentSession.cookies);
      await chrome.tabs.sendMessage(tabId, {
        type: 'RESTORE_STORAGE',
        data: {
          localStorage: agentSession.localStorage,
          sessionStorage: agentSession.sessionStorage
        }
      });
      console.log(`[SessionIsolation] ✅ POST-SWAP: Agent session restored for ${domain}`);

      // Mark this domain as swapped for this session
      swappedDomains.add(domain);
      swappedDomainsPerSession.set(groupId, swappedDomains);

      // Reload page (unless skipped for navigation handling)
      if (!skipReload) {
        await chrome.tabs.reload(tabId);
      }

      // Show notification with cookie details
      const notifMessage = `${domain}\n📤 Saved ${humanCookieCount} human cookies\n📥 Loaded ${agentCookieCount} agent cookies`;
      showSystemNotification('🔄 Agent Session Active', notifMessage);

      return { success: true, reason: 'agent_session_restored' };
    } else {
      console.log(`[SessionIsolation] ████████████████████████████████████████`);
      console.log(`[SessionIsolation] ⚠️ NO AGENT SESSION FOUND FOR ${domain}`);
      console.log(`[SessionIsolation] Initiating manual login flow...`);
      console.log(`[SessionIsolation] ████████████████████████████████████████`);

      // CLEAR cookies to give blank slate for login
      console.log(`[SessionIsolation] Step 1: Clearing cookies for ${domain}...`);
      await clearCookies(domain);
      await chrome.tabs.sendMessage(tabId, { type: 'CLEAR_STORAGE' });
      console.log(`[SessionIsolation] 🗑️ Cookies cleared - blank slate ready for login`);

      // Reload page so cleared cookies take effect
      console.log(`[SessionIsolation] Step 2: Reloading page...`);
      await chrome.tabs.reload(tabId);

      // STOP the agent and ask user to login manually
      console.log(`[SessionIsolation] Step 3: Stopping agent on tab ${tabId}...`);
      sendStopAgentMessage(tabId);

      console.log(`[SessionIsolation] Step 4: Stopping agent tracking...`);
      stopAgentTracking(tabId, groupId);

      // Wait for page to load before showing notification
      console.log(`[SessionIsolation] Step 5: Waiting for page to load...`);
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log(`[SessionIsolation] Step 6: Showing login required notification...`);
      showLoginRequiredNotification(domain, tabId, groupId);

      console.log(`[SessionIsolation] ✅ Manual login flow initiated. Waiting for user to login and click I've Logged In.`);
      return { success: false, reason: 'no_agent_session_login_required' };
    }
  } catch (error) {
    console.error('[SessionIsolation] swapToAgentSession: Failed:', error);
    return { success: false, reason: 'error', error: error.message };
  }
}

// Swap from agent back to human for ALL domains that were swapped in this session
async function swapAllDomainsToHuman(tabId, groupId) {
  console.log(`[SessionIsolation] swapAllDomainsToHuman: Called for tab ${tabId}, group ${groupId}`);

  // Check if there's a pending login for this group - if so, don't auto-restore
  // Let the notification buttons handle it
  for (const [notifId, loginInfo] of pendingLogins.entries()) {
    if (loginInfo.groupId === groupId) {
      console.log(`[SessionIsolation] swapAllDomainsToHuman: Pending login exists for group ${groupId}, skipping auto-restore`);
      console.log(`[SessionIsolation] User should use notification buttons to restore or save session`);
      return { success: true, reason: 'pending_login' };
    }
  }

  const swappedDomains = swappedDomainsPerSession.get(groupId);
  if (!swappedDomains || swappedDomains.size === 0) {
    console.log(`[SessionIsolation] swapAllDomainsToHuman: No domains were swapped in this session`);
    return { success: true, reason: 'no_domains_swapped' };
  }

  console.log(`[SessionIsolation] swapAllDomainsToHuman: Restoring ${swappedDomains.size} domains: ${[...swappedDomains].join(', ')}`);

  // Get current tab's domain to know which one to reload
  let currentDomain = null;
  try {
    const tab = await chrome.tabs.get(tabId);
    currentDomain = getRootDomain(new URL(tab.url).hostname);
  } catch (e) {
    console.error('[SessionIsolation] swapAllDomainsToHuman: Failed to get current tab:', e);
  }

  const results = [];
  for (const domain of swappedDomains) {
    console.log(`[SessionIsolation] ----------------------------------------`);
    console.log(`[SessionIsolation] swapAllDomainsToHuman: Restoring ${domain}`);
    try {
      // Capture current agent session for this domain
      const agentSession = await captureFullSessionByDomain(domain);
      if (agentSession) {
        const agentCookieNames = agentSession.cookies?.map(c => c.name) || [];
        console.log(`[SessionIsolation] 📤 AGENT COOKIES TO SAVE (${agentSession.cookies?.length || 0}): ${agentCookieNames.join(', ')}`);
        await saveSessionProfile(domain, 'agent', agentSession);
      }

      // Load and restore human session
      const humanSession = await loadSessionProfile(domain, 'human');
      if (humanSession) {
        const humanCookieNames = humanSession.cookies?.map(c => c.name) || [];
        console.log(`[SessionIsolation] 📥 HUMAN COOKIES TO RESTORE (${humanSession.cookies?.length || 0}): ${humanCookieNames.join(', ')}`);
        await clearCookies(domain);
        await restoreCookies(humanSession.cookies);
        console.log(`[SessionIsolation] ✅ Restored human session for ${domain}`);
        results.push({ domain, success: true, humanCookies: humanSession.cookies?.length || 0 });
      } else {
        console.log(`[SessionIsolation] ⚠️ No human session for ${domain}, just clearing`);
        await clearCookies(domain);
        results.push({ domain, success: true, reason: 'no_human_session' });
      }
    } catch (error) {
      console.error(`[SessionIsolation] ❌ Failed for ${domain}:`, error);
      results.push({ domain, success: false, error: error.message });
    }
  }
  console.log(`[SessionIsolation] ----------------------------------------`);

  // Clear storage for current tab and reload
  if (currentDomain && swappedDomains.has(currentDomain)) {
    try {
      const humanSession = await loadSessionProfile(currentDomain, 'human');
      await chrome.tabs.sendMessage(tabId, { type: 'CLEAR_STORAGE' });
      if (humanSession) {
        await chrome.tabs.sendMessage(tabId, {
          type: 'RESTORE_STORAGE',
          data: {
            localStorage: humanSession.localStorage,
            sessionStorage: humanSession.sessionStorage
          }
        });
      }
      await chrome.tabs.reload(tabId);
      console.log(`[SessionIsolation] swapAllDomainsToHuman: Reloaded current tab`);
    } catch (e) {
      console.error('[SessionIsolation] swapAllDomainsToHuman: Failed to reload tab:', e);
    }
  }

  // Clear the swapped domains tracking for this session
  swappedDomainsPerSession.delete(groupId);
  console.log(`[SessionIsolation] swapAllDomainsToHuman: Cleared tracking for group ${groupId}`);

  // Show notification (system notification since page may be reloading)
  const restoredDomains = results.filter(r => r.success).map(r => r.domain);
  if (restoredDomains.length > 0) {
    const domainList = restoredDomains.length <= 2
      ? restoredDomains.join(', ')
      : `${restoredDomains[0]} + ${restoredDomains.length - 1} more`;
    showSystemNotification('👤 Human Session Restored', `Your session restored for: ${domainList}`);
  }

  return { success: true, results };
}

// Capture session by domain (cookies only, no tab needed)
async function captureFullSessionByDomain(domain) {
  console.log(`[SessionIsolation] captureFullSessionByDomain: Capturing for ${domain}`);
  const cookies = await captureCookies(domain);
  if (cookies.length === 0) {
    console.log(`[SessionIsolation] captureFullSessionByDomain: No cookies for ${domain}`);
    return null;
  }
  return {
    domain,
    capturedAt: new Date().toISOString(),
    cookies,
    localStorage: {}, // Can't capture without tab
    sessionStorage: {} // Can't capture without tab
  };
}

// ============================================================================
// MANUAL SESSION SNAPSHOT
// ============================================================================
async function manualSnapshotSession(tabId) {
  console.log(`[SessionIsolation] ████████████████████████████████████████`);
  console.log(`[SessionIsolation] MANUAL SNAPSHOT - ENTRY POINT`);
  console.log(`[SessionIsolation] Tab: ${tabId}`);
  console.log(`[SessionIsolation] ████████████████████████████████████████`);

  try {
    // Get tab info
    const tab = await chrome.tabs.get(tabId);
    if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
      showSystemNotification('❌ Snapshot Failed', 'Cannot snapshot internal browser pages');
      return { success: false, reason: 'invalid_page' };
    }

    const hostname = new URL(tab.url).hostname;
    const domain = getRootDomain(hostname);
    console.log(`[SessionIsolation] Snapshotting domain: ${domain}`);

    // Capture full session
    const session = await captureFullSession(tabId, domain);
    const cookieNames = session.cookies?.map(c => c.name) || [];
    console.log(`[SessionIsolation] 📸 SNAPSHOT COOKIES (${session.cookies?.length || 0}): ${cookieNames.join(', ')}`);
    console.log(`[SessionIsolation] 📸 SNAPSHOT localStorage keys: ${Object.keys(session.localStorage || {}).join(', ')}`);

    // Save as human profile
    await saveSessionProfile(domain, 'human', session);

    // Show success notification
    const cookieCount = session.cookies?.length || 0;
    const localStorageCount = Object.keys(session.localStorage || {}).length;
    showSystemNotification(
      '📸 Session Snapshot Saved',
      `${domain}\n🍪 ${cookieCount} cookies\n📦 ${localStorageCount} localStorage items\n\nYour session is now protected!`
    );

    // Log the full saved data directly
    console.log(`[SessionIsolation] ✅ Manual snapshot saved for ${domain}`);
    console.log(`[SessionIsolation] 📦 FULL SAVED SESSION DATA:`);
    console.log(JSON.stringify(session, null, 2));

    return { success: true, domain, cookieCount, localStorageCount, session };
  } catch (error) {
    console.error('[SessionIsolation] Manual snapshot failed:', error);
    showSystemNotification('❌ Snapshot Failed', error.message);
    return { success: false, reason: 'error', error: error.message };
  }
}

// View stored sessions (for debugging) - returns FULL data
async function getStoredSessions() {
  const result = await chrome.storage.local.get(['sessionProfiles']);
  return result.sessionProfiles || {};
}

// Delete a session profile
async function deleteSessionProfile(domain, profileType) {
  console.log(`[SessionIsolation] Deleting ${profileType} session for ${domain}`);
  try {
    const result = await chrome.storage.local.get(['sessionProfiles']);
    const profiles = result.sessionProfiles || {};

    if (profiles[domain] && profiles[domain][profileType]) {
      delete profiles[domain][profileType];

      // If no profiles left for this domain, delete the domain entry
      if (!profiles[domain].human && !profiles[domain].agent) {
        delete profiles[domain];
      }

      await chrome.storage.local.set({ sessionProfiles: profiles });
      console.log(`[SessionIsolation] Successfully deleted ${profileType} session for ${domain}`);
      return { success: true };
    } else {
      console.log(`[SessionIsolation] No ${profileType} session found for ${domain}`);
      return { success: false, reason: 'not_found' };
    }
  } catch (error) {
    console.error('[SessionIsolation] Error deleting session profile:', error);
    return { success: false, reason: 'error', error: error.message };
  }
}

// Manually restore human session (from popup button)
async function restoreHumanSessionManual(tabId) {
  console.log(`[SessionIsolation] ████████████████████████████████████████`);
  console.log(`[SessionIsolation] 👤 MANUAL RESTORE HUMAN SESSION REQUEST`);
  console.log(`[SessionIsolation] Tab: ${tabId}`);
  console.log(`[SessionIsolation] ████████████████████████████████████████`);

  try {
    // Check if agent is active for this tab
    const activation = activeAgentTabs.get(tabId);
    if (!activation) {
      console.log(`[SessionIsolation] ⚠️ No active agent found for tab ${tabId}`);
      return { success: false, reason: 'no_active_agent' };
    }

    const groupId = activation.groupId;
    console.log(`[SessionIsolation] Found active agent - Group: ${groupId}`);

    // Stop the agent
    console.log(`[SessionIsolation] Stopping agent...`);
    sendStopAgentMessage(tabId);
    stopAgentTracking(tabId, groupId);

    // Restore all human sessions for this group
    const result = await swapAllDomainsToHuman(tabId, groupId);

    if (result.success) {
      console.log(`[SessionIsolation] ✅ Successfully restored human sessions`);
      showSystemNotification(
        '👤 Human Session Restored',
        `Agent stopped and your session has been restored.`
      );
    }

    console.log(`[SessionIsolation] ████████████████████████████████████████`);
    return result;
  } catch (error) {
    console.error('[SessionIsolation] ❌ Failed to restore human session:', error);
    return { success: false, reason: 'error', error: error.message };
  }
}

// Context menu for manual snapshot
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'snapshot-session',
    title: '📸 Snapshot Session (Save for Agent Protection)',
    contexts: ['page']
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'snapshot-session' && tab?.id) {
    await manualSnapshotSession(tab.id);
  }
});

// Keyboard shortcut handler
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'snapshot-session') {
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (activeTab?.id) {
      await manualSnapshotSession(activeTab.id);
    }
  }
});
// ============================================================================


// Restore human session (used on failure or cancellation)
// ============================================================================

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const tab = sender.tab;
  const groupId = tab?.groupId;

  if (message.type === 'AGENT_DETECTED') {
    return onMessageAgentDetected(tab, groupId);
  }

  else if (message.type === 'AGENT_STOPPED') {
    return onMessageAgentStopped(tab, groupId);
  }

  else if (message.type === 'ACTION_BLOCKED') {
    return onMessageAgentBlocked(message, tab);
  }

  else if (message.type === 'SCREENSHOT_TRIGGER') {
    return onMessageScreenshotTrigger(message, tab);
  }

  else if (message.type === 'RELOAD_BLOCKING_RULES') {
    urlBlockingRules = message.rules || [];
    safeTrackEvent('domain_blocking_rules_updated', {
      ruleCount: urlBlockingRules.length
    });
    return;
  }

  else if (message.type === 'RELOAD_URL_PAIR_RULES') {
    urlPairBlockingRules = message.rules || [];
    safeTrackEvent('url_pair_blocking_rules_updated', {
      ruleCount: urlPairBlockingRules.length
    });
    return;
  }

  else if (message.type === 'RELOAD_BLOCKED_ACTIONS') {
    blockedActions = message.actions || [];
    safeTrackEvent('action_blocking_rules_updated', {
      blockedActionCount: blockedActions.length
    });
    return;
  }

  else if (message.type === 'RELOAD_GOVERNANCE_RULES') {
    governanceRules = message.rules || {};
    safeTrackEvent('governance_rules_updated', {
      disallowClickableUrls: governanceRules.disallow_clickable_urls || false,
      disallowQueryParams: governanceRules.disallow_query_params || false
    });
    updateDNRRules();
    return;
  }

  else if (message.type === 'MANUAL_SNAPSHOT') {
    // Trigger manual session snapshot for the sender's tab
    const tabId = tab?.id;
    if (tabId) {
      manualSnapshotSession(tabId).then(result => {
        sendResponse(result);
      });
      return true; // Keep channel open for async response
    }
    sendResponse({ success: false, reason: 'no_tab' });
    return;
  }

  else if (message.type === 'VIEW_STORED_SESSIONS') {
    // Return summary of all stored session profiles
    getStoredSessions().then(summary => {
      console.log('[SessionIsolation] Stored sessions:', JSON.stringify(summary, null, 2));
      sendResponse(summary);
    });
    return true; // Keep channel open for async response
  }

  else if (message.type === 'DELETE_SESSION_PROFILE') {
    // Delete a specific session profile
    deleteSessionProfile(message.domain, message.profileType).then(result => {
      sendResponse(result);
    });
    return true; // Keep channel open for async response
  }

  else if (message.type === 'GET_AGENT_STATUS') {
    // Check if agent is active for this tab
    const tabId = message.tabId;
    console.log(`[SessionIsolation] GET_AGENT_STATUS request for tab ${tabId}`);
    console.log(`[SessionIsolation] activeAgentTabs:`, Array.from(activeAgentTabs.entries()));

    const activation = activeAgentTabs.get(tabId);

    if (activation && activation.groupId) {
      const swappedDomains = swappedDomainsPerSession.get(activation.groupId);
      console.log(`[SessionIsolation] Agent IS active - Group: ${activation.groupId}, Swapped domains:`, Array.from(swappedDomains || []));
      sendResponse({
        isAgentActive: true,
        groupId: activation.groupId,
        swappedDomains: swappedDomains ? Array.from(swappedDomains) : []
      });
    } else {
      console.log(`[SessionIsolation] Agent NOT active for tab ${tabId}`);
      sendResponse({ isAgentActive: false });
    }
    return true;
  }

  else if (message.type === 'RESTORE_HUMAN_SESSION') {
    // Restore human session and stop agent
    const tabId = message.tabId;
    restoreHumanSessionManual(tabId).then(result => {
      sendResponse(result);
    });
    return true; // Keep channel open for async response
  }

  // SESSION ISOLATION: Handle "I've Logged In" button click from in-page notification
  else if (message.type === 'LOGIN_BUTTON_CLICKED') {
    const domain = message.domain;
    const tabId = tab?.id;
    console.log(`[SessionIsolation] ████████████████████████████████████████`);
    console.log(`[SessionIsolation] 🔘 LOGIN_BUTTON_CLICKED`);
    console.log(`[SessionIsolation] Domain: ${domain}, Tab: ${tabId}`);

    (async () => {
      try {
        // Capture the now-logged-in session as agent session
        const agentSession = await captureFullSession(tabId, domain);
        const cookieCount = agentSession.cookies?.length || 0;
        const localStorageCount = Object.keys(agentSession.localStorage || {}).length;

        console.log(`[SessionIsolation] 📸 Captured agent session - ${cookieCount} cookies, ${localStorageCount} localStorage items`);

        await saveSessionProfile(domain, 'agent', agentSession);
        console.log(`[SessionIsolation] ✅ Saved logged-in session as agent profile for ${domain}`);

        // Clear pending login
        for (const [key, info] of pendingLogins.entries()) {
          if (info.domain === domain && info.tabId === tabId) {
            pendingLogins.delete(key);
            break;
          }
        }

        // Show success notification
        showSystemNotification(
          '✅ Agent Session Saved',
          `Logged-in session for ${domain} saved.\n🍪 ${cookieCount} cookies\n📦 ${localStorageCount} localStorage items`
        );

        console.log(`[SessionIsolation] ████████████████████████████████████████`);
      } catch (error) {
        console.error('[SessionIsolation] ❌ Failed to save agent session:', error);
        showSystemNotification('❌ Failed to Save Session', error.message);
      }
    })();
    return;
  }

  // SESSION ISOLATION: Handle "Restore My Session" button click from in-page notification
  else if (message.type === 'RESTORE_BUTTON_CLICKED') {
    const domain = message.domain;
    const tabId = tab?.id;
    console.log(`[SessionIsolation] ████████████████████████████████████████`);
    console.log(`[SessionIsolation] 🔘 RESTORE_BUTTON_CLICKED`);
    console.log(`[SessionIsolation] Domain: ${domain}, Tab: ${tabId}`);

    (async () => {
      try {
        // Load human session
        const humanSession = await loadSessionProfile(domain, 'human');

        if (humanSession) {
          const cookieCount = humanSession.cookies?.length || 0;
          console.log(`[SessionIsolation] Found human session - ${cookieCount} cookies`);

          // Clear current cookies
          await clearCookies(domain);
          await chrome.tabs.sendMessage(tabId, { type: 'CLEAR_STORAGE' });

          // Restore human session
          await restoreCookies(humanSession.cookies);
          await chrome.tabs.sendMessage(tabId, {
            type: 'RESTORE_STORAGE',
            data: {
              localStorage: humanSession.localStorage,
              sessionStorage: humanSession.sessionStorage
            }
          });

          // Clear pending login
          for (const [key, info] of pendingLogins.entries()) {
            if (info.domain === domain && info.tabId === tabId) {
              pendingLogins.delete(key);
              break;
            }
          }

          // Reload the page
          await chrome.tabs.reload(tabId);

          console.log(`[SessionIsolation] ✅ Human session restored for ${domain}`);
          showSystemNotification(
            '👤 Your Session Restored',
            `Your original session for ${domain} has been restored.\n🍪 ${cookieCount} cookies restored`
          );
        } else {
          console.error(`[SessionIsolation] ❌ No human session found for ${domain}`);
          showSystemNotification('❌ No Session Found', `No saved human session for ${domain}`);
        }

        console.log(`[SessionIsolation] ████████████████████████████████████████`);
      } catch (error) {
        console.error('[SessionIsolation] ❌ Failed to restore human session:', error);
        showSystemNotification('❌ Failed to Restore Session', error.message);
      }
    })();
    return;
  }

  else {
    return handleAuthMessages(message, sendResponse);
  }

});


(async () => {
  const result = await chrome.storage.local.get(['urlBlockingRules', 'urlPairBlockingRules', 'blockedActions', 'governanceRules', 'sessions']);

  if (result.urlBlockingRules) {
    urlBlockingRules = result.urlBlockingRules;
  }

  if (result.urlPairBlockingRules) {
    urlPairBlockingRules = result.urlPairBlockingRules;
  }

  if (result.blockedActions) {
    blockedActions = result.blockedActions;
  }

  if (result.governanceRules) {
    governanceRules = result.governanceRules;
    await updateDNRRules();
  }

  const allSessions = result.sessions || [];
  const validSessions = [];

  for (const session of allSessions) {
    if (session.status === 'active') {
      try {
        const tab = await chrome.tabs.get(session.tabId);
        const group = await chrome.tabGroups.get(session.groupId);

        if (tab && group && tab.groupId === session.groupId) {
          sessions.set(session.groupId, session);
          validSessions.push(session);
        } else {
          session.status = 'ended';
          session.endTime = new Date().toISOString();
          validSessions.push(session);
        }
      } catch (error) {
        session.status = 'ended';
        session.endTime = new Date().toISOString();
        validSessions.push(session);
      }
    } else {
      validSessions.push(session);
    }
  }
  await chrome.storage.local.set({ sessions: validSessions });
})();
// ============================================================================


// VISIBILITY: QUEUED STORAGE WRITES FOR SCREENSHOTS
// ============================================================================
const storageWriteQueue = [];
let isProcessingQueue = false;

async function queuedStorageWrite(screenshotData, activation) {
  return new Promise((resolve) => {
    storageWriteQueue.push({ screenshotData, activation, resolve });
    processStorageQueue();
  });
}

async function processStorageQueue() {
  if (isProcessingQueue || storageWriteQueue.length === 0) {
    return;
  }
  isProcessingQueue = true;
  while (storageWriteQueue.length > 0) {
    const { screenshotData, activation, resolve } = storageWriteQueue.shift();
    try {
      const result = await chrome.storage.local.get(['screenshots', 'sessions']);
      const screenshots = result.screenshots || [];
      const allSessions = result.sessions || [];

      screenshots.push(screenshotData);
      if (screenshots.length > 100) {
        screenshots.shift();
      }

      const sessionIndex = allSessions.findIndex(s => s.id === activation.sessionId);
      if (sessionIndex !== -1) {
        allSessions[sessionIndex].screenshotCount = (allSessions[sessionIndex].screenshotCount || 0) + 1;
        const groupId = activation.groupId;
        if (sessions.get(groupId)) {
          sessions.get(groupId).screenshotCount = allSessions[sessionIndex].screenshotCount;
        }
      }

      await chrome.storage.local.set({ screenshots: screenshots, sessions: allSessions });
      resolve(screenshotData.id);
    } catch (error) {
      console.error('[ContextFort] ❌ Storage write failed:', error);
      resolve(null);
    }
  }

  isProcessingQueue = false;
}
// ============================================================================



// ============================================================================
// GOVERNANCE: DECLARATIVE NET REQUEST RULES
const DNR_RULE_IDS = {
  DISALLOW_CLICKABLE_URLS: 1000,
  DISALLOW_QUERY_PARAMS: 1001
};

async function updateDNRRules() {
  try {
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const existingRuleIds = new Set(existingRules.map(r => r.id));

    const rulesToAdd = [];
    const ruleIdsToRemove = [];

    if (governanceRules.disallow_clickable_urls) {
      if (!existingRuleIds.has(DNR_RULE_IDS.DISALLOW_CLICKABLE_URLS)) {
        rulesToAdd.push({
          id: DNR_RULE_IDS.DISALLOW_CLICKABLE_URLS,
          priority: 1,
          action: { type: "block" },
          condition: {
            initiatorDomains: ["fcoeoabgfenejglbffodgkkbkcdhcgfn"],
            resourceTypes: ["main_frame"],
            regexFilter: "^https?://"
          }
        });
      }
    } else {
      if (existingRuleIds.has(DNR_RULE_IDS.DISALLOW_CLICKABLE_URLS)) {
        ruleIdsToRemove.push(DNR_RULE_IDS.DISALLOW_CLICKABLE_URLS);
      }
    }

    if (governanceRules.disallow_query_params) {
      if (!existingRuleIds.has(DNR_RULE_IDS.DISALLOW_QUERY_PARAMS)) {
        rulesToAdd.push({
          id: DNR_RULE_IDS.DISALLOW_QUERY_PARAMS,
          priority: 1,
          action: {
            type: 'block'
          },
          condition: {
            initiatorDomains: ["fcoeoabgfenejglbffodgkkbkcdhcgfn"],
            resourceTypes: ['main_frame'],
            urlFilter: '|http*://*?*'
          }
        });
      }
    } else {
      if (existingRuleIds.has(DNR_RULE_IDS.DISALLOW_QUERY_PARAMS)) {
        ruleIdsToRemove.push(DNR_RULE_IDS.DISALLOW_QUERY_PARAMS);
      }
    }

    // Only update if there are changes
    if (rulesToAdd.length > 0 || ruleIdsToRemove.length > 0) {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: ruleIdsToRemove,
        addRules: rulesToAdd
      });

    }
  } catch (error) {
    console.error('[DNR] Failed to update rules:', error);
  }
};
// ============================================================================


// VISIBILITY: TRACK AGENT SESSIONS FOR CONTEXT TRACKING
// ============================================================================
async function getOrCreateSession(groupId, firstTabId, firstTabUrl, firstTabTitle) {
  if (sessions.has(groupId)) {
    return sessions.get(groupId);
  }

  const sessionId = Date.now();
  const session = {
    id: sessionId,
    groupId: groupId,
    startTime: new Date().toISOString(),
    endTime: null,
    duration: null,
    tabId: firstTabId,
    tabTitle: firstTabTitle || 'Unknown',
    tabUrl: firstTabUrl || 'Unknown',
    screenshotCount: 0,
    status: 'active',
    visitedUrls: []
  };

  sessions.set(groupId, session);
  const result = await chrome.storage.local.get(['sessions']);
  const allSessions = result.sessions || [];
  allSessions.unshift(session);
  await chrome.storage.local.set({ sessions: allSessions });

  const tabsInGroup = await chrome.tabs.query({ groupId: groupId });
  if (tabsInGroup.length > 1) {
    const tabsToUngroup = tabsInGroup.filter(t => t.id !== firstTabId);
    for (const tabToRemove of tabsToUngroup) {
      try {
        await chrome.tabs.ungroup(tabToRemove.id);
      } catch (err) {
      }
    }
  }

  return session;
}

async function endSession(groupId, reason = 'unknown') {
  const session = sessions.get(groupId);
  if (!session) {
    return;
  }

  session.endTime = new Date().toISOString();
  session.status = 'ended';
  const start = new Date(session.startTime);
  const end = new Date(session.endTime);
  session.duration = Math.round((end - start) / 1000); // Convert to seconds

  const result = await chrome.storage.local.get(['sessions']);
  const allSessions = result.sessions || [];
  const index = allSessions.findIndex(s => s.id === session.id);
  if (index !== -1) {
    allSessions[index] = session;
    await chrome.storage.local.set({ sessions: allSessions });
  }

  for (const [tabId, activation] of activeAgentTabs.entries()) {
    if (activation.groupId === groupId) {
      activeAgentTabs.delete(tabId);
    }
  }
  sessions.delete(groupId);
}

chrome.tabGroups.onRemoved.addListener(async (groupId) => {
  await endSession(groupId, 'tab_group_removed');
});

const groupTitles = new Map();

function hasAgentStateEmoji(str) {
  return str.includes('✅') || str.includes('⌛') || str.includes('🔔');
}

chrome.tabGroups.onUpdated.addListener(async (group) => {

  const previousTitle = groupTitles.get(group.id);
  const currentTitle = group.title;

  const hadSandTimer = previousTitle && previousTitle.includes('⌛');
  const hasSandTimer = currentTitle && currentTitle.includes('⌛');
  const hasCheckmark = currentTitle && currentTitle.includes('✅');

  if (!hadSandTimer && hasSandTimer) {
    chrome.tabs.query({ groupId: group.id }, async (tabs) => {
      if (chrome.runtime.lastError || tabs.length === 0) return;
      const tab = tabs[0];
      onMessageAgentDetected(tab, group.id);
      await chrome.tabs.sendMessage(tab.id, { type: 'START_AGENT_LISTENING' });
    });
  }

  // ⌛ → ✅ → Agent stopped
  if (hadSandTimer && !hasSandTimer && hasCheckmark) {
    chrome.tabs.query({ groupId: group.id }, async (tabs) => {
      if (chrome.runtime.lastError || tabs.length === 0) return;
      const tab = tabs[0];
      onMessageAgentStopped(tab, group.id);
      await chrome.tabs.sendMessage(tab.id, { type: 'STOP_AGENT_LISTENING' });
    });
  }


  const hadAgentEmoji = previousTitle && hasAgentStateEmoji(previousTitle);
  const hasAgentEmoji = currentTitle && hasAgentStateEmoji(currentTitle);

  if (hadAgentEmoji && !hasAgentEmoji) {
    chrome.tabs.query({ groupId: group.id }, (tabs) => {
      if (chrome.runtime.lastError || tabs.length === 0) {
        return;
      }

      const hasActiveTab = tabs.some(tab => tab.active);
      if (hasActiveTab) {
        const activeTab = tabs.find(tab => tab.active);
        chrome.windows.get(activeTab.windowId, (window) => {
          if (chrome.runtime.lastError) {
            return;
          }

          if (window.focused) {
            endSession(group.id, 'checkmark_removed_by_user');
          } else {
            let emojiToRestore = '✅';
            if (previousTitle.includes('⌛')) emojiToRestore = '⌛';
            else if (previousTitle.includes('🔔')) emojiToRestore = '🔔';
            const restoredTitle = hasAgentStateEmoji(currentTitle) ? currentTitle : `${emojiToRestore} ${currentTitle}`;
            chrome.tabGroups.update(group.id, { title: restoredTitle }).then(() => {
              groupTitles.set(group.id, restoredTitle);
            }).catch(() => {});
          }
        });
      } else {
        let emojiToRestore = '✅';
        if (previousTitle.includes('⌛')) emojiToRestore = '⌛';
        else if (previousTitle.includes('🔔')) emojiToRestore = '🔔';
        const restoredTitle = hasAgentStateEmoji(currentTitle) ? currentTitle : `${emojiToRestore} ${currentTitle}`;
        chrome.tabGroups.update(group.id, { title: restoredTitle }).then(() => {
          groupTitles.set(group.id, restoredTitle);
        }).catch(() => {});
      }
    });
  } else {
    groupTitles.set(group.id, currentTitle);
  }
});
// ============================================================================




/// VISIBILITY: TRACK AGENT MODES
// ============================================================================
function trackAgentActivation(groupId, tabId, action) {
  const session = sessions.get(groupId);
  if (!session) {
    return;
  }

  if (action === 'start') {
    activeAgentTabs.set(tabId, {
      sessionId: session.id,
      groupId: groupId
    });
  } else if (action === 'stop') {
    activeAgentTabs.delete(tabId);
  }
}

chrome.tabs.onRemoved.addListener(async (tabId) => {
  activeAgentTabs.delete(tabId);
  for (const [groupId, session] of sessions.entries()) {
    if (session.status === 'active' && session.tabId === tabId) {
      await endSession(groupId, 'session_tab_closed');
      break;
    }
  }
});


function showBlockNotification(tabId, blockCheck, newUrl) {
  const newHostname = getHostname(newUrl);
  const conflictingHostname = getHostname(blockCheck.conflictingUrl);
  showInPageNotification(
    tabId,
    '⛔ Agent Mode Denied',
    `Cannot navigate to ${newHostname} because ${conflictingHostname} was already visited in this session.`,
    'error'
  );
}

function onMessageAgentDetected(tab, groupId) {
  safeTrackEvent('AGENT_DETECTED', {agentMode: 'started'});
  if (groupId && groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
    getOrCreateSession(groupId, tab.id, tab.url, tab.title).then(async session => {
      const blockCheck = shouldBlockNavigation(tab.url, session.visitedUrls);
      if (blockCheck.blocked) {
        safeTrackEvent('navigation_blocked', {
          reason: blockCheck.reason.includes('not allowed') ? 'domain_blocked' : 'context_mixing'
        });
        sendStopAgentMessage(tab.id);
        stopAgentTracking(tab.id, groupId);
        showBlockNotification(tab.id, blockCheck, tab.url);
        showBadgeNotification('⛔', '#FF0000');
        return;
      }

      // SESSION ISOLATION: Swap to agent session
      console.log(`[SessionIsolation] ████████████████████████████████████████`);
      console.log(`[SessionIsolation] AGENT DETECTED - ENTRY POINT`);
      console.log(`[SessionIsolation] Tab: ${tab.id}, URL: ${tab.url}, Group: ${groupId}`);
      console.log(`[SessionIsolation] ████████████████████████████████████████`);
      try {
        const domain = new URL(tab.url).hostname;
        const rootDomain = getRootDomain(domain);
        console.log(`[SessionIsolation] Domain: ${domain}, Root: ${rootDomain}`);

        const swapResult = await swapToAgentSession(tab.id, rootDomain, groupId);
        console.log(`[SessionIsolation] swapToAgentSession result:`, swapResult);

        if (swapResult.success) {
          console.log(`[SessionIsolation] Successfully swapped to agent session for ${rootDomain}`);
          safeTrackEvent('session_isolation_swapped', { domain: rootDomain, direction: 'to_agent' });
        } else {
          console.log(`[SessionIsolation] Swap failed: ${swapResult.reason}`);
        }
      } catch (e) {
        console.error('[SessionIsolation] Error during agent session swap:', e);
      }

      trackAgentActivation(groupId, tab.id, 'start');
      await addPageReadAndVisitedUrl(session, tab.id, tab.url, tab.title);
    });
  }
}

async function onMessageAgentStopped(tab, groupId) {
  safeTrackEvent('AGENT_STOPPED', {agentMode: 'stopped'});

  // SESSION ISOLATION: Restore human session for ALL domains that were swapped
  console.log(`[SessionIsolation] ████████████████████████████████████████`);
  console.log(`[SessionIsolation] AGENT STOPPED - ENTRY POINT`);
  console.log(`[SessionIsolation] Tab: ${tab.id}, URL: ${tab.url}, Group: ${groupId}`);
  console.log(`[SessionIsolation] ████████████████████████████████████████`);

  if (groupId) {
    try {
      const swapResult = await swapAllDomainsToHuman(tab.id, groupId);
      console.log(`[SessionIsolation] swapAllDomainsToHuman result:`, swapResult);

      if (swapResult.reason === 'pending_login') {
        console.log(`[SessionIsolation] Skipped restore - pending login, user will use notification buttons`);
      } else if (swapResult.reason === 'no_domains_swapped') {
        console.log(`[SessionIsolation] Skipped restore - no domains were swapped in this session`);
      } else if (swapResult.success && swapResult.results) {
        console.log(`[SessionIsolation] Successfully restored human sessions for ${swapResult.results.length} domains`);
        safeTrackEvent('session_isolation_restored', { domains: swapResult.results?.length || 0 });
      } else {
        console.log(`[SessionIsolation] Restore result: ${swapResult.reason}`);
      }
    } catch (e) {
      console.error('[SessionIsolation] Error during human session restore:', e);
    }

    trackAgentActivation(groupId, tab.id, 'stop');
  }
}

function onMessageAgentBlocked(message, tab) {
  safeTrackEvent('ACTION_BLOCKED', {actionType: message.actionType});
  sendStopAgentMessage(tab.id);
  stopAgentTracking(tab.id, tab.groupId);
  showBadgeNotification('⛔', '#FF0000');
  showInPageNotification(
    tab.id,
    '⛔ Action Blocked',
    `Agent attempted to ${message.actionType} on a restricted element at ${getHostname(message.url)}`,
    'error'
  );
}

function sendStopAgentMessage(tabId) {
  console.log(`[SessionIsolation] 🛑 STOPPING AGENT on tab ${tabId}`);
  try {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => {
        const clickStopButton = () => {
          const stopButton = document.getElementById('claude-agent-stop-button');
          if (stopButton) {
            console.log('[SessionIsolation] ✅ Found stop button, clicking it now');
            const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window });
            const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window });
            const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });

            stopButton.dispatchEvent(mouseDownEvent);
            stopButton.dispatchEvent(mouseUpEvent);
            stopButton.dispatchEvent(clickEvent);
            stopButton.click();
            console.log('[SessionIsolation] ✅ Stop button clicked successfully');
            return true;
          }
          return false;
        };

        // Try clicking immediately
        if (clickStopButton()) {
          return;
        }

        console.log('[SessionIsolation] Stop button not found immediately, retrying...');
        let retries = 0;
        const maxRetries = 3;
        const retryInterval = setInterval(() => {
          retries++;
          console.log(`[SessionIsolation] Retry ${retries}/${maxRetries} to find stop button`);
          if (clickStopButton()) {
            clearInterval(retryInterval);
          } else if (retries >= maxRetries) {
            clearInterval(retryInterval);
            console.error('[SessionIsolation] ❌ Stop button not found after', maxRetries, 'retries');
          }
        }, 200);
      }
    }, (results) => {
      if (chrome.runtime.lastError) {
        console.error('[SessionIsolation] ❌ Failed to execute stop script:', chrome.runtime.lastError);
      } else {
        console.log('[SessionIsolation] ✅ Stop script executed successfully');
      }
    });
  } catch (e) {
    console.error('[SessionIsolation] ❌ Failed to stop agent:', e);
  }
}

function showBadgeNotification(text, color) {
  chrome.action.setBadgeText({ text: text });
  chrome.action.setBadgeBackgroundColor({ color: color });
  setTimeout(() => {
    chrome.action.setBadgeText({ text: '' });
  }, 3000);
}

function showInPageNotification(tabId, title, message, type = 'error') {
  try {
    chrome.tabs.sendMessage(tabId, {
      type: 'SHOW_NOTIFICATION',
      title: title,
      message: message,
      notificationType: type
    });
  } catch (e) {
    console.error('[ContextFort] Failed to show in-page notification:', e);
  }
}

function showSystemNotification(title, message) {
  try {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: chrome.runtime.getURL('icon128.png'),
      title: title,
      message: message,
      priority: 2
    });
    console.log(`[ContextFort] System notification: ${title} - ${message}`);
  } catch (e) {
    console.error('[ContextFort] Failed to show system notification:', e);
  }
}

// Map to track pending login sessions
const pendingLogins = new Map(); // notificationId -> { domain, tabId, groupId }

function showLoginRequiredNotification(domain, tabId, groupId) {
  console.log(`[SessionIsolation] ████████████████████████████████████████`);
  console.log(`[SessionIsolation] 🔐 SHOWING LOGIN REQUIRED NOTIFICATION`);
  console.log(`[SessionIsolation] Domain: ${domain}, Tab: ${tabId}, Group: ${groupId}`);
  console.log(`[SessionIsolation] ████████████████████████████████████████`);

  const pendingId = `${domain}_${tabId}_${groupId}`;

  // Store pending login info
  pendingLogins.set(pendingId, { domain, tabId, groupId });
  console.log(`[SessionIsolation] Stored pending login with ID: ${pendingId}`);

  // Try to send notification with retries
  let retries = 0;
  const maxRetries = 5;

  const trySendNotification = () => {
    retries++;
    console.log(`[SessionIsolation] Attempting to send notification (attempt ${retries}/${maxRetries})...`);

    chrome.tabs.sendMessage(tabId, {
      type: 'SHOW_LOGIN_NOTIFICATION',
      domain: domain
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error(`[SessionIsolation] ❌ Attempt ${retries} failed:`, chrome.runtime.lastError.message);
        if (retries < maxRetries) {
          console.log(`[SessionIsolation] Retrying in 1 second...`);
          setTimeout(trySendNotification, 1000);
        } else {
          console.error('[SessionIsolation] ❌ All attempts failed. Showing system notification as fallback.');
          // Fallback to system notification
          showSystemNotification(
            '🔐 Manual Login Required',
            `No agent session for ${domain}. Login and use extension popup to save session.`
          );
        }
      } else {
        console.log(`[SessionIsolation] ✅ In-page login notification sent successfully`);
      }
    });
  };

  trySendNotification();
}

// Handle notification button clicks
chrome.notifications.onButtonClicked.addListener(async (notificationId, buttonIndex) => {
  console.log(`[SessionIsolation] ████████████████████████████████████████`);
  console.log(`[SessionIsolation] 🔘 NOTIFICATION BUTTON CLICKED`);
  console.log(`[SessionIsolation] Notification ID: ${notificationId}, Button Index: ${buttonIndex}`);

  const loginInfo = pendingLogins.get(notificationId);

  if (loginInfo) {
    const { domain, tabId, groupId } = loginInfo;
    console.log(`[SessionIsolation] Found pending login info - Domain: ${domain}, Tab: ${tabId}, Group: ${groupId}`);

    if (buttonIndex === 0) {
      // "I've Logged In" button clicked - Save current session as agent session
      console.log(`[SessionIsolation] ✅ User clicked "I've Logged In" for ${domain}`);
      console.log(`[SessionIsolation] Now capturing logged-in session as agent session...`);

      try {
        // Capture the now-logged-in session as agent session
        const agentSession = await captureFullSession(tabId, domain);
        const cookieCount = agentSession.cookies?.length || 0;
        const localStorageCount = Object.keys(agentSession.localStorage || {}).length;

        console.log(`[SessionIsolation] 📸 Captured agent session - ${cookieCount} cookies, ${localStorageCount} localStorage items`);

        await saveSessionProfile(domain, 'agent', agentSession);
        console.log(`[SessionIsolation] ✅ Saved logged-in session as agent profile for ${domain}`);

        // Mark domain as swapped
        const swappedDomains = swappedDomainsPerSession.get(groupId) || new Set();
        swappedDomains.add(domain);
        swappedDomainsPerSession.set(groupId, swappedDomains);
        console.log(`[SessionIsolation] Marked ${domain} as swapped for group ${groupId}`);

        // Show success notification
        showSystemNotification(
          '✅ Agent Session Saved',
          `Logged-in session for ${domain} saved.\n🍪 ${cookieCount} cookies\n📦 ${localStorageCount} localStorage items\n\nYou can now start the agent again - it will use this session.`
        );

        console.log(`[SessionIsolation] ████████████████████████████████████████`);
      } catch (error) {
        console.error('[SessionIsolation] ❌ Failed to save agent session:', error);
        showSystemNotification(
          '❌ Failed to Save Session',
          `Error: ${error.message}`
        );
      }
    } else if (buttonIndex === 1) {
      // "Restore My Session" button clicked - Restore human session
      console.log(`[SessionIsolation] 🔄 User clicked "Restore My Session" for ${domain}`);
      console.log(`[SessionIsolation] Restoring human session...`);

      try {
        // Load human session
        const humanSession = await loadSessionProfile(domain, 'human');

        if (humanSession) {
          const cookieCount = humanSession.cookies?.length || 0;
          console.log(`[SessionIsolation] Found human session - ${cookieCount} cookies`);

          // Clear current cookies
          await clearCookies(domain);
          await chrome.tabs.sendMessage(tabId, { type: 'CLEAR_STORAGE' });

          // Restore human session
          await restoreCookies(humanSession.cookies);
          await chrome.tabs.sendMessage(tabId, {
            type: 'RESTORE_STORAGE',
            data: {
              localStorage: humanSession.localStorage,
              sessionStorage: humanSession.sessionStorage
            }
          });

          // Reload the page
          await chrome.tabs.reload(tabId);

          console.log(`[SessionIsolation] ✅ Human session restored for ${domain}`);
          showSystemNotification(
            '👤 Your Session Restored',
            `Your original session for ${domain} has been restored.\n🍪 ${cookieCount} cookies restored`
          );
        } else {
          console.error('[SessionIsolation] ❌ No human session found for ${domain}');
          showSystemNotification(
            '❌ No Session Found',
            `No saved human session for ${domain}`
          );
        }

        console.log(`[SessionIsolation] ████████████████████████████████████████`);
      } catch (error) {
        console.error('[SessionIsolation] ❌ Failed to restore human session:', error);
        showSystemNotification(
          '❌ Failed to Restore Session',
          `Error: ${error.message}`
        );
      }
    }

    // Clear notification and pending login
    chrome.notifications.clear(notificationId);
    pendingLogins.delete(notificationId);
    console.log(`[SessionIsolation] Cleared notification and pending login for ${notificationId}`);
  } else {
    console.log(`[SessionIsolation] ⚠️ No pending login info found for notification ${notificationId}`);
  }
});

// Clean up notification when closed
chrome.notifications.onClosed.addListener((notificationId) => {
  pendingLogins.delete(notificationId);
});

function stopAgentTracking(tabId, groupId) {
  activeAgentTabs.delete(tabId);
  if (groupId) {
    trackAgentActivation(groupId, tabId, 'stop');
  }
}
// ============================================================================


// AUTH PAGE
// ============================================================================
function handleAuthMessages(message, sendResponse) {
  if (!ENABLE_AUTH) {
    // Auth is disabled - bypass auth check for isLoggedIn
    if (message.action === 'isLoggedIn') {
      sendResponse({ isLoggedIn: true }); // Bypass auth when disabled
      return true;
    }
    // Return error for other auth actions
    if (['login', 'verifyOTP', 'resendOTP', 'logout', 'identifyUser'].includes(message.action)) {
      sendResponse({ success: false, error: 'Authentication is disabled' });
      return true;
    }
    return false;
  }

  if (message.action === 'login') {
    loginWithEmail(message.email)
        .then(result => sendResponse(result))
        .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }

  if (message.action === 'verifyOTP') {
    verifyOTP(message.email, message.otpCode)
        .then(result => sendResponse(result))
        .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }

  if (message.action === 'resendOTP') {
    resendOTP(message.email)
        .then(result => sendResponse(result))
        .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }

  if (message.action === 'isLoggedIn') {
    isLoggedIn()
        .then(result => sendResponse({ isLoggedIn: result }))
        .catch(error => sendResponse({ isLoggedIn: false }));
    return true;
  }

  if (message.action === 'logout') {
    logout()
        .then(result => sendResponse(result))
        .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }

  if (message.action === 'identifyUser') {
    try {
        safeIdentifyUser(message.email, { email: message.email });
        safeTrackEvent('user_authenticated', { email: message.email });
        sendResponse({ success: true });
    } catch (error) {
        sendResponse({ success: false, error: error.message });
    }
    return true;
  }
}
// ============================================================================


// VISBILITY: SCREENSHOT EVENT HANDLING
// ============================================================================
const inputDebounceTimers = new Map();
const INPUT_DEBOUNCE_MS = 1000;

function onMessageScreenshotTrigger(message, tab) {
  let activation = activeAgentTabs.get(tab.id);

  if (!activation && tab.groupId && tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
    const session = sessions.get(tab.groupId);
    if (session && session.status === 'active') {
      activation = { sessionId: session.id, groupId: tab.groupId };
      activeAgentTabs.set(tab.id, activation);
    }
  }

  if (!activation) {
    return;
  }

  const saveEventData = async (dataUrl, isResult = false, urlOverride = null, titleOverride = null, actionId = null) => {
    const screenshotId = Date.now() + Math.random();
    const screenshotData = {
      id: screenshotId,
      sessionId: activation.sessionId,
      tabId: tab.id,
      url: urlOverride || message.url || tab.url,
      title: titleOverride || message.title || tab.title,
      reason: 'agent_event',
      timestamp: new Date().toISOString(),
      dataUrl: dataUrl,
      eventType: message.eventType || 'unknown',
      eventDetails: isResult ? {
        element: null,
        coordinates: null,
        inputValue: null,
        actionType: message.action + '_result',
        actionId: actionId
      } : {
        element: message.element || null,
        coordinates: message.coordinates || null,
        inputValue: message.inputValue || null,
        actionType: message.action
      }
    };

    const savedId = await queuedStorageWrite(screenshotData, activation);
    return savedId;
  };

  if (message.action === 'click') {
    chrome.tabs.get(tab.id, (currentTab) => {
      if (chrome.runtime.lastError || !currentTab) {
        return;
      }
      chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' }, (dataUrl1) => {
        if (chrome.runtime.lastError) {
          return;
        }
        saveEventData(dataUrl1, false, currentTab.url, currentTab.title, null).then(actionId => {
          setTimeout(() => {
            chrome.tabs.get(tab.id, (resultTab) => {
              if (chrome.runtime.lastError || !resultTab) {
                return;
              }
              chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' }, (dataUrl2) => {
                if (chrome.runtime.lastError) {
                  return;
                }
                saveEventData(dataUrl2, true, resultTab.url, resultTab.title, actionId);
              });
            });
          }, 300);
        });
      });
    });
  }

  else if (message.action === 'input') {
    let debounceState = inputDebounceTimers.get(tab.id);

    if (!debounceState) {
      debounceState = { timer: null, inputs: [], tabInfo: null };
      inputDebounceTimers.set(tab.id, debounceState);
    }

    if (debounceState.timer) {
      clearTimeout(debounceState.timer);
    }

    debounceState.inputs.push({
      element: message.element,
      inputValue: message.inputValue,
      timestamp: new Date().toISOString()
    });
    debounceState.timer = setTimeout(() => {
      const collectedInputs = debounceState.inputs;
      const inputValues = collectedInputs.map(i => i.inputValue);
      inputDebounceTimers.delete(tab.id);
      chrome.tabs.get(tab.id, (currentTab) => {
        if (chrome.runtime.lastError || !currentTab) {
          return;
        }
        setTimeout(() => {
          chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' }, (dataUrl) => {
            if (chrome.runtime.lastError) {
              return;
            }
            // Save with ALL input values
            const screenshotId = Date.now() + Math.random();
            const screenshotData = {
              id: screenshotId,
              sessionId: activation.sessionId,
              tabId: tab.id,
              url: currentTab.url,
              title: currentTab.title,
              reason: 'agent_event',
              timestamp: new Date().toISOString(),
              dataUrl: dataUrl,
              eventType: message.eventType || 'input',
              eventDetails: {
                element: null,
                coordinates: null,
                inputValue: null,
                inputValues: inputValues,  // Array of all input values
                actionType: 'input_result'
              }
            };
            queuedStorageWrite(screenshotData, activation)
          });
        }, 500);
      });
    }, INPUT_DEBOUNCE_MS);
  }
  else {
    chrome.tabs.get(tab.id, (currentTab) => {
      if (chrome.runtime.lastError || !currentTab) {
        return;
      }
      setTimeout(() => {
        chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' }, (dataUrl) => {
          if (chrome.runtime.lastError) {
            return;
          }
          saveEventData(dataUrl, true, currentTab.url, currentTab.title, null);
        });
      }, 500);
    });
  }

}
// ============================================================================




// ============================================================================
// CONTROLS: PAGE MIXING
function getHostname(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function matchesHostname(hostname, pattern) {
  if (pattern === "") return true;
  return hostname === pattern || hostname.endsWith('.' + pattern);
}

function shouldBlockNavigation(newUrl, visitedUrls) {
  const newHostname = getHostname(newUrl);
  if (!newHostname) return { blocked: false };
  for (const [domain1, domain2] of urlBlockingRules) {
    if (domain1 === "" && matchesHostname(newHostname, domain2) && visitedUrls.some(url => !matchesHostname(getHostname(url), domain2))) {
      return {
        blocked: true,
        reason: `Use of Agent mode is not allowed in ${newHostname}.`,
        conflictingUrl: null
      };
    }
  }

  for (const visitedUrl of visitedUrls) {
    const visitedHostname = getHostname(visitedUrl);
    if (!visitedHostname) continue;
    for (const [domain1, domain2] of urlBlockingRules) {
      if (domain2 === "" && matchesHostname(visitedHostname, domain1)) {
        return {
          blocked: true,
          reason: `Context from ${visitedHostname} cannot persist in other URLs. Please start a new chat.`,
          conflictingUrl: visitedUrl
        };
      }

      if (domain1 !== "" && domain2 !== "") {
        const match1 = matchesHostname(visitedHostname, domain1) &&
                       matchesHostname(newHostname, domain2);
        const match2 = matchesHostname(visitedHostname, domain2) &&
                       matchesHostname(newHostname, domain1);
        if (match1 || match2) {
          return {
            blocked: true,
            reason: `Navigation to ${newHostname} is blocked because context from ${visitedHostname} persists. Please start a new chat.`,
            conflictingUrl: visitedUrl
          };
        }
      }
    }
  }

  // Check URL pair blocking rules (for Context Mixing page)
  for (const visitedUrl of visitedUrls) {
    for (const [url1, url2] of urlPairBlockingRules) {
      // Compare full URLs
      const match1 = newUrl === url2 && visitedUrl === url1;
      const match2 = newUrl === url1 && visitedUrl === url2;
      if (match1 || match2) {
        const visitedHostname = getHostname(visitedUrl);
        const newHostname = getHostname(newUrl);
        return {
          blocked: true,
          reason: `Navigation to ${newHostname} is blocked because context from ${visitedHostname} persists. Please start a new chat.`,
          conflictingUrl: visitedUrl
        };
      }
    }
  }

  return { blocked: false };
}

chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (details.frameId !== 0) return;

  const tabId = details.tabId;
  const newUrl = details.url;
  const activation = activeAgentTabs.get(tabId);
  if (!activation) return;
  const session = sessions.get(activation.groupId);
  if (!session) return;

  const blockCheck = shouldBlockNavigation(newUrl, session.visitedUrls);

  if (blockCheck.blocked) {
    safeTrackEvent('navigation_blocked', {
      reason: blockCheck.reason.includes('not allowed') ? 'domain_blocked' : 'context_mixing'
    });
    sendStopAgentMessage(tabId);
    stopAgentTracking(tabId, activation.groupId);
    showBadgeNotification('⛔', '#FF0000');
    showInPageNotification(tabId, '⛔ Agent Mode Denied', blockCheck.reason, 'error');
    return;
  }

  // SESSION ISOLATION: Check if navigating to a new domain during agent mode
  try {
    const newHostname = new URL(newUrl).hostname;
    const newRootDomain = getRootDomain(newHostname);

    // Check if this domain has been swapped already in this session
    const swappedDomains = swappedDomainsPerSession.get(activation.groupId) || new Set();
    if (!swappedDomains.has(newRootDomain)) {
      console.log(`[SessionIsolation] Navigation to new domain: ${newRootDomain}`);
      console.log(`[SessionIsolation] Swapping session for new domain during agent mode`);

      // Swap this domain's session (skip reload since navigation is happening anyway)
      const swapResult = await swapToAgentSession(tabId, newRootDomain, activation.groupId, true);
      console.log(`[SessionIsolation] Cross-domain swap result:`, swapResult);

      if (swapResult.success) {
        safeTrackEvent('session_isolation_cross_domain', { domain: newRootDomain });
        // Note: notification is shown by swapToAgentSession
      }
    }
  } catch (e) {
    console.error('[SessionIsolation] Error during cross-domain swap:', e);
  }

  const tab = await chrome.tabs.get(tabId);
  await addPageReadAndVisitedUrl(session, tabId, newUrl, tab.title);
});


chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const newUrl = changeInfo.url;

    const activation = activeAgentTabs.get(tabId);
    if (!activation) {
      return;
    }

    const session = sessions.get(activation.groupId);
    if (!session) {
      return;
    }

    const blockCheck = shouldBlockNavigation(newUrl, session.visitedUrls);
    if (blockCheck.blocked) {
      safeTrackEvent('navigation_blocked', {
        reason: blockCheck.reason.includes('not allowed') ? 'domain_blocked' : 'context_mixing'
      });
      sendStopAgentMessage(tabId);
      stopAgentTracking(tabId, activation.groupId);
      showBadgeNotification('⛔', '#FF0000');
      showInPageNotification(tabId, '⛔ Agent Mode Denied', blockCheck.reason, 'error');
      return;
    }
    await addVisitedUrl(session, newUrl);
  }

  if (changeInfo.groupId) {
    for (const [groupId, session] of sessions.entries()) {
      if (session.status === 'active' && session.tabId === tabId && changeInfo.groupId !== groupId) {
        await endSession(groupId, 'tab_moved_to_different_group');
        break;
      }
    }



    const newGroupId = changeInfo.groupId;
    if (newGroupId === chrome.tabGroups.TAB_GROUP_ID_NONE) return;
    const session = sessions.get(newGroupId);


    // RESTRICTION TODO
    if (session && session.status === 'active') {
      const tabsInGroup = await chrome.tabs.query({ groupId: newGroupId });
      if (tabsInGroup.length > 1) {
        const tabsToUngroup = tabsInGroup.filter(t => t.id !== session.tabId);
        for (const tabToRemove of tabsToUngroup) {
          try {
            await chrome.tabs.ungroup(tabToRemove.id);
          } catch (err) {
          }
        }
      }
    }

    if (!session || !tab.url) return;
    let agentActive = false;
    let activeTabInGroup = null;
    for (const [activeTabId, activation] of activeAgentTabs.entries()) {
      if (activation.groupId === newGroupId) {
        agentActive = true;
        activeTabInGroup = activeTabId;
        break;
      }
    }
    if (!agentActive) return;
    const blockCheck = shouldBlockNavigation(tab.url, session.visitedUrls);

    if (blockCheck.blocked) {
      safeTrackEvent('navigation_blocked', {
        reason: blockCheck.reason.includes('not allowed') ? 'domain_blocked' : 'context_mixing'
      });
      if (activeTabInGroup) {
        sendStopAgentMessage(activeTabInGroup);
        stopAgentTracking(activeTabInGroup, newGroupId);
        showInPageNotification(activeTabInGroup, '⛔ Agent Mode Denied', blockCheck.reason, 'error');
      }
      showBadgeNotification('⛔', '#FF0000');
      return;
    }
    await addVisitedUrl(session, tab.url);
  }
});
// ============================================================================



// VISBILITY: NAVIGATIONS & PAGE READS
// ============================================================================
async function addVisitedUrl(session, newUrl) {
  if (!session.visitedUrls.includes(newUrl)) {
    session.visitedUrls.push(newUrl);
    const result = await chrome.storage.local.get(['sessions']);
    const allSessions = result.sessions || [];
    const index = allSessions.findIndex(s => s.id === session.id);
    if (index !== -1) {
      allSessions[index].visitedUrls = session.visitedUrls;
      await chrome.storage.local.set({ sessions: allSessions });
    }
  }
}

async function addPageReadAndVisitedUrl(session, tabId, url, title) {
  await addVisitedUrl(session, url);

  const pageReadData = {
    id: Date.now() + Math.random(),
    sessionId: session.id,
    tabId: tabId,
    url: url,
    title: title,
    reason: 'page_read',
    timestamp: new Date().toISOString(),
    dataUrl: null,
    eventType: 'page_read',
    eventDetails: {
      element: null,
      coordinates: null,
      inputValue: null,
      actionType: 'page_read'
    }
  };

  const activation = {
    sessionId: session.id,
    groupId: session.groupId
  };

  await queuedStorageWrite(pageReadData, activation);
}
// ============================================================================