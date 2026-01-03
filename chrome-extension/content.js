// Safely send message to background script, handling invalid extension context
function safeSendMessage(message) {
  try {
    if (typeof chrome !== 'undefined' && chrome?.runtime?.sendMessage) {
      chrome.runtime.sendMessage(message);
    } else {
      console.log('[ContextFort] Error sending message: chrome.runtime.sendMessage is unavailable');
    }
  } catch (e) {
    console.log('[ContextFort] Error sending message:', e);
  }
}

let agentModeActive = false;
let detectionPending = false;
let stopPending = false;

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

function onClickCapture(e) {
  if (agentModeActive) {
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
}

function onDblClickCapture(e) {
  if (agentModeActive) {
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
}

function onContextMenuCapture(e) {
  if (agentModeActive) {
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
}


function startListening() {
  if (agentModeActive) {
    return;
  }
  agentModeActive = true;
  document.addEventListener('click', onClickCapture, true);
  document.addEventListener('dblclick', onDblClickCapture, true);
  document.addEventListener('contextmenu', onContextMenuCapture, true);
}

function stopListening() {
  if (!agentModeActive) return;
  agentModeActive = false;
  document.removeEventListener('click', onClickCapture, true);
  document.removeEventListener('dblclick', onDblClickCapture, true);
  document.removeEventListener('contextmenu', onContextMenuCapture, true);
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.id === 'claude-agent-glow-border' ||
            node.id === 'claude-agent-stop-button' ||
            node.id === 'claude-agent-animation-styles') {

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

    for (const node of mutation.removedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.id === 'claude-agent-glow-border' ||
            node.id === 'claude-agent-stop-button') {
          if (!stopPending && agentModeActive) {
            stopPending = true;
            setTimeout(() => { stopPending = false; }, 100);

            safeSendMessage({
              type: 'AGENT_STOPPED',
              elementId: node.id
            });
            stopListening();                              // Mark agent mode as stopped
          }
        }
      }
    }
  }
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});

if (document.getElementById('claude-agent-glow-border')) {
  safeSendMessage({ type: 'AGENT_DETECTED', source: 'existing' });
  startListening();
}
