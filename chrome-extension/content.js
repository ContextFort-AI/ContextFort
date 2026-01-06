// GLOBALS AND INITIALIZATION
// ============================================================================
let agentModeActive = false;
// ============================================================================


// HELPER FUNCTIONS
// ============================================================================
function safeSendMessage(message) {
  try {
    if (typeof chrome !== 'undefined' && chrome?.runtime?.sendMessage) {
      chrome.runtime.sendMessage(message);
    } else {
      console.error('[ContextFort] chrome.runtime.sendMessage is not available');
    }
  } catch (e) {
    console.error('[ContextFort] Error sending message to background script:', e);
  }
}

function captureElement(target) {
  if (!target) return null;
  return {
    tag: target.tagName,
    id: target.id || null,
    className: target.className || null,
    text: target.textContent?.substring(0, 50) || null,
    type: target.type || null,
    name: target.name || null
  };
}
// ============================================================================


// VISBILITY: EVENT LISTENERS
// ============================================================================
function onClickCapture(e) {
  if (agentModeActive) {
    safeSendMessage({
      type: 'SCREENSHOT_TRIGGER',
      action: 'click',
      eventType: 'click',
      element: captureElement(e.target),
      coordinates: {
        x: e.clientX * window.devicePixelRatio,
        y: e.clientY * window.devicePixelRatio
      },
      url: window.location.href,
      title: document.title
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
      coordinates: {
        x: e.clientX * window.devicePixelRatio,
        y: e.clientY * window.devicePixelRatio
      },
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
      coordinates: {
        x: e.clientX * window.devicePixelRatio,
        y: e.clientY * window.devicePixelRatio
      },
      url: window.location.href,
      title: document.title
    });
  }
}

function onInputCapture(e) {
  if (agentModeActive) {
    safeSendMessage({
      type: 'SCREENSHOT_TRIGGER',
      action: e.type,
      eventType: 'input',
      element: captureElement(e.target),
      inputValue: e.target.value || null,
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

  document.addEventListener('click', onBlockedElementClick, true);
  document.addEventListener('input', onBlockedElementInput, true);
  document.addEventListener('click', onClickCapture, true);
  document.addEventListener('dblclick', onDblClickCapture, true);
  document.addEventListener('contextmenu', onContextMenuCapture, true);
  document.addEventListener('input', onInputCapture, true);
}

function stopListening() {
  if (!agentModeActive) {
    return;
  }
  agentModeActive = false;

  document.removeEventListener('input', onInputCapture, true);
  document.removeEventListener('contextmenu', onContextMenuCapture, true);
  document.removeEventListener('dblclick', onDblClickCapture, true);
  document.removeEventListener('click', onClickCapture, true);
  document.removeEventListener('input', onBlockedElementInput, true);
  document.removeEventListener('click', onBlockedElementClick, true);
}


// VISIBILITY: AGENT MODE TRACKING
// ============================================================================
let stopPending = false;
let detectionPending = false;

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

// handling edge cases
if (document.getElementById('claude-agent-glow-border')) {
  safeSendMessage({ type: 'AGENT_DETECTED', source: 'existing' });
  startListening();
}

document.addEventListener('visibilitychange', () => {
  if (!document.hidden && agentModeActive) {
    setTimeout(() => {
      if (!document.getElementById('claude-agent-glow-border') && agentModeActive) {
        safeSendMessage({ type: 'AGENT_STOPPED' });
        stopListening();
      } else {
      }
    }, 500);
  }
});
// ============================================================================



// CONTROLS: ACTION BLOCKS
// ============================================================================
let blockedElements = [];

(async () => {
  const result = await chrome.storage.local.get(['blockedActions']);
  if (result.blockedActions) {
    blockedElements = result.blockedActions;
  }
})();

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.blockedActions) {
    blockedElements = changes.blockedActions.newValue || [];
  }
});

function isElementBlocked(element, metadata) {
  const tag = element.tagName;
  const id = element.id || null;
  const className = element.className || null;
  const text = element.textContent?.trim() || null;
  const elementType = element.type || null;
  const elementName = element.name || null;

  return (
    metadata.elementTag === tag &&
    metadata.elementId === id &&
    metadata.elementClass === className &&
    (metadata.elementText === null || metadata.elementText === text) &&
    metadata.elementType === elementType &&
    metadata.elementName === elementName
  );
}

function shouldBlockClick(element) {
  const currentUrl = window.location.href;
  const currentTitle = document.title;
  let currentElement = element;
  while (currentElement && currentElement !== document.body) {
    for (const blockedMeta of blockedElements) {
      if (blockedMeta.actionType !== 'click') {
        continue;
      }
      if (blockedMeta.url && blockedMeta.url !== currentUrl) {
        continue;
      }
      if (blockedMeta.title && blockedMeta.title !== currentTitle) {
        continue;
      }
      if (isElementBlocked(currentElement, blockedMeta)) {
        return true;
      }
    }
    currentElement = currentElement.parentElement;
  }

  return false;
}

function shouldBlockInput(element) {
  const currentUrl = window.location.href;
  const currentTitle = document.title;
  let currentElement = element;
  while (currentElement && currentElement !== document.body) {
    for (const blockedMeta of blockedElements) {
      if (blockedMeta.actionType !== 'input' && blockedMeta.actionType !== 'change') {
        continue;
      }
      if (blockedMeta.url && blockedMeta.url !== currentUrl) {
        continue;
      }
      if (blockedMeta.title && blockedMeta.title !== currentTitle) {
        continue;
      }
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
    showBlockedFeedback(e.target);
    safeSendMessage({
      type: 'ACTION_BLOCKED',
      actionType: 'click',
      url: window.location.href,
      title: document.title
    });
    return false;
  }
}

function onBlockedElementInput(e) {
  if (shouldBlockInput(e.target)) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    showBlockedFeedback(e.target);
    safeSendMessage({
      type: 'ACTION_BLOCKED',
      actionType: 'input',
      url: window.location.href,
      title: document.title
    });
    return false;
  }
}
// ============================================================================