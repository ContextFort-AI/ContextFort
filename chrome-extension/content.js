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

// On load, check if this tab is in an agent-active group
(async () => {
  console.log('[ContextFort] Checking if tab is in agent group...');
  const response = await chrome.runtime.sendMessage({ type: 'CHECK_IF_AGENT_GROUP' });
  console.log('[ContextFort] Response:', response);
  if (response && response.isAgentGroup) {
    console.log('[ContextFort] Tab is in agent group - starting monitoring');
    startListening();
  } else {
    console.log('[ContextFort] Tab is NOT in agent group');
  }
})();
let blockedElements = [];

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

function onInputCapture(e) {
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
  document.addEventListener('change', onInputCapture, true);
  document.addEventListener('scroll', onScrollCapture, true);
  document.addEventListener('click', onBlockedElementClick, true);
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
  document.removeEventListener('change', onInputCapture, true);
  document.removeEventListener('scroll', onScrollCapture, true);
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

// Listen for broadcast messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[ContextFort] Received message:', message.type);
  if (message.type === 'START_MONITORING') {
    console.log('[ContextFort] Received START_MONITORING - starting listeners');
    startListening();
  } else if (message.type === 'STOP_MONITORING') {
    console.log('[ContextFort] Received STOP_MONITORING - stopping listeners');
    stopListening();
  }
});


// ============================================================================


function isElementBlocked(element, metadata) {
  const tag = element.tagName;
  const id = element.id || null;
  const className = element.className || null;
  const text = element.textContent?.trim() || null;
  const type = element.type || null;
  const name = element.name || null;
  
  return (
    metadata.tag === tag &&
    metadata.id === id &&
    metadata.className === className &&
    (metadata.text === null || metadata.text === text) &&
    metadata.type === type &&
    metadata.name === name
  );
}



// Check if click should be blocked
function shouldBlockClick(element) {
  // Check element and all its parents
  let currentElement = element;
  while (currentElement && currentElement !== document.body) {
    for (const blockedMeta of blockedElements) {
      if (isElementBlocked(currentElement, blockedMeta)) {
        return true;
      }
    }
    currentElement = currentElement.parentElement;
  }
  
  return false;
}


function showBlockedFeedback(element) {
  const originalBorder = element.style.border;
  element.style.border = "2px solid red";
  
  setTimeout(() => {
    element.style.border = originalBorder;
  }, 500);
}


function onBlockedElementClick(e) {
  if (shouldBlockClick(e.target)) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    
    console.log("Click blocked on:", e.target);
    
    // Optional: Visual feedback
    showBlockedFeedback(e.target);
    
    return false;
  }
}
