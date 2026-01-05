// background.js
import { initPostHog, trackEvent, identifyUser } from './posthog-config.js';

let currentuser = ''

// Initialize PostHog when extension starts
initPostHog();
identifyUser(currentuser, {email:currentuser});

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

// Load URL blocking rules and restore active sessions on startup
(async () => {
  const result = await chrome.storage.local.get(['urlBlockingRules', 'sessions']);

  // Restore URL blocking rules
  if (result.urlBlockingRules) {
    urlBlockingRules = result.urlBlockingRules;
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
    url: chrome.runtime.getURL('dashboard/dashboard/screenshots/index.html')
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
    visitedUrls: [firstTabUrl]                  // Track all URLs visited in this session
  };

  sessions.set(groupId, session);
  const result = await chrome.storage.local.get(['sessions']);
  const allSessions = result.sessions || [];
  allSessions.unshift(session); // Add to beginning of array
  await chrome.storage.local.set({ sessions: allSessions });
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
// ============================================================================




// ============================================================================
// ALL ABOUT ACTIVE AGENT TABS
function trackAgentActivation(groupId, tabId, action) {
  const session = sessions.get(groupId);
  if (!session) return;

  if (action === 'start') {
    activeAgentTabs.set(tabId, {
      sessionId: session.id,
      groupId: groupId
    });
  } else if (action === 'stop') {
    activeAgentTabs.delete(tabId);
  }
}

chrome.tabs.onRemoved.addListener((tabId) => {
  activeAgentTabs.delete(tabId);
});
// ============================================================================




// ============================================================================
// MESSAGE LISTENERS
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  const tab = sender.tab;
  const groupId = tab?.groupId;

  // Check if this tab is in an agent-active group
  if (message.type === 'CHECK_IF_AGENT_GROUP') {
    console.log('[Background] CHECK_IF_AGENT_GROUP - tabId:', tab?.id, 'groupId:', groupId);
    if (groupId && groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
      const session = sessions.get(groupId);
      console.log('[Background] Session for group:', session);
      if (session && session.status === 'active') {
        console.log('[Background] Tab IS in agent group');
        sendResponse({ isAgentGroup: true });
        return true;
      }
    }
    console.log('[Background] Tab is NOT in agent group');
    sendResponse({ isAgentGroup: false });
    return true;
  }

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

      // Broadcast to all tabs in group to start monitoring
      console.log('[Background] AGENT_DETECTED - broadcasting START_MONITORING');
      await broadcastToGroup(groupId, { type: 'START_MONITORING' });
    }
  }

  else if (message.type === 'AGENT_STOPPED') {
    trackEvent('AGENT_STOPPED', {agentMode: 'stopped'});
    if (groupId) {
      trackAgentActivation(groupId, tab.id, 'stop');

      // Broadcast to all tabs in group to stop monitoring
      console.log('[Background] AGENT_STOPPED - broadcasting STOP_MONITORING');
      await broadcastToGroup(groupId, { type: 'STOP_MONITORING' });
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
    const saveEventData = async (dataUrl) => {
      const screenshotId = Date.now() + Math.random();
      const screenshotData = {
        id: screenshotId,
        sessionId: activation.sessionId,
        tabId: tab.id,
        url: message.url || tab.url,
        title: message.title || tab.title,
        reason: 'agent_event',
        timestamp: new Date().toISOString(),
        dataUrl: dataUrl,  // null if tab not active
        eventType: message.eventType || 'unknown',
        eventDetails: {
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
    };

    // If tab is not active, save event without screenshot
    if (!tab.active) {
      await saveEventData(null);
      return;
    }

    // Tab is active, capture screenshot
    chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' }, async (dataUrl) => {
      if (chrome.runtime.lastError) {
        // Screenshot failed, save event without screenshot
        await saveEventData(null);
        return;
      }

      // Screenshot succeeded, save with image
      await saveEventData(dataUrl);
    });
  }

  // Dashboard requested to reload blocking rules
  if (message.type === 'RELOAD_BLOCKING_RULES') {
    urlBlockingRules = message.rules || [];
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
      const match1 = (visitedHostname.includes(domain1) && newHostname.includes(domain2));
      const match2 = (visitedHostname.includes(domain2) && newHostname.includes(domain1));

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
  // Only add if URL is not already visited
  if (session.visitedUrls.includes(url)) {
    return;
  }

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
      console.log('[Page Read] Screenshot failed:', chrome.runtime.lastError.message);
      await savePageReadData(null);
      return;
    }

    await savePageReadData(dataUrl);
  });
}

// Helper function to broadcast message to all tabs in a group
async function broadcastToGroup(groupId, message) {
  console.log('[Background] Broadcasting', message.type, 'to group', groupId);
  const tabs = await chrome.tabs.query({ groupId: groupId });
  console.log('[Background] Found', tabs.length, 'tabs in group');
  for (const tab of tabs) {
    console.log('[Background] Sending to tab:', tab.id, tab.url);
    chrome.tabs.sendMessage(tab.id, message).catch((err) => {
      console.log('[Background] Failed to send to tab', tab.id, ':', err.message);
    });
  }
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
    console.log('[URL Blocking] Could not send STOP_AGENT to Claude:', e.message);
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

    // Navigation allowed - add page_read and visited URLs
    await addPageReadAndVisitedUrl(session, tabId, newUrl, tab.title);
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

    // Tab allowed - add page_read and visited URLs
    await addPageReadAndVisitedUrl(session, tab.id, tab.url, tab.title);
  }
});

// ============================================================================
// 3. NEW TAB CREATION (chrome.tabs.create with URL)
// ============================================================================

chrome.tabs.onCreated.addListener(async (tab) => {
  // Only check tabs created with a URL
  if (!tab.url || tab.url === 'chrome://newtab/' || tab.url === 'about:blank') return;

  const newUrl = tab.url;
  const groupId = tab.groupId;

  // Skip if not in a group
  if (!groupId || groupId === chrome.tabGroups.TAB_GROUP_ID_NONE) return;

  // Check if there's an active agent session in this group
  const session = sessions.get(groupId);
  if (!session) return;

  // Check if agent mode is ACTIVELY running in ANY tab in this group
  let agentActive = false;
  let activeTabInGroup = null;
  for (const [activeTabId, activation] of activeAgentTabs.entries()) {
    if (activation.groupId === groupId) {
      agentActive = true;
      activeTabInGroup = activeTabId;
      break;
    }
  }
  if (!agentActive) return;

  // Check if this navigation should be blocked
  const blockCheck = shouldBlockNavigation(newUrl, session.visitedUrls);

  if (blockCheck.blocked) {
    // Keep new tab, stop agent mode, show notification
    if (activeTabInGroup) {
      sendStopAgentMessage(activeTabInGroup);
      stopAgentTracking(activeTabInGroup, groupId);
    }
    showBlockNotification(blockCheck, newUrl);
    return;
  }

  // Navigation allowed - add page_read and visited URLs
  await addPageReadAndVisitedUrl(session, tab.id, newUrl, tab.title);
});

// ============================================================================
// 4. TABS JOINING AGENT GROUP (onAttached - moved between windows)
// ============================================================================

chrome.tabs.onAttached.addListener(async (tabId, attachInfo) => {
  const tab = await chrome.tabs.get(tabId);
  const groupId = tab.groupId;

  // Skip if not in a group
  if (!groupId || groupId === chrome.tabGroups.TAB_GROUP_ID_NONE) return;

  // Check if there's an active agent session in this group
  const session = sessions.get(groupId);
  if (!session || !tab.url) return;

  // Check if agent mode is ACTIVELY running in ANY tab in this group
  let agentActive = false;
  let activeTabInGroup = null;
  for (const [activeTabId, activation] of activeAgentTabs.entries()) {
    if (activation.groupId === groupId) {
      agentActive = true;
      activeTabInGroup = activeTabId;
      break;
    }
  }
  if (!agentActive) return;

  // Check if this tab's URL conflicts with session rules
  const blockCheck = shouldBlockNavigation(tab.url, session.visitedUrls);

  if (blockCheck.blocked) {
    // Allow tab move, stop agent mode, show notification
    if (activeTabInGroup) {
      sendStopAgentMessage(activeTabInGroup);
      stopAgentTracking(activeTabInGroup, groupId);
    }
    showBlockNotification(blockCheck, tab.url);
    return;
  }

  // Tab allowed - add page_read and visited URLs
  await addPageReadAndVisitedUrl(session, tab.id, tab.url, tab.title);
});