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
  console.log('[ContextFort for Comet] 🚀 Extension installed/updated:', details.reason, 'version:', chrome.runtime.getManifest().version);
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

console.log('[ContextFort for Comet] 🟢 Background script started, version:', chrome.runtime.getManifest().version);
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
// DEBUGGER-BASED AGENT DETECTION (works in Comet browser)
// ============================================================================
const debuggerDetectedTabs = new Set();
const tabToGroupMap = new Map(); // Track which groups we created for tabs
const DEBUGGER_POLL_INTERVAL = 1000; // Check every 1 second

async function ensureTabGroup(tab) {
  // If tab already in a group, just update the title
  if (tab.groupId && tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
    try {
      await chrome.tabGroups.update(tab.groupId, { title: '⏳ Comet', color: 'cyan' });
      tabToGroupMap.set(tab.id, tab.groupId);
      console.log('[ContextFort for Comet] 📁 Updated existing group:', tab.groupId);
    } catch (e) {
      console.log('[ContextFort for Comet] ⚠️ Could not update group title:', e.message);
    }
    return tab.groupId;
  }

  // Create new tab group
  try {
    const groupId = await chrome.tabs.group({ tabIds: [tab.id] });
    await chrome.tabGroups.update(groupId, { title: '⏳ Comet', color: 'cyan' });
    tabToGroupMap.set(tab.id, groupId);
    console.log('[ContextFort for Comet] 📁 Created tab group:', groupId, 'for tab:', tab.id);
    return groupId;
  } catch (e) {
    console.log('[ContextFort for Comet] ⚠️ Could not create tab group:', e.message);
    return null;
  }
}

async function markGroupComplete(tabId) {
  const groupId = tabToGroupMap.get(tabId);
  if (groupId) {
    try {
      await chrome.tabGroups.update(groupId, { title: '✅ Comet', color: 'green' });
      console.log('[ContextFort for Comet] ✅ Marked group complete:', groupId);
    } catch (e) {
      console.log('[ContextFort for Comet] ⚠️ Could not update group to complete:', e.message);
    }
  }
}

async function pollDebuggerTargets() {
  try {
    const targets = await chrome.debugger.getTargets();
    const currentAttachedTabs = new Set();

    for (const target of targets) {
      if (target.tabId && target.attached && target.type === 'page') {
        currentAttachedTabs.add(target.tabId);

        // New debugger detected on this tab
        if (!debuggerDetectedTabs.has(target.tabId)) {
          debuggerDetectedTabs.add(target.tabId);
          console.log('[ContextFort for Comet] 🔍 DEBUGGER DETECTED on tab:', target.tabId, 'url:', target.url);

          // Get tab info, create/update group, and trigger agent detection
          try {
            const tab = await chrome.tabs.get(target.tabId);
            if (tab) {
              const groupId = await ensureTabGroup(tab);
              if (groupId) {
                // Re-fetch tab to get updated groupId
                const updatedTab = await chrome.tabs.get(target.tabId);
                console.log('[ContextFort for Comet] 🟢 AGENT SESSION via debugger - tab:', updatedTab.id, 'groupId:', groupId);
                onMessageAgentDetected(updatedTab, groupId);
                // Tell content script to start listening for clicks
                chrome.tabs.sendMessage(target.tabId, { type: 'START_LISTENING' }).catch(() => {});
              }
            }
          } catch (e) {
            console.log('[ContextFort for Comet] ⚠️ Could not get tab info:', e.message);
          }
        }
      }
    }

    // Check for tabs where debugger was removed (agent stopped)
    for (const tabId of debuggerDetectedTabs) {
      if (!currentAttachedTabs.has(tabId)) {
        debuggerDetectedTabs.delete(tabId);
        console.log('[ContextFort for Comet] 🔴 DEBUGGER REMOVED from tab:', tabId);

        // Mark group as complete and trigger agent stopped
        await markGroupComplete(tabId);

        try {
          const tab = await chrome.tabs.get(tabId);
          if (tab) {
            console.log('[ContextFort for Comet] 🔴 AGENT STOPPED via debugger - tab:', tab.id);
            onMessageAgentStopped(tab, tab.groupId);
            // Tell content script to stop listening
            chrome.tabs.sendMessage(tabId, { type: 'STOP_LISTENING' }).catch(() => {});
          }
        } catch (e) {
          // Tab might be closed, clean up
          console.log('[ContextFort for Comet] ℹ️ Tab no longer exists:', tabId);
          tabToGroupMap.delete(tabId);
        }
      }
    }
  } catch (e) {
    // debugger API might not be available or permission denied
    console.log('[ContextFort for Comet] ⚠️ Debugger poll error:', e.message);
  }
}

// Start polling for debugger targets
setInterval(pollDebuggerTargets, DEBUGGER_POLL_INTERVAL);
console.log('[ContextFort for Comet] 🔍 Debugger polling started (interval:', DEBUGGER_POLL_INTERVAL, 'ms)');
// ============================================================================

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const tab = sender.tab;
  const groupId = tab?.groupId;

  console.log('[ContextFort for Comet] 📩 MESSAGE received:', message.type, {
    tabId: tab?.id,
    groupId: groupId,
    url: tab?.url?.substring(0, 50)
  });

  if (message.type === 'AGENT_DETECTED') {
    console.log('[ContextFort for Comet] 🟢 AGENT_DETECTED from tab:', tab?.id, 'groupId:', groupId, 'url:', tab?.url);
    return onMessageAgentDetected(tab, groupId);
  }

  else if (message.type === 'AGENT_STOPPED') {
    console.log('[ContextFort for Comet] 🔴 AGENT_STOPPED from tab:', tab?.id, 'groupId:', groupId);
    return onMessageAgentStopped(tab, groupId);
  }

  else if (message.type === 'ACTION_BLOCKED') {
    console.log('[ContextFort for Comet] ⛔ ACTION_BLOCKED:', message.actionType, 'url:', message.url);
    return onMessageAgentBlocked(message, tab);
  }

  else if (message.type === 'SCREENSHOT_TRIGGER') {
    console.log('[ContextFort for Comet] 📸 SCREENSHOT_TRIGGER action:', message.action, 'element:', message.element);
    return onMessageScreenshotTrigger(message, tab);
  }

  else if (message.type === 'RELOAD_BLOCKING_RULES') {
    console.log('[ContextFort for Comet] 🔄 RELOAD_BLOCKING_RULES count:', (message.rules || []).length);
    urlBlockingRules = message.rules || [];
    safeTrackEvent('domain_blocking_rules_updated', {
      ruleCount: urlBlockingRules.length
    });
    return;
  }

  else if (message.type === 'RELOAD_URL_PAIR_RULES') {
    console.log('[ContextFort for Comet] 🔄 RELOAD_URL_PAIR_RULES count:', (message.rules || []).length);
    urlPairBlockingRules = message.rules || [];
    safeTrackEvent('url_pair_blocking_rules_updated', {
      ruleCount: urlPairBlockingRules.length
    });
    return;
  }

  else if (message.type === 'RELOAD_BLOCKED_ACTIONS') {
    console.log('[ContextFort for Comet] 🔄 RELOAD_BLOCKED_ACTIONS count:', (message.actions || []).length);
    blockedActions = message.actions || [];
    safeTrackEvent('action_blocking_rules_updated', {
      blockedActionCount: blockedActions.length
    });
    return;
  }

  else if (message.type === 'RELOAD_GOVERNANCE_RULES') {
    console.log('[ContextFort for Comet] 🔄 RELOAD_GOVERNANCE_RULES:', message.rules);
    governanceRules = message.rules || {};
    safeTrackEvent('governance_rules_updated', {
      disallowClickableUrls: governanceRules.disallow_clickable_urls || false,
      disallowQueryParams: governanceRules.disallow_query_params || false
    });
    updateDNRRules();
    return;
  }

  else {
    console.log('[ContextFort for Comet] 📩 Auth/other message:', message.action);
    return handleAuthMessages(message, sendResponse);
  }

});


(async () => {
  console.log('[ContextFort for Comet] 🔄 Loading storage data...');
  const result = await chrome.storage.local.get(['urlBlockingRules', 'urlPairBlockingRules', 'blockedActions', 'governanceRules', 'sessions']);

  if (result.urlBlockingRules) {
    urlBlockingRules = result.urlBlockingRules;
    console.log('[ContextFort for Comet] 📋 Loaded URL blocking rules:', urlBlockingRules.length);
  }

  if (result.urlPairBlockingRules) {
    urlPairBlockingRules = result.urlPairBlockingRules;
    console.log('[ContextFort for Comet] 📋 Loaded URL pair rules:', urlPairBlockingRules.length);
  }

  if (result.blockedActions) {
    blockedActions = result.blockedActions;
    console.log('[ContextFort for Comet] 📋 Loaded blocked actions:', blockedActions.length);
  }

  if (result.governanceRules) {
    governanceRules = result.governanceRules;
    console.log('[ContextFort for Comet] 📋 Loaded governance rules:', governanceRules);
    await updateDNRRules();
  }

  const allSessions = result.sessions || [];
  console.log('[ContextFort for Comet] 📋 Loaded sessions:', allSessions.length);
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
      console.error('[ContextFort for Comet] ❌ Storage write failed:', error);
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
  console.log('[ContextFort for Comet] 🔧 UPDATING DNR RULES:', governanceRules);
  try {
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const existingRuleIds = new Set(existingRules.map(r => r.id));
    console.log('[ContextFort for Comet] 📋 Existing DNR rule IDs:', Array.from(existingRuleIds));

    const rulesToAdd = [];
    const ruleIdsToRemove = [];

    if (governanceRules.disallow_clickable_urls) {
      if (!existingRuleIds.has(DNR_RULE_IDS.DISALLOW_CLICKABLE_URLS)) {
        rulesToAdd.push({
          id: DNR_RULE_IDS.DISALLOW_CLICKABLE_URLS,
          priority: 1,
          action: { type: "block" },
          condition: {
            initiatorDomains: ["npclhjbddhklpbnacpjloidibaggcgon"],
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
            initiatorDomains: ["npclhjbddhklpbnacpjloidibaggcgon"],
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
    console.log('[ContextFort for Comet] 📋 SESSION exists for groupId:', groupId);
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

  console.log('[ContextFort for Comet] 🆕 SESSION CREATED:', {
    sessionId: sessionId,
    groupId: groupId,
    tabId: firstTabId,
    url: firstTabUrl
  });

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
    console.log('[ContextFort for Comet] ⚠️ endSession called but no session for groupId:', groupId);
    return;
  }

  console.log('[ContextFort for Comet] 🔚 SESSION ENDING:', {
    sessionId: session.id,
    groupId: groupId,
    reason: reason,
    visitedUrls: session.visitedUrls?.length || 0
  });

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
  console.log('[ContextFort for Comet] 🗑️ TAB GROUP REMOVED:', groupId);
  await endSession(groupId, 'tab_group_removed');
});
// ============================================================================




// VISIBILITY: TRACK AGENT MODES
// ============================================================================
function trackAgentActivation(groupId, tabId, action) {
  const session = sessions.get(groupId);
  if (!session) {
    console.log('[ContextFort for Comet] ⚠️ trackAgentActivation: no session for groupId:', groupId);
    return;
  }

  console.log('[ContextFort for Comet] 🎯 AGENT ACTIVATION:', action, {
    tabId: tabId,
    groupId: groupId,
    sessionId: session.id
  });

  if (action === 'start') {
    activeAgentTabs.set(tabId, {
      sessionId: session.id,
      groupId: groupId
    });
    console.log('[ContextFort for Comet] 📊 Active agent tabs count:', activeAgentTabs.size);
  } else if (action === 'stop') {
    activeAgentTabs.delete(tabId);
    console.log('[ContextFort for Comet] 📊 Active agent tabs count:', activeAgentTabs.size);
  }
}

chrome.tabs.onRemoved.addListener(async (tabId) => {
  console.log('[ContextFort for Comet] 🗑️ TAB REMOVED:', tabId);
  activeAgentTabs.delete(tabId);
  for (const [groupId, session] of sessions.entries()) {
    if (session.status === 'active' && session.tabId === tabId) {
      console.log('[ContextFort for Comet] 🔚 Session tab closed, ending session:', session.id);
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
      trackAgentActivation(groupId, tab.id, 'start');
      await addPageReadAndVisitedUrl(session, tab.id, tab.url, tab.title);
    });
  }
}

function onMessageAgentStopped(tab, groupId) {
  safeTrackEvent('AGENT_STOPPED', {agentMode: 'stopped'});
  if (groupId) {
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
  console.log('[ContextFort for Comet] 🛑 SENDING STOP AGENT to tabId:', tabId);
  try {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => {
        const clickStopButton = () => {
          console.log('[ContextFort for Comet] 🛑 Looking for stop button: pplx-agent-0_0-overlay-stop-button');
          const stopButton = document.getElementById('pplx-agent-0_0-overlay-stop-button');
          if (stopButton) {
            console.log('[ContextFort for Comet] ✅ Stop button found, clicking...');
            const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window });
            const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window });
            const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });

            stopButton.dispatchEvent(mouseDownEvent);
            stopButton.dispatchEvent(mouseUpEvent);
            stopButton.dispatchEvent(clickEvent);
            stopButton.click();
            return true;
          }
          return false;
        };

        // Try clicking immediately
        if (clickStopButton()) {
          return;
        }

        let retries = 0;
        const maxRetries = 3;
        const retryInterval = setInterval(() => {
          retries++;
          if (clickStopButton()) {
            clearInterval(retryInterval);
          } else if (retries >= maxRetries) {
            clearInterval(retryInterval);
            console.error('[ContextFort for Comet] Stop button not found after', maxRetries, 'retries');
          }
        }, 200);
      }
    });
  } catch (e) {
    console.error('[ContextFort for Comet] Failed to stop agent:', e);
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
    console.error('[ContextFort for Comet] Failed to show in-page notification:', e);
  }
}

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
  console.log('[ContextFort for Comet] 📸 SCREENSHOT TRIGGER processing:', {
    action: message.action,
    tabId: tab.id,
    url: message.url?.substring(0, 50)
  });

  let activation = activeAgentTabs.get(tab.id);

  if (!activation && tab.groupId && tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
    const session = sessions.get(tab.groupId);
    if (session && session.status === 'active') {
      console.log('[ContextFort for Comet] 📸 Creating activation for groupId:', tab.groupId);
      activation = { sessionId: session.id, groupId: tab.groupId };
      activeAgentTabs.set(tab.id, activation);
    }
  }

  if (!activation) {
    console.log('[ContextFort for Comet] ⚠️ No activation for screenshot, skipping');
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
  console.log('[ContextFort for Comet] 🌐 NAVIGATION onBeforeNavigate:', {
    tabId: tabId,
    url: newUrl.substring(0, 80)
  });

  const activation = activeAgentTabs.get(tabId);
  if (!activation) {
    console.log('[ContextFort for Comet] ℹ️ No active agent for tab, allowing navigation');
    return;
  }
  const session = sessions.get(activation.groupId);
  if (!session) {
    console.log('[ContextFort for Comet] ℹ️ No session for groupId:', activation.groupId);
    return;
  }

  console.log('[ContextFort for Comet] 🔍 Checking navigation block:', {
    newUrl: newUrl.substring(0, 50),
    visitedUrls: session.visitedUrls?.length || 0
  });

  const blockCheck = shouldBlockNavigation(newUrl, session.visitedUrls);

  if (blockCheck.blocked) {
    console.log('[ContextFort for Comet] ⛔ NAVIGATION BLOCKED:', blockCheck.reason);
    safeTrackEvent('navigation_blocked', {
      reason: blockCheck.reason.includes('not allowed') ? 'domain_blocked' : 'context_mixing'
    });
    sendStopAgentMessage(tabId);
    stopAgentTracking(tabId, activation.groupId);
    showBadgeNotification('⛔', '#FF0000');
    showInPageNotification(tabId, '⛔ Agent Mode Denied', blockCheck.reason, 'error');
    return;
  }

  const tab = await chrome.tabs.get(tabId);
  await addPageReadAndVisitedUrl(session, tabId, newUrl, tab.title);
});


chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const newUrl = changeInfo.url;
    console.log('[ContextFort for Comet] 🔄 TAB URL CHANGED:', {
      tabId: tabId,
      newUrl: newUrl.substring(0, 80)
    });

    const activation = activeAgentTabs.get(tabId);
    if (!activation) {
      console.log('[ContextFort for Comet] ℹ️ No active agent for updated tab');
      return;
    }

    const session = sessions.get(activation.groupId);
    if (!session) {
      console.log('[ContextFort for Comet] ℹ️ No session for groupId:', activation.groupId);
      return;
    }

    const blockCheck = shouldBlockNavigation(newUrl, session.visitedUrls);
    if (blockCheck.blocked) {
      console.log('[ContextFort for Comet] ⛔ URL CHANGE BLOCKED:', blockCheck.reason);
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
    console.log('[ContextFort for Comet] 📁 TAB GROUP CHANGED:', {
      tabId: tabId,
      newGroupId: changeInfo.groupId
    });
    for (const [groupId, session] of sessions.entries()) {
      if (session.status === 'active' && session.tabId === tabId && changeInfo.groupId !== groupId) {
        console.log('[ContextFort for Comet] 🔚 Tab moved to different group, ending session');
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
    console.log('[ContextFort for Comet] 📝 ADDING VISITED URL:', newUrl.substring(0, 80));
    session.visitedUrls.push(newUrl);
    console.log('[ContextFort for Comet] 📊 Total visited URLs:', session.visitedUrls.length);
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