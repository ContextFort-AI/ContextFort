// POSTHOG
// ============================================================================
import { initPostHog, trackEvent, identifyUser } from './posthog-config.js';
initPostHog();
// ============================================================================


// EXTENSION BASICS
// ============================================================================
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

trackEvent('extension_started', {
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
let blockedActions = [];
let governanceRules = {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const tab = sender.tab;
  const groupId = tab?.groupId;

  if (message.type === 'AGENT_DETECTED') {
    onMessageAgentDetected(message, sender);
  }

  else if (message.type === 'AGENT_STOPPED') {
    onMessageAgentStopped(message, sender);
  }

  else if (message.type === 'ACTION_BLOCKED') {
    onMessageAgentBlocked(message);
  }

  else if (message.type === 'SCREENSHOT_TRIGGER') {
    onMessageScreenshotTrigger(message, sender);
  }

  else if (message.type === 'RELOAD_BLOCKING_RULES') {
    urlBlockingRules = message.rules || [];
  }

  else if (message.type === 'RELOAD_BLOCKED_ACTIONS') {
    blockedActions = message.actions || [];
  }

  else if (message.type === 'RELOAD_GOVERNANCE_RULES') {
    governanceRules = message.rules || {};
    updateDNRRules();
  }

  handleAuthMessages(message, sendResponse);    
});


(async () => {
  const result = await chrome.storage.local.get(['urlBlockingRules', 'blockedActions', 'governanceRules', 'sessions']);

  if (result.urlBlockingRules) {
    urlBlockingRules = result.urlBlockingRules;
  }

  if (result.blockedActions) {
    blockedActions = result.blockedActions;
  }

  if (result.governanceRules) {
    governanceRules = result.governanceRules;
    await updateDNRRules();
  }

  const allSessions = result.sessions || [];
  for (const session of allSessions) {
    if (session.status === 'active') {
      sessions.set(session.groupId, session);
    }
  }
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
    const rulesToAdd = [];
    const ruleIdsToRemove = [];

    if (governanceRules.disallow_clickable_urls) {
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
    } else {
      ruleIdsToRemove.push(DNR_RULE_IDS.DISALLOW_CLICKABLE_URLS);
    }

    if (governanceRules.disallow_query_params) {
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
    } else {
      ruleIdsToRemove.push(DNR_RULE_IDS.DISALLOW_QUERY_PARAMS);
    }

    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: ruleIdsToRemove,
      addRules: rulesToAdd
    });
  } catch (error) {
  }
}
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

const groupTitles = new Map();

chrome.tabGroups.onUpdated.addListener(async (group) => {
  const session = sessions.get(group.id);

  if (!session || session.status !== 'active') {
    groupTitles.set(group.id, group.title);
    return;
  }

  const previousTitle = groupTitles.get(group.id);
  const currentTitle = group.title;

  const hadCheckmark = previousTitle && previousTitle.includes('✅');
  const hasCheckmark = currentTitle && currentTitle.includes('✅');

  if (hadCheckmark && !hasCheckmark) {
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
            endSession(group.id);
          } else {
            const restoredTitle = currentTitle.includes('✅') ? currentTitle : `✅ ${currentTitle}`;
            chrome.tabGroups.update(group.id, { title: restoredTitle }).then(() => {
              groupTitles.set(group.id, restoredTitle);
            }).catch(() => {});
          }
        });
      } else {
        const restoredTitle = currentTitle.includes('✅') ? currentTitle : `✅ ${currentTitle}`;
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




// VISIBILITY: TRACK AGENT MODES
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
      await endSession(groupId);
      break;
    }
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.groupId !== undefined) {
    for (const [groupId, session] of sessions.entries()) {
      if (session.status === 'active' && session.tabId === tabId && changeInfo.groupId !== groupId) {
        await endSession(groupId);
        break;
      }
    }

    if (changeInfo.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
      const session = sessions.get(changeInfo.groupId);
      if (session && session.status === 'active') {
        const tabsInGroup = await chrome.tabs.query({ groupId: changeInfo.groupId });

        // RESTRICTION TODO
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
    }
  }
});


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

function onMessageAgentDetected() {
  trackEvent('AGENT_DETECTED', {agentMode: 'started'});
  if (groupId && groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
    getOrCreateSession(groupId, tab.id, tab.url, tab.title).then(session => {
      const blockCheck = shouldBlockNavigation(tab.url, session.visitedUrls);
      if (blockCheck.blocked) {
        sendStopAgentMessage(tab.id);
        showBlockNotification(blockCheck, tab.url);
        return;
      }
      trackAgentActivation(groupId, tab.id, 'start');
      addPageReadAndVisitedUrl(session, tab.id, tab.url, tab.title);
    });
  }
}

function onMessageAgentStopped() {
  trackEvent('AGENT_STOPPED', {agentMode: 'stopped'});
  if (groupId) {
    trackAgentActivation(groupId, tab.id, 'stop');
  }
}

function onMessageAgentBlocked(message) {
  trackEvent('ACTION_BLOCKED', {actionType: message.actionType});
  sendStopAgentMessage(tab.id);
  chrome.notifications.create({
    type: 'basic',
    title: '⛔ Action Blocked',
    message: `Agent attempted to ${message.actionType} on a restricted element at ${getHostname(message.url)}`,
    priority: 2
  });
}

function sendStopAgentMessage(tabId) {
  try {
    chrome.runtime.sendMessage({
      type: 'STOP_AGENT',
      targetTabId: tabId
    });
  } catch (e) {
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
import { loginWithEmail, verifyOTP, resendOTP, getCurrentUser, isLoggedIn, logout} from './auth.js';

function handleAuthMessages(message, sendResponse) {
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
        identifyUser(message.email, { email: message.email });
        trackEvent('user_authenticated', { email: message.email });
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

function onMessageScreenshotTrigger(message, sender) {
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
    if (domain1 === "" && matchesHostname(newHostname, domain2)) {
      return {
        blocked: true,
        reason: `Navigation to ${newHostname} is blocked due to existing context of ${domain2}. Please start new chat.`,
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
    sendStopAgentMessage(tabId);
    stopAgentTracking(tabId, activation.groupId);
    chrome.notifications.create({
      type: 'basic',
      title: '⛔ Agent Mode Denied',
      message: blockCheck.reason,
      priority: 2
    });
    return;
  }

  const tab = await chrome.tabs.get(tabId);
  await addPageReadAndVisitedUrl(session, tabId, newUrl, tab.title);
});


chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const newUrl = changeInfo.url;
    const activation = activeAgentTabs.get(tabId);
    if (!activation) return;
    const session = sessions.get(activation.groupId);
    if (!session) return;
    const blockCheck = shouldBlockNavigation(newUrl, session.visitedUrls);
    if (blockCheck.blocked) {
      sendStopAgentMessage(tabId);
      stopAgentTracking(tabId, activation.groupId);
        chrome.notifications.create({
        type: 'basic',
        title: '⛔ Agent Mode Denied',
        message: blockCheck.reason,
        priority: 2
      });
      return;
    }
    await addVisitedUrl(session, newUrl);
  }

  if (changeInfo.groupId) {
    const newGroupId = changeInfo.groupId;
    if (newGroupId === chrome.tabGroups.TAB_GROUP_ID_NONE) return;
    const session = sessions.get(newGroupId);
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
      if (activeTabInGroup) {
        sendStopAgentMessage(activeTabInGroup);
        stopAgentTracking(activeTabInGroup, newGroupId);
      }
      chrome.notifications.create({
        type: 'basic',
        title: '⛔ Agent Mode Denied',
        message: blockCheck.reason,
        priority: 2
      });
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
    dataUrl: null,
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
}
// ============================================================================