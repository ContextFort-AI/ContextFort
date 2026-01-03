const sessions = new Map(); // groupId -> session object
const activeAgentTabs = new Map(); // tabId -> { sessionId, groupId }
const urlBlockingRules = [
  // Add your rules here as arrays: ['domain1.com', 'domain2.com']
];

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
chrome.runtime.onMessage.addListener(async (message, sender) => {
  const tab = sender.tab;
  const groupId = tab?.groupId;

  if (message.type === 'AGENT_DETECTED') {
    if (groupId && groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
      const session = await getOrCreateSession(groupId, tab.id, tab.url, tab.title);

      // Check if this URL should be blocked before allowing agent mode to activate
      const blockCheck = shouldBlockNavigation(tab.url, session.visitedUrls);
      if (blockCheck.blocked) {
        showBlockedPage(tab.id, blockCheck, tab.url);
        return; // Don't activate agent mode on blocked URL
      }

      trackAgentActivation(groupId, tab.id, 'start');

      // Track page read event (agent mode activated on this URL)
      const result = await chrome.storage.local.get(['screenshots']);
      const screenshots = result.screenshots || [];

      const pageReadData = {
        id: Date.now() + Math.random(),           // Unique identifier
        sessionId: session.id,                     // Links to session
        tabId: tab.id,                            // Tab where agent activated
        url: tab.url,                             // Page URL
        title: tab.title,                         // Page title
        reason: 'page_read',                      // Why this entry exists
        timestamp: new Date().toISOString(),      // ISO 8601 timestamp
        dataUrl: null,                            // No screenshot for page reads
        eventType: 'page_read',                   // Special type for reads
        eventDetails: {
          element: null,                          // No element for page reads
          coordinates: null,                      // No coordinates for page reads
          inputValue: null,                       // Not applicable
          actionType: 'page_read'                 // Agent started reading this page
        }
      };

      screenshots.push(pageReadData);

      if (screenshots.length > 100) {
        screenshots.shift(); // Remove oldest
      }

      await chrome.storage.local.set({ screenshots: screenshots });

      // Add this URL to visited URLs (allowed)
      await addVisitedUrl(session, tab.url);
    }
  }

  else if (message.type === 'AGENT_STOPPED') {
    if (groupId) {
      trackAgentActivation(groupId, tab.id, 'stop');
    }
  }

  // Content script triggered screenshot capture
  if (message.type === 'SCREENSHOT_TRIGGER') {
    const activation = activeAgentTabs.get(tab.id);
    if (!activation) {
      return;
    }
    chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' }, async (dataUrl) => {
      if (chrome.runtime.lastError) {
        return;
      }

      const screenshotId = Date.now() + Math.random();
      const screenshotData = {
        id: screenshotId,                       // Unique identifier
        sessionId: activation.sessionId,         // Links to session
        tabId: tab.id,                          // Tab where screenshot was taken
        url: message.url || tab.url,            // Page URL
        title: message.title || tab.title,      // Page title
        reason: 'agent_event',                  // Why screenshot was taken
        timestamp: new Date().toISOString(),    // ISO 8601 timestamp
        dataUrl: dataUrl,                       // Base64 PNG image data
        eventType: message.eventType || 'unknown', // 'click' or 'navigation'
        eventDetails: {
          element: message.element || null,     // Element info (tag, id, class, text)
          coordinates: message.coordinates || null, // Click coordinates {x, y}
          inputValue: null,                     // Not used for agent events
          actionType: message.action            // 'click', 'dblclick', 'scroll', etc.
        }
      };

      const result = await chrome.storage.local.get(['screenshots', 'sessions']);
      const screenshots = result.screenshots || [];
      const allSessions = result.sessions || [];

      screenshots.push(screenshotData);

      if (screenshots.length > 100) {
        screenshots.shift(); // Remove oldest
      }

      const sessionIndex = allSessions.findIndex(s => s.id === activation.sessionId);
      if (sessionIndex !== -1) {
        allSessions[sessionIndex].screenshotCount = (allSessions[sessionIndex].screenshotCount || 0) + 1;
        // Update in-memory count too
        sessions.get(groupId).screenshotCount = allSessions[sessionIndex].screenshotCount;
      }

      // Save updated data to storage
      await chrome.storage.local.set({ screenshots: screenshots, sessions: allSessions });
    });
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

// Helper function to block navigation with visual feedback
function showBlockedPage(tabId, blockCheck, newUrl) {
  chrome.tabs.update(tabId, {
    url: `data:text/html,<html><head><title>Navigation Blocked</title></head><body style="font-family: system-ui; padding: 40px; max-width: 600px; margin: 0 auto;"><h1 style="color: #d97757;">⛔ Navigation Blocked</h1><p><strong>Reason:</strong> ${blockCheck.reason}</p><p><strong>Blocked URL:</strong> ${newUrl}</p><p><strong>Conflicting URL:</strong> ${blockCheck.conflictingUrl}</p><p>This navigation was blocked because the URL blocking rules prevent these two domains from being visited in the same agent session.</p></body></html>`
  });
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
// 1. BLOCK SAME-TAB NAVIGATION (webNavigation.onBeforeNavigate)
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
    showBlockedPage(tabId, blockCheck, newUrl);
    return;
  }

  await addVisitedUrl(session, newUrl);
});

// ============================================================================
// 2. BLOCK TAB UPDATES (chrome.tabs.update with URL or group changes)
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
      showBlockedPage(tabId, blockCheck, newUrl);
      return;
    }

    // Navigation allowed - add to visited URLs
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
    for (const [activeTabId, activation] of activeAgentTabs.entries()) {
      if (activation.groupId === newGroupId) {
        agentActive = true;
        break;
      }
    }
    if (!agentActive) return;
    // Check if this tab's URL conflicts with session rules
    const blockCheck = shouldBlockNavigation(tab.url, session.visitedUrls);

    if (blockCheck.blocked) {
      showBlockedPage(tabId, blockCheck, tab.url);
      return;
    }

    // Tab allowed - add to visited URLs
    await addVisitedUrl(session, tab.url);
  }
});

// ============================================================================
// 3. BLOCK NEW TAB CREATION (chrome.tabs.create with URL)
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
  for (const [activeTabId, activation] of activeAgentTabs.entries()) {
    if (activation.groupId === groupId) {
      agentActive = true;
      break;
    }
  }
  if (!agentActive) return;

  // Check if this navigation should be blocked
  const blockCheck = shouldBlockNavigation(newUrl, session.visitedUrls);

  if (blockCheck.blocked) {
    // For new tabs, we need to wait a moment before updating
    setTimeout(() => {
      showBlockedPage(tab.id, blockCheck, newUrl);
    }, 100);
    return;
  }

  // Navigation allowed - add to visited URLs
  await addVisitedUrl(session, newUrl);
});

// ============================================================================
// 4. BLOCK TABS JOINING AGENT GROUP (onAttached - moved between windows)
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
  for (const [activeTabId, activation] of activeAgentTabs.entries()) {
    if (activation.groupId === groupId) {
      agentActive = true;
      break;
    }
  }
  if (!agentActive) return;

  // Check if this tab's URL conflicts with session rules
  const blockCheck = shouldBlockNavigation(tab.url, session.visitedUrls);

  if (blockCheck.blocked) {
    showBlockedPage(tabId, blockCheck, tab.url);
    return;
  }

  // Tab allowed - add to visited URLs
  await addVisitedUrl(session, tab.url);
});