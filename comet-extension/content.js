// GLOBALS AND INITIALIZATION
// ============================================================================
let agentModeActive = false;
console.log('[ContextFort for Comet] Content script loaded on:', window.location.href);
// ============================================================================


// HELPER FUNCTIONS
// ============================================================================
function safeSendMessage(message) {
  try {
    if (typeof chrome !== 'undefined' && chrome?.runtime?.sendMessage) {
      console.log('[ContextFort for Comet] Sending message:', message.type, message);
      chrome.runtime.sendMessage(message);
    } else {
      console.error('[ContextFort for Comet] chrome.runtime.sendMessage is not available');
    }
  } catch (e) {
    console.error('[ContextFort for Comet] Error sending message to background script:', e);
  }
}

function captureElement(target) {
  if (!target) return null;

  // Handle className for both HTML and SVG elements
  let className = null;
  if (target.className) {
    if (typeof target.className === 'string') {
      className = target.className;
    } else if (target.className.baseVal !== undefined) {
      // SVG elements have className as SVGAnimatedString with baseVal property
      className = target.className.baseVal;
    }
  }

  return {
    tag: target.tagName,
    id: target.id || null,
    className: className,
    text: target.textContent?.substring(0, 50) || null,
    type: target.type || null,
    name: target.name || null
  };
}

function showInPageNotification(title, message, type = 'error') {
  console.log('[ContextFort for Comet] Showing notification:', title, message, type);
  // Remove any existing notification
  const existingNotification = document.getElementById('contextfort-comet-notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification container
  const notification = document.createElement('div');
  notification.id = 'contextfort-comet-notification';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    min-width: 320px;
    max-width: 400px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 2147483647;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    display: flex;
    align-items: flex-start;
    padding: 16px;
    gap: 12px;
    animation: contextfort-comet-slide-in 0.3s ease-out;
    border-left: 4px solid ${type === 'error' ? '#DC2626' : '#2563EB'};
  `;

  // Add animation keyframes
  if (!document.getElementById('contextfort-comet-notification-styles')) {
    const style = document.createElement('style');
    style.id = 'contextfort-comet-notification-styles';
    style.textContent = `
      @keyframes contextfort-comet-slide-in {
        from {
          transform: translateX(420px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes contextfort-comet-slide-out {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(420px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Icon
  const icon = document.createElement('div');
  icon.style.cssText = `
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    font-size: 24px;
    line-height: 24px;
  `;
  icon.textContent = type === 'error' ? '⛔' : 'ℹ️';

  // Content
  const content = document.createElement('div');
  content.style.cssText = `
    flex: 1;
    min-width: 0;
  `;

  const titleEl = document.createElement('div');
  titleEl.style.cssText = `
    font-weight: 600;
    font-size: 14px;
    color: #1F2937;
    margin-bottom: 4px;
  `;
  titleEl.textContent = title;

  const messageEl = document.createElement('div');
  messageEl.style.cssText = `
    font-size: 13px;
    color: #6B7280;
    line-height: 1.4;
  `;
  messageEl.textContent = message;

  content.appendChild(titleEl);
  content.appendChild(messageEl);

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.style.cssText = `
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    border: none;
    background: transparent;
    color: #9CA3AF;
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  closeBtn.textContent = '×';
  closeBtn.onclick = () => {
    notification.style.animation = 'contextfort-comet-slide-out 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  };

  notification.appendChild(icon);
  notification.appendChild(content);
  notification.appendChild(closeBtn);

  document.body.appendChild(notification);

  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'contextfort-comet-slide-out 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}
// ============================================================================


// VISBILITY: EVENT LISTENERS
// ============================================================================
function onClickCapture(e) {
  if (agentModeActive) {
    console.log('[ContextFort for Comet] 🖱️ CLICK captured:', {
      target: e.target.tagName,
      id: e.target.id,
      class: e.target.className,
      x: e.clientX,
      y: e.clientY
    });
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
    console.log('[ContextFort for Comet] 🖱️🖱️ DOUBLE-CLICK captured:', {
      target: e.target.tagName,
      id: e.target.id
    });
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
    console.log('[ContextFort for Comet] 🖱️ RIGHT-CLICK captured:', {
      target: e.target.tagName,
      id: e.target.id
    });
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
    console.log('[ContextFort for Comet] ⌨️ INPUT captured:', {
      target: e.target.tagName,
      id: e.target.id,
      type: e.target.type,
      valueLength: e.target.value?.length || 0
    });
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
    console.log('[ContextFort for Comet] ⚠️ startListening called but already active');
    return;
  }
  console.log('[ContextFort for Comet] 🎧 START LISTENING - Adding event listeners');
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
    console.log('[ContextFort for Comet] ⚠️ stopListening called but not active');
    return;
  }
  console.log('[ContextFort for Comet] 🛑 STOP LISTENING - Removing event listeners');
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
        // Log all element additions with pplx in the id
        if (node.id && node.id.includes('pplx')) {
          console.log('[ContextFort for Comet] 🔍 DOM ADDED - pplx element:', node.id);
        }
        if (node.id === 'pplx-agent-0_0-overlay' ||
            node.id === 'pplx-agent-0_0-overlay-stop-button') {
          console.log('[ContextFort for Comet] 🟢 AGENT OVERLAY DETECTED:', node.id);
          if (!detectionPending && !agentModeActive) {
            detectionPending = true;
            setTimeout(() => { detectionPending = false; }, 100);
            console.log('[ContextFort for Comet] 📤 Sending AGENT_DETECTED message');
            safeSendMessage({
              type: 'AGENT_DETECTED',
              url: window.location.href
            });
            startListening();
          } else {
            console.log('[ContextFort for Comet] ⚠️ Skipping detection - pending:', detectionPending, 'active:', agentModeActive);
          }
        }
      }
    }

    for (const node of mutation.removedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Log all element removals with pplx in the id
        if (node.id && node.id.includes('pplx')) {
          console.log('[ContextFort for Comet] 🔍 DOM REMOVED - pplx element:', node.id);
        }
        if (node.id === 'pplx-agent-0_0-overlay' ||
            node.id === 'pplx-agent-0_0-overlay-stop-button') {
          console.log('[ContextFort for Comet] 🔴 AGENT OVERLAY REMOVED:', node.id);
          if (!stopPending && agentModeActive && !document.hidden) {
            stopPending = true;
            setTimeout(() => { stopPending = false; }, 100);
            console.log('[ContextFort for Comet] 📤 Sending AGENT_STOPPED message');
            safeSendMessage({
              type: 'AGENT_STOPPED'
            });
            stopListening();
          } else {
            console.log('[ContextFort for Comet] ⚠️ Skipping stop - pending:', stopPending, 'active:', agentModeActive, 'hidden:', document.hidden);
          }
        }
      }
    }
  }
});

console.log('[ContextFort for Comet] 👁️ Starting MutationObserver');
observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});

// handling edge cases - check if overlay already exists
const existingOverlay = document.getElementById('pplx-agent-0_0-overlay');
if (existingOverlay) {
  console.log('[ContextFort for Comet] 🟢 EXISTING OVERLAY FOUND on page load');
  safeSendMessage({ type: 'AGENT_DETECTED', source: 'existing' });
  startListening();
} else {
  console.log('[ContextFort for Comet] No existing overlay found on page load');
}

document.addEventListener('visibilitychange', () => {
  console.log('[ContextFort for Comet] 👁️ Visibility changed - hidden:', document.hidden, 'agentActive:', agentModeActive);
  if (!document.hidden && agentModeActive) {
    setTimeout(() => {
      const overlay = document.getElementById('pplx-agent-0_0-overlay');
      console.log('[ContextFort for Comet] Checking overlay after visibility change - found:', !!overlay);
      if (!overlay && agentModeActive) {
        console.log('[ContextFort for Comet] 🔴 Overlay gone after tab became visible - stopping agent');
        safeSendMessage({ type: 'AGENT_STOPPED' });
        stopListening();
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
    console.log('[ContextFort for Comet] 📋 Loaded blocked actions:', blockedElements.length);
  }
})();

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.blockedActions) {
    blockedElements = changes.blockedActions.newValue || [];
    console.log('[ContextFort for Comet] 📋 Blocked actions updated:', blockedElements.length);
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
        console.log('[ContextFort for Comet] 🚫 CLICK BLOCKED on element:', currentElement.tagName, currentElement.id);
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
        console.log('[ContextFort for Comet] 🚫 INPUT BLOCKED on element:', currentElement.tagName, currentElement.id);
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
    console.log('[ContextFort for Comet] 🚫 ACTION_BLOCKED sent for click');
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
    console.log('[ContextFort for Comet] 🚫 ACTION_BLOCKED sent for input');
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


// MESSAGE LISTENER FOR NOTIFICATIONS
// ============================================================================
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[ContextFort for Comet] 📨 Received message:', message.type, message);
  if (message.type === 'START_LISTENING') {
    console.log('[ContextFort for Comet] 🎧 START_LISTENING received from background');
    startListening();
  }
  else if (message.type === 'STOP_LISTENING') {
    console.log('[ContextFort for Comet] 🛑 STOP_LISTENING received from background');
    stopListening();
  }
  else if (message.type === 'SHOW_NOTIFICATION') {
    showInPageNotification(message.title, message.message, message.notificationType);
  }
});
// ============================================================================
