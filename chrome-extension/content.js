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
  console.log('[ContextFort] Click captured, agentModeActive:', agentModeActive, 'isTrusted:', e.isTrusted);
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

function onInputCapture(e) {
  console.log('[ContextFort] Input/change captured, type:', e.type, 'agentModeActive:', agentModeActive, 'isTrusted:', e.isTrusted);
  if (agentModeActive) {
    safeSendMessage({
      type: 'SCREENSHOT_TRIGGER',
      action: e.type,                                   // 'input' or 'change'
      eventType: 'input',
      element: captureElement(e.target),
      inputValue: e.target.value || null,               // Captured input value
      url: window.location.href,
      title: document.title
    });
  }
}

function onScrollCapture(e) {
  console.log('[ContextFort] Scroll captured, agentModeActive:', agentModeActive);
  if (agentModeActive) {
    safeSendMessage({
      type: 'SCREENSHOT_TRIGGER',
      action: 'scroll',
      eventType: 'navigation',
      element: null,
      coordinates: null,
      url: window.location.href,
      title: document.title
    });
  }
}

function startListening() {
  if (agentModeActive) {
    console.log('[ContextFort] Already listening, skipping');
    return;
  }
  console.log('[ContextFort] Starting event listeners');
  agentModeActive = true;
  document.addEventListener('click', onClickCapture, true);
  document.addEventListener('dblclick', onDblClickCapture, true);
  document.addEventListener('contextmenu', onContextMenuCapture, true);
  document.addEventListener('input', onInputCapture, true);
  document.addEventListener('change', onInputCapture, true);
  document.addEventListener('scroll', onScrollCapture, true);
  console.log('[ContextFort] Event listeners added');
}

function stopListening() {
  if (!agentModeActive) {
    console.log('[ContextFort] Already stopped, skipping');
    return;
  }
  console.log('[ContextFort] Stopping event listeners');
  agentModeActive = false;
  document.removeEventListener('click', onClickCapture, true);
  document.removeEventListener('dblclick', onDblClickCapture, true);
  document.removeEventListener('contextmenu', onContextMenuCapture, true);
  document.removeEventListener('input', onInputCapture, true);
  document.removeEventListener('change', onInputCapture, true);
  document.removeEventListener('scroll', onScrollCapture, true);
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.id === 'claude-agent-glow-border' ||
            node.id === 'claude-agent-stop-button') {

          if (!detectionPending && !agentModeActive) {
            detectionPending = true;
            setTimeout(() => { detectionPending = false; }, 100);

            safeSendMessage({
              type: 'AGENT_DETECTED',
              url: window.location.href
            });
            startListening();
          }
        }
      }
    }

    for (const node of mutation.removedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.id === 'claude-agent-glow-border' ||
            node.id === 'claude-agent-stop-button') {
          if (!stopPending && agentModeActive && !document.hidden) {
            stopPending = true;
            setTimeout(() => { stopPending = false; }, 100);

            safeSendMessage({
              type: 'AGENT_STOPPED'
            });
            stopListening();
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

// When tab becomes visible, check if glow is still present after delay
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && agentModeActive) {
    // Tab became visible and we think agent is active
    // Wait 500ms to give Claude time to re-show the glow (they use 300ms delay)
    console.log('[ContextFort] Tab became visible, checking for glow in 500ms');
    setTimeout(() => {
      if (!document.getElementById('claude-agent-glow-border') && agentModeActive) {
        // Glow didn't reappear - agent stopped while we were away
        console.log('[ContextFort] Glow missing after tab activate - agent stopped');
        safeSendMessage({ type: 'AGENT_STOPPED' });
        stopListening();
      } else {
        console.log('[ContextFort] Glow present after tab activate - agent still running');
      }
    }, 500);
  }
});