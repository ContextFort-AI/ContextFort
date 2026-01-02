console.log('[Claude Agent Detector] Content script loaded');

// ============================================================================
// CHROME API SAFETY
// ============================================================================

// Safely send message to background script, handling invalid extension context
function safeSendMessage(message) {
  try {
    if (typeof chrome !== 'undefined' && chrome?.runtime?.id) {
      chrome.runtime.sendMessage(message);
    }
  } catch (e) {
    // Extension context invalidated (reload/iframe) - silently ignore
  }
}

// ============================================================================
// STATE TRACKING
// ============================================================================

// Tracks whether agent mode is currently active on this page
let agentModeActive = false;

// Debounce flags to prevent duplicate detection when multiple elements inject/remove simultaneously
let detectionPending = false;
let stopPending = false;

// ============================================================================
// ELEMENT METADATA CAPTURE
// ============================================================================

// Extract metadata from a clicked/interacted element for screenshot context
// Returns object with tag, id, className, text, type, and name
function captureElement(target) {
  if (!target) return null;
  return {
    tag: target.tagName,                              // HTML tag (DIV, BUTTON, etc.)
    id: target.id || null,                            // Element ID attribute
    className: target.className || null,              // CSS classes
    text: target.textContent?.substring(0, 50) || null, // First 50 chars of text
    type: target.type || null,                        // Input type (if applicable)
    name: target.name || null                         // Name attribute (if applicable)
  };
}

// ============================================================================
// EVENT HANDLERS (capture user interactions when agent mode is active)
// ============================================================================

// Capture left-click events
function onClickCapture(e) {
  safeSendMessage({
    type: 'SCREENSHOT_TRIGGER',                       // Signal background.js to capture screenshot
    action: 'click',                                  // Type of action
    eventType: 'click',                               // Category: click
    element: captureElement(e.target),                // Clicked element metadata
    coordinates: { x: e.clientX, y: e.clientY },      // Click position on screen
    url: window.location.href,                        // Current page URL
    title: document.title                             // Current page title
  });
}

// Capture double-click events
function onDblClickCapture(e) {
  safeSendMessage({
    type: 'SCREENSHOT_TRIGGER',
    action: 'dblclick',
    eventType: 'click',
    element: captureElement(e.target),
    coordinates: { x: e.clientX, y: e.clientY },
    url: window.location.href,
    title: document.title
  });
}

// Capture right-click (context menu) events
function onContextMenuCapture(e) {
  safeSendMessage({
    type: 'SCREENSHOT_TRIGGER',
    action: 'rightclick',
    eventType: 'click',
    element: captureElement(e.target),
    coordinates: { x: e.clientX, y: e.clientY },
    url: window.location.href,
    title: document.title
  });
}

// Capture scroll events (navigation type)
function onScrollCapture() {
  safeSendMessage({
    type: 'SCREENSHOT_TRIGGER',
    action: 'scroll',
    eventType: 'navigation',                          // Scroll is navigation, not click
    element: null,                                    // No specific element for scroll
    coordinates: null,                                // No coordinates for scroll
    url: window.location.href,
    title: document.title
  });
}

// ============================================================================
// EVENT LISTENER MANAGEMENT
// ============================================================================

// Start capturing events when agent mode becomes active
// Uses capture phase (true) to catch events before page handlers
function startListening() {
  if (agentModeActive) return;                        // Already listening, skip
  agentModeActive = true;
  document.addEventListener('click', onClickCapture, true);
  document.addEventListener('dblclick', onDblClickCapture, true);
  document.addEventListener('contextmenu', onContextMenuCapture, true);
  document.addEventListener('scroll', onScrollCapture, true);
}

// Stop capturing events when agent mode ends
function stopListening() {
  if (!agentModeActive) return;                       // Not listening, skip
  agentModeActive = false;
  document.removeEventListener('click', onClickCapture, true);
  document.removeEventListener('dblclick', onDblClickCapture, true);
  document.removeEventListener('contextmenu', onContextMenuCapture, true);
  document.removeEventListener('scroll', onScrollCapture, true);
}

// ============================================================================
// CLAUDE AGENT MODE DOM DETECTION
// ============================================================================

// MutationObserver watches for DOM changes (elements added/removed)
// Detects when Claude injects its agent mode UI elements
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    // Check for newly added nodes
    for (const node of mutation.addedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Claude agent mode injects these specific IDs when active:
        // - claude-agent-glow-border: Orange glow around viewport
        // - claude-agent-stop-button: Stop button overlay
        // - claude-agent-animation-styles: CSS for animations
        if (node.id === 'claude-agent-glow-border' ||
            node.id === 'claude-agent-stop-button' ||
            node.id === 'claude-agent-animation-styles') {
          // Only notify once, even if multiple elements inject simultaneously
          if (!detectionPending && !agentModeActive) {
            detectionPending = true;
            setTimeout(() => { detectionPending = false; }, 100);

            safeSendMessage({
              type: 'AGENT_DETECTED',
              elementId: node.id,                         // Which element was detected
              url: window.location.href
            });
            startListening();                             // Begin capturing events
          }
        }
      }
    }

    // Check for removed nodes
    for (const node of mutation.removedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // When glow border or stop button is removed, agent mode ended
        if (node.id === 'claude-agent-glow-border' ||
            node.id === 'claude-agent-stop-button') {
          // Only notify once, even if multiple elements remove simultaneously
          if (!stopPending && agentModeActive) {
            stopPending = true;
            setTimeout(() => { stopPending = false; }, 100);

            safeSendMessage({
              type: 'AGENT_STOPPED',
              elementId: node.id
            });
            stopListening();                              // Stop capturing events
          }
        }
      }
    }
  }
});

// Start observing entire document for changes
// childList: Watch for nodes being added/removed
// subtree: Watch entire tree, not just direct children
observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});

// ============================================================================
// INITIAL CHECK (for when page loads with agent mode already active)
// ============================================================================

// If agent mode was already active when this script loaded, detect it
if (document.getElementById('claude-agent-glow-border')) {
  safeSendMessage({ type: 'AGENT_DETECTED', source: 'existing' });
  startListening();
}
