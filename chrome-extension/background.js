console.log('[Claude Agent Detector] Extension loaded');

// ============================================================================
// IN-MEMORY STATE
// ============================================================================

// Track active sessions by groupId (orange Claude tab groups)
const sessions = new Map(); // groupId -> session object

// Track which tabs currently have agent mode active
const activeAgentTabs = new Map(); // tabId -> { sessionId, groupId }

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

// Create or retrieve session for a Claude tab group
async function getOrCreateSession(groupId, firstTabId, firstTabUrl, firstTabTitle) {
  // Return existing session if already created
  if (sessions.has(groupId)) {
    return sessions.get(groupId);
  }

  // Create new session with timestamp-based ID
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
    status: 'active'                            // 'active' or 'ended'
  };

  // Store in memory
  sessions.set(groupId, session);

  console.log('');
  console.log('📝 ═══════════════════════════════════════════════════════');
  console.log('📝 NEW SESSION CREATED');
  console.log('📝 ═══════════════════════════════════════════════════════');
  console.log(`Session ID: ${sessionId}`);
  console.log(`Group ID: ${groupId}`);
  console.log(`Time: ${new Date().toLocaleTimeString()}`);
  console.log('📝 ═══════════════════════════════════════════════════════');
  console.log('');

  // Save to chrome.storage.local (persistent across restarts)
  const result = await chrome.storage.local.get(['sessions']);
  const allSessions = result.sessions || [];
  allSessions.unshift(session); // Add to beginning of array
  await chrome.storage.local.set({ sessions: allSessions });

  return session;
}

// End session when tab group closes
async function endSession(groupId) {
  const session = sessions.get(groupId);
  if (!session) return;

  // Update session with end time and duration
  session.endTime = new Date().toISOString();
  session.status = 'ended';
  const start = new Date(session.startTime);
  const end = new Date(session.endTime);
  session.duration = Math.round((end - start) / 1000); // Convert to seconds

  console.log('');
  console.log('📋 ═══════════════════════════════════════════════════════');
  console.log('📋 SESSION ENDED');
  console.log('📋 ═══════════════════════════════════════════════════════');
  console.log(`Session ID: ${session.id}`);
  console.log(`Duration: ${session.duration}s`);
  console.log(`Screenshots: ${session.screenshotCount}`);
  console.log('📋 ═══════════════════════════════════════════════════════');
  console.log('');

  // Update in chrome.storage.local
  const result = await chrome.storage.local.get(['sessions']);
  const allSessions = result.sessions || [];
  const index = allSessions.findIndex(s => s.id === session.id);
  if (index !== -1) {
    allSessions[index] = session;
    await chrome.storage.local.set({ sessions: allSessions });
  }

  // Clean up memory
  sessions.delete(groupId);
}

// Track when agent mode starts/stops on a specific tab
function trackAgentActivation(groupId, tabId, action) {
  const session = sessions.get(groupId);
  if (!session) return;

  if (action === 'start') {
    // Agent mode started - link tab to session
    activeAgentTabs.set(tabId, {
      sessionId: session.id,
      groupId: groupId
    });
  } else if (action === 'stop') {
    // Agent mode stopped - remove tab tracking
    activeAgentTabs.delete(tabId);
  }
}

// ============================================================================
// TAB CLEANUP
// ============================================================================

// Clean up when tab closes
chrome.tabs.onRemoved.addListener((tabId) => {
  activeAgentTabs.delete(tabId);
});

// End session when tab group closes
chrome.tabGroups.onRemoved.addListener(async (groupId) => {
  await endSession(groupId);
});

// ============================================================================
// MESSAGE HANDLERS (from content.js)
// ============================================================================

chrome.runtime.onMessage.addListener(async (message, sender) => {
  const tab = sender.tab;
  const groupId = tab?.groupId;

  // Content script detected Claude agent mode started
  if (message.type === 'AGENT_DETECTED') {
    console.log('');
    console.log('🔴 ═══════════════════════════════════════════════════════');
    console.log('🔴 CLAUDE AGENT MODE DETECTED - DOM ELEMENTS');
    console.log('🔴 ═══════════════════════════════════════════════════════');
    console.log(`Tab ID: ${tab?.id}`);
    console.log(`Tab Title: ${tab?.title?.substring(0, 60)}`);
    console.log(`Tab URL: ${tab?.url?.substring(0, 80)}`);
    console.log(`Element: ${message.elementId || 'existing'}`);
    console.log(`Time: ${new Date().toLocaleTimeString()}`);
    if (groupId) console.log(`Group ID: ${groupId}`);
    console.log('🔴 ═══════════════════════════════════════════════════════');
    console.log('');

    if (groupId && groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
      await getOrCreateSession(groupId, tab.id, tab.url, tab.title);
      trackAgentActivation(groupId, tab.id, 'start');
    }
  }

  // Content script detected Claude agent mode stopped
  else if (message.type === 'AGENT_STOPPED') {
    console.log('');
    console.log('🟢 ═══════════════════════════════════════════════════════');
    console.log('🟢 CLAUDE AGENT MODE STOPPED - DOM ELEMENTS REMOVED');
    console.log('🟢 ═══════════════════════════════════════════════════════');
    console.log(`Tab ID: ${tab?.id}`);
    console.log(`Tab Title: ${tab?.title?.substring(0, 60)}`);
    console.log(`Time: ${new Date().toLocaleTimeString()}`);
    if (groupId) console.log(`Group ID: ${groupId}`);
    console.log('🟢 ═══════════════════════════════════════════════════════');
    console.log('');

    if (groupId) {
      trackAgentActivation(groupId, tab.id, 'stop');
    }
  }

  // Content script triggered screenshot capture
  else if (message.type === 'SCREENSHOT_TRIGGER') {
    // Only capture if this tab has active agent mode
    const activation = activeAgentTabs.get(tab.id);
    if (!activation) return;

    // Capture visible tab as PNG
    chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' }, async (dataUrl) => {
      if (chrome.runtime.lastError) {
        console.log(`[Screenshot] Error: ${chrome.runtime.lastError.message}`);
        return;
      }

      // Create unique screenshot ID
      const screenshotId = Date.now() + Math.random();

      console.log('');
      console.log('📸 ═══════════════════════════════════════════════════════');
      console.log('📸 SCREENSHOT CAPTURED');
      console.log('📸 ═══════════════════════════════════════════════════════');
      console.log(`Tab ID: ${tab?.id}`);
      console.log(`Action: ${message.action}`);
      console.log(`Time: ${new Date().toLocaleTimeString()}`);
      console.log(`Size: ${Math.round(dataUrl.length / 1024)} KB`);
      if (groupId) console.log(`Group ID: ${groupId}`);
      console.log('📸 ═══════════════════════════════════════════════════════');
      console.log('');

      // Create screenshot object matching ContextFort schema
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

      // Read current data from storage
      const result = await chrome.storage.local.get(['screenshots', 'sessions']);
      const screenshots = result.screenshots || [];
      const allSessions = result.sessions || [];

      // Add new screenshot
      screenshots.push(screenshotData);

      // Keep only last 100 screenshots (FIFO cleanup)
      if (screenshots.length > 100) {
        screenshots.shift(); // Remove oldest
      }

      // Increment screenshot count in session
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
// EXTENSION ICON CLICK HANDLER
// ============================================================================

// When user clicks extension icon, open dashboard
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('dashboard/dashboard/screenshots/index.html')
  });
});

// ============================================================================
// INITIALIZATION
// ============================================================================

console.log('[Claude Agent Detector] Event-driven monitoring - NO POLLING');
