// background.js
import { initPostHog, trackEvent, identifyUser } from './posthog-config.js';
import { loginWithEmail, verifyOTP, resendOTP, getCurrentUser, isLoggedIn, logout} from './auth.js';

let currentUser = '';
chrome.storage.local.get('userData', (result) => {
  currentUser = result.userData?.email || '';
});

// Initialize PostHog when extension starts
initPostHog();
identifyUser(currentUser, {email:currentUser});
// Track extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    trackEvent('extension_installed', {
      version: chrome.runtime.getManifest().version
    });
  } else if (details.reason === 'update') {
    trackEvent('extension_updated', {
      version: chrome.runtime.getManifest().version,
      previousVersion: details.previousVersion
    });
  }
});

// Track extension startup
trackEvent('extension_started', {
  version: chrome.runtime.getManifest().version
});

const sessions = new Map(); // groupId -> session object
const activeAgentTabs = new Map(); // tabId -> { sessionId, groupId }
let urlBlockingRules = []; // Loaded from storage, managed via dashboard
let blockedActions = []; // Loaded from storage, managed via dashboard

// Load URL blocking rules, blocked actions, and restore active sessions on startup
(async () => {
  const result = await chrome.storage.local.get(['urlBlockingRules', 'blockedActions', 'sessions']);

  // Restore URL blocking rules
  if (result.urlBlockingRules) {
    urlBlockingRules = result.urlBlockingRules;
  }

  // Restore blocked actions
  if (result.blockedActions) {
    blockedActions = result.blockedActions;
  }

  // Restore active sessions to in-memory Map
  const allSessions = result.sessions || [];
  for (const session of allSessions) {
    if (session.status === 'active') {
      sessions.set(session.groupId, session);
    }
  }
})();

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('dashboard/visibility/index.html')
  });
});

// ============================================================================
// ALL ABOUT SESSIONS
async function getOrCreateSession(groupId, firstTabId, firstTabUrl, firstTabTitle) {
  if (sessions.has(groupId)) {
    return sessions.get(groupId);
  }

  const sessionId = Date.now();
  const session = {
    id: sessionId,                              // Unique session identifier
    groupId: groupId,                           // Chrome tab group ID
    startTime: new Date().toISOString(),        // ISO 8601 timestamp
    endTime: null,                              // Set when session ends
    duration: null,                             // Calculated on end (seconds)
    tabId: firstTabId,                          // First/main tab in group
    tabTitle: firstTabTitle || 'Unknown',       // Page title
    tabUrl: firstTabUrl || 'Unknown',           // Page URL
    screenshotCount: 0,                         // Incremented on each screenshot
    status: 'active',                           // 'active' or 'ended'
    visitedUrls: []                             // Track all URLs visited in this session
  };

  sessions.set(groupId, session);
  const result = await chrome.storage.local.get(['sessions']);
  const allSessions = result.sessions || [];
  allSessions.unshift(session); // Add to beginning of array
  await chrome.storage.local.set({ sessions: allSessions });

  // Enforce single-tab group - remove any other tabs already in this group
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

async function endSession(groupId) {
  const session = sessions.get(groupId);
  if (!session) return;

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
  sessions.delete(groupId);
}

chrome.tabGroups.onRemoved.addListener(async (groupId) => {
  await endSession(groupId);
});

// Detect when green checkmark emoji is removed from tab group title (indicates clear chat)
const groupTitles = new Map(); // Track previous titles: groupId -> title

chrome.tabGroups.onUpdated.addListener(async (group) => {
  // Check if this group has an active session
  const session = sessions.get(group.id);
  if (!session || session.status !== 'active') {
    groupTitles.set(group.id, group.title); // Update title cache even if no session
    return;
  }

  const previousTitle = groupTitles.get(group.id);
  const currentTitle = group.title;

  // Check if ✅ was removed (clear chat happened)
  const hadCheckmark = previousTitle && previousTitle.includes('✅');
  const hasCheckmark = currentTitle && currentTitle.includes('✅');

  if (hadCheckmark && !hasCheckmark) {
    // Find the active tab in this group and end its session
    for (const [tabId, activation] of activeAgentTabs.entries()) {
      if (activation.groupId === group.id) {
        trackAgentActivation(group.id, tabId, 'stop');
      }
    }
  }

  // Update title cache
  groupTitles.set(group.id, currentTitle);
});
// ============================================================================




// ============================================================================
// ALL ABOUT ACTIVE AGENT TABS
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

  // Check if this was the main agent tab - end the session
  for (const [groupId, session] of sessions.entries()) {
    if (session.status === 'active' && session.tabId === tabId) {
      await endSession(groupId);
      break;
    }
  }
});

// Enforce single-tab groups - remove any additional tabs added to agent groups
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.groupId !== undefined) {
    // Check if this tab is the main agent tab leaving its group
    for (const [groupId, session] of sessions.entries()) {
      if (session.status === 'active' && session.tabId === tabId && changeInfo.groupId !== groupId) {
        // Main agent tab left its group - end the session
        await endSession(groupId);
        break;
      }
    }

    // Check if a tab is joining an active agent group
    if (changeInfo.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
      const session = sessions.get(changeInfo.groupId);
      if (session && session.status === 'active') {
        // This is an agent group, check if there are multiple tabs
        const tabsInGroup = await chrome.tabs.query({ groupId: changeInfo.groupId });
        if (tabsInGroup.length > 1) {
          // Ungroup all tabs except the original agent tab
          const tabsToUngroup = tabsInGroup.filter(t => t.id !== session.tabId);
          for (const tabToRemove of tabsToUngroup) {
            try {
              await chrome.tabs.ungroup(tabToRemove.id);
            } catch (err) {
            }
          }
        }
      }
    }
  }
});
// ============================================================================




// ============================================================================
// MESSAGE LISTENERS
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  const tab = sender.tab;
  const groupId = tab?.groupId;

  if (message.type === 'AGENT_DETECTED') {
    trackEvent('AGENT_DETECTED', {agentMode: 'started'});
    if (groupId && groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
      const session = await getOrCreateSession(groupId, tab.id, tab.url, tab.title);
      // Check if this URL should be blocked before allowing agent mode to activate
      const blockCheck = shouldBlockNavigation(tab.url, session.visitedUrls);
      if (blockCheck.blocked) {
        // Stop agent mode, show notification, don't activate
        sendStopAgentMessage(tab.id);
        showBlockNotification(blockCheck, tab.url);
        return; // Don't activate agent mode on blocked URL
      }

      trackAgentActivation(groupId, tab.id, 'start');

      // Add page_read entry and update visitedUrls
      await addPageReadAndVisitedUrl(session, tab.id, tab.url, tab.title);
    }
  }

  else if (message.type === 'AGENT_STOPPED') {
    trackEvent('AGENT_STOPPED', {agentMode: 'stopped'});
    if (groupId) {
      trackAgentActivation(groupId, tab.id, 'stop');
    }
  }

  // Content script triggered screenshot capture
  if (message.type === 'SCREENSHOT_TRIGGER') {
    let activation = activeAgentTabs.get(tab.id);

    // If not in activeAgentTabs (service worker restarted), reconstruct from session
    if (!activation && tab.groupId && tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
      const session = sessions.get(tab.groupId);
      if (session && session.status === 'active') {
        // Reconstruct activeAgentTabs entry
        activation = { sessionId: session.id, groupId: tab.groupId };
        activeAgentTabs.set(tab.id, activation);
      }
    }

    if (!activation) {
      return;
    }

    // Helper function to save event data
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
        dataUrl: dataUrl,  // null for action, screenshot for result
        eventType: message.eventType || 'unknown',
        eventDetails: isResult ? {
          // Result entries only have actionType and link back to action
          element: null,
          coordinates: null,
          inputValue: null,
          actionType: message.action + '_result',
          actionId: actionId  // Links back to the action entry
        } : {
          // Action entries have full details
          element: message.element || null,
          coordinates: message.coordinates || null,
          inputValue: message.inputValue || null,
          actionType: message.action
        }
      };

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
        if (sessions.get(groupId)) {
          sessions.get(groupId).screenshotCount = allSessions[sessionIndex].screenshotCount;
        }
      }

      await chrome.storage.local.set({ screenshots: screenshots, sessions: allSessions });

      return screenshotId;  // Return the ID so result can link back
    };

    // Step 1: Immediately save the action with null screenshot
    const actionId = await saveEventData(null, false);

    // If tab is not active, we're done (only action saved, no result)
    if (!tab.active) {
      return;
    }

    // Step 2: Tab is active, capture screenshot and save as result
    chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' }, async (dataUrl) => {
      if (chrome.runtime.lastError) {
        return;
      }

      // Get fresh tab info at screenshot time to capture current URL/title
      const currentTab = await chrome.tabs.get(tab.id);
      // Screenshot succeeded, save result with current page's URL/title and link to action
      await saveEventData(dataUrl, true, currentTab.url, currentTab.title, actionId);
    });
  }

  // Dashboard requested to reload blocking rules
  if (message.type === 'RELOAD_BLOCKING_RULES') {
    urlBlockingRules = message.rules || [];
  }

  // Dashboard requested to reload blocked actions
  if (message.type === 'RELOAD_BLOCKED_ACTIONS') {
    blockedActions = message.actions || [];
  }

  if (message.action === 'login') {
        loginWithEmail(message.email)
            .then(result => sendResponse(result))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Keep channel open for async response
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
});
// ============================================================================






// ============================================================================
// URL BLOCKING LOGIC
function getHostname(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

// Check if navigation should be blocked based on rules
function shouldBlockNavigation(newUrl, visitedUrls) {
  const newHostname = getHostname(newUrl);
  if (!newHostname) return { blocked: false };

  // Check each visited URL against blocking rules
  for (const visitedUrl of visitedUrls) {
    const visitedHostname = getHostname(visitedUrl);
    if (!visitedHostname) continue;

    // Check if these two domains are in blocking rules
    for (const [domain1, domain2] of urlBlockingRules) {
      // More precise hostname matching (exact match or subdomain)
      const match1 = (visitedHostname === domain1 || visitedHostname.endsWith('.' + domain1)) &&
                     (newHostname === domain2 || newHostname.endsWith('.' + domain2));
      const match2 = (visitedHostname === domain2 || visitedHostname.endsWith('.' + domain2)) &&
                     (newHostname === domain1 || newHostname.endsWith('.' + domain1));

      if (match1 || match2) {
        return {
          blocked: true,
          reason: `Cannot navigate to ${newHostname} because ${visitedHostname} was already visited in this session`,
          conflictingUrl: visitedUrl
        };
      }
    }
  }

  return { blocked: false };
}

// Helper function to update visitedUrls in session
async function addVisitedUrl(session, newUrl) {
  if (!session.visitedUrls.includes(newUrl)) {
    session.visitedUrls.push(newUrl);

    // Update in storage
    const result = await chrome.storage.local.get(['sessions']);
    const allSessions = result.sessions || [];
    const index = allSessions.findIndex(s => s.id === session.id);
    if (index !== -1) {
      allSessions[index].visitedUrls = session.visitedUrls;
      await chrome.storage.local.set({ sessions: allSessions });
    }
  }
}

// Helper function to add page_read entry and update visitedUrls
async function addPageReadAndVisitedUrl(session, tabId, url, title) {
  // Add to visitedUrls
  await addVisitedUrl(session, url);

  // Get tab info for window ID
  const tab = await chrome.tabs.get(tabId);

  // Helper to save page_read data
  const savePageReadData = async (dataUrl) => {
    const result = await chrome.storage.local.get(['screenshots']);
    const screenshots = result.screenshots || [];

    const pageReadData = {
      id: Date.now() + Math.random(),
      sessionId: session.id,
      tabId: tabId,
      url: url,
      title: title,
      reason: 'page_read',
      timestamp: new Date().toISOString(),
      dataUrl: dataUrl,  // null if tab not active
      eventType: 'page_read',
      eventDetails: {
        element: null,
        coordinates: null,
        inputValue: null,
        actionType: 'page_read'
      }
    };

    screenshots.push(pageReadData);

    if (screenshots.length > 100) {
      screenshots.shift();
    }

    await chrome.storage.local.set({ screenshots: screenshots });
  };

  // If tab is not active, save without screenshot
  if (!tab.active) {
    await savePageReadData(null);
    return;
  }

  // Tab is active, capture screenshot
  chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' }, async (dataUrl) => {
    if (chrome.runtime.lastError) {
      return;  // Don't save page_read if screenshot fails
    }

    await savePageReadData(dataUrl);
  });
}

// Helper function to show notification when navigation is blocked
function showBlockNotification(blockCheck, newUrl) {
  const newHostname = getHostname(newUrl);
  const conflictingHostname = getHostname(blockCheck.conflictingUrl);

  chrome.notifications.create({
    type: 'basic',
    title: '⛔ Agent Mode Denied',
    message: `Cannot navigate to ${newHostname} because ${conflictingHostname} was already visited in this session.`,
    priority: 2
  });
}

// Helper function to send STOP_AGENT message to Claude extension
function sendStopAgentMessage(tabId) {
  try {
    chrome.runtime.sendMessage({
      type: 'STOP_AGENT',
      targetTabId: tabId
    });
  } catch (e) {
    // Claude extension might not be available
  }
}

// Helper function to stop tracking agent on a tab
function stopAgentTracking(tabId, groupId) {
  activeAgentTabs.delete(tabId);
  if (groupId) {
    trackAgentActivation(groupId, tabId, 'stop');
  }
}

// Get session for a tab (checks if tab is in an agent session)
async function getSessionForTab(tabId) {
  const tab = await chrome.tabs.get(tabId);
  const groupId = tab.groupId;

  if (!groupId || groupId === chrome.tabGroups.TAB_GROUP_ID_NONE) {
    return null;
  }

  return sessions.get(groupId);
}

// ============================================================================
// 1. SAME-TAB NAVIGATION (webNavigation.onBeforeNavigate)
// ============================================================================

// Track URL navigation when agent mode is active
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  // Only track main frame navigations (not iframes)
  if (details.frameId !== 0) return;

  const tabId = details.tabId;
  const newUrl = details.url;

  // Check if this tab has active agent mode
  const activation = activeAgentTabs.get(tabId);
  if (!activation) return;

  // Get the session for this tab
  const session = sessions.get(activation.groupId);
  if (!session) return;

  const blockCheck = shouldBlockNavigation(newUrl, session.visitedUrls);

  if (blockCheck.blocked) {
    // Let navigation happen, stop agent mode, show notification
    sendStopAgentMessage(tabId);
    stopAgentTracking(tabId, activation.groupId);
    showBlockNotification(blockCheck, newUrl);
    return;
  }

  // Get tab to retrieve title
  const tab = await chrome.tabs.get(tabId);
  await addPageReadAndVisitedUrl(session, tabId, newUrl, tab.title);
});

// ============================================================================
// 2. TAB UPDATES (chrome.tabs.update with URL or group changes)
// ============================================================================

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Handle URL changes
  if (changeInfo.url) {
    const newUrl = changeInfo.url;

    // Check if agent mode is ACTIVELY running on this tab
    const activation = activeAgentTabs.get(tabId);
    if (!activation) return;

    const session = sessions.get(activation.groupId);
    if (!session) return;
    const blockCheck = shouldBlockNavigation(newUrl, session.visitedUrls);

    if (blockCheck.blocked) {
      // Allow URL update, stop agent mode, show notification
      sendStopAgentMessage(tabId);
      stopAgentTracking(tabId, activation.groupId);
      showBlockNotification(blockCheck, newUrl);
      return;
    }

    // Navigation allowed - add to visited URLs (no page_read on navigation)
    await addVisitedUrl(session, newUrl);
  }

  // Handle group changes (tab moved to agent group)
  if (changeInfo.groupId) {
    const newGroupId = changeInfo.groupId;

    // Skip if tab left a group (became ungrouped)
    if (newGroupId === chrome.tabGroups.TAB_GROUP_ID_NONE) return;

    // Check if there's an active agent session in this group
    const session = sessions.get(newGroupId);
    if (!session || !tab.url) return;

    // Check if agent mode is ACTIVELY running in ANY tab in this group
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
    // Check if this tab's URL conflicts with session rules
    const blockCheck = shouldBlockNavigation(tab.url, session.visitedUrls);

    if (blockCheck.blocked) {
      // Allow tab to join group, stop agent mode, show notification
      if (activeTabInGroup) {
        sendStopAgentMessage(activeTabInGroup);
        stopAgentTracking(activeTabInGroup, newGroupId);
      }
      showBlockNotification(blockCheck, tab.url);
      return;
    }

    // Tab allowed - add to visited URLs (no page_read on tab group join)
    await addVisitedUrl(session, tab.url);
  }
});
// ============================================================================