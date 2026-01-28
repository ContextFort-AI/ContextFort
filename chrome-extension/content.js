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
  // Remove any existing notification
  const existingNotification = document.getElementById('contextfort-notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification container
  const notification = document.createElement('div');
  notification.id = 'contextfort-notification';
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
    animation: contextfort-slide-in 0.3s ease-out;
    border-left: 4px solid ${type === 'error' ? '#DC2626' : '#2563EB'};
  `;

  // Add animation keyframes
  if (!document.getElementById('contextfort-notification-styles')) {
    const style = document.createElement('style');
    style.id = 'contextfort-notification-styles';
    style.textContent = `
      @keyframes contextfort-slide-in {
        from {
          transform: translateX(420px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes contextfort-slide-out {
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
    notification.style.animation = 'contextfort-slide-out 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  };

  notification.appendChild(icon);
  notification.appendChild(content);
  notification.appendChild(closeBtn);

  document.body.appendChild(notification);

  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'contextfort-slide-out 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

function showLoginRequiredNotification(domain, phase = 1) {
  // Remove any existing notification
  const existingNotification = document.getElementById('contextfort-login-notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  const existingMinimized = document.getElementById('contextfort-login-minimized');
  if (existingMinimized) {
    existingMinimized.remove();
  }

  let isMinimized = false;

  // Create notification container
  const notification = document.createElement('div');
  notification.id = 'contextfort-login-notification';
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    min-width: 360px;
    max-width: 420px;
    background: #1a1a1a;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    z-index: 2147483647;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    padding: 20px;
    animation: contextfort-slide-in 0.3s ease-out;
    border: 1px solid #333;
    transition: transform 0.3s ease;
  `;

  // Create minimized tab
  const minimizedTab = document.createElement('div');
  minimizedTab.id = 'contextfort-login-minimized';
  minimizedTab.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 0;
    background: #1a1a1a;
    border-radius: 8px 0 0 8px;
    padding: 12px 16px;
    cursor: pointer;
    z-index: 2147483647;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    display: none;
    align-items: center;
    gap: 8px;
    border: 1px solid #333;
    border-right: none;
    box-shadow: -4px 0 16px rgba(0, 0, 0, 0.3);
  `;
  minimizedTab.innerHTML = `<span style="font-size: 18px;">🔐</span><span style="color: #fff; font-size: 12px; font-weight: 600;">Login</span>`;
  minimizedTab.onclick = () => {
    minimizedTab.style.display = 'none';
    notification.style.display = 'block';
    notification.style.animation = 'contextfort-slide-in 0.3s ease-out';
    isMinimized = false;
  };

  // Add animation keyframes if not already added
  if (!document.getElementById('contextfort-notification-styles')) {
    const style = document.createElement('style');
    style.id = 'contextfort-notification-styles';
    style.textContent = `
      @keyframes contextfort-slide-in {
        from { transform: translateX(420px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes contextfort-slide-out {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(420px); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // Header with icon and minimize button
  const header = document.createElement('div');
  header.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  `;

  const headerLeft = document.createElement('div');
  headerLeft.style.cssText = `display: flex; align-items: center; gap: 10px;`;
  headerLeft.innerHTML = `
    <span style="font-size: 24px;">🔐</span>
    <span style="font-size: 16px; font-weight: 600; color: #fff;">Manual Login Required</span>
  `;

  const minimizeBtn = document.createElement('button');
  minimizeBtn.innerHTML = '−';
  minimizeBtn.style.cssText = `
    background: #333;
    border: none;
    color: #fff;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  minimizeBtn.onclick = () => {
    notification.style.display = 'none';
    minimizedTab.style.display = 'flex';
    isMinimized = true;
  };

  header.appendChild(headerLeft);
  header.appendChild(minimizeBtn);

  document.body.appendChild(minimizedTab);

  // Message
  const message = document.createElement('div');
  message.style.cssText = `
    font-size: 14px;
    color: #aaa;
    line-height: 1.5;
    margin-bottom: 16px;
  `;

  // Buttons container
  const buttons = document.createElement('div');
  buttons.style.cssText = `
    display: flex;
    gap: 10px;
  `;

  if (phase === 1) {
    // Phase 1: Show initial message and "Ok, I'll log in" button
    message.innerHTML = `
      No saved agent session for <strong style="color: #fff;">${domain}</strong><br><br>
      Your session has been cleared. You need to login manually for the agent to use this site.
    `;

    const okBtn = document.createElement('button');
    okBtn.textContent = "Ok, I'll log in";
    okBtn.style.cssText = `
      flex: 1;
      padding: 12px 16px;
      background: #4ADE80;
      color: #000;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    `;
    okBtn.onmouseover = () => okBtn.style.background = '#3bc56f';
    okBtn.onmouseout = () => okBtn.style.background = '#4ADE80';
    okBtn.onclick = () => {
      safeSendMessage({ type: 'OK_LOGIN_CLICKED', domain: domain });
      // Transition to phase 2
      showLoginRequiredNotification(domain, 2);
    };

    buttons.appendChild(okBtn);
  } else {
    // Phase 2: Show the two main buttons
    message.innerHTML = `
      No saved agent session for <strong style="color: #fff;">${domain}</strong><br><br>
      Please login, then click "I've Logged In".<br><br>
      Or click "Restore My Session" to get your cookies back.
    `;

    // "I've Logged In" button
    const loginBtn = document.createElement('button');
    loginBtn.textContent = "I've Logged In";
    loginBtn.style.cssText = `
      flex: 1;
      padding: 12px 16px;
      background: #4ADE80;
      color: #000;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    `;
    loginBtn.onmouseover = () => loginBtn.style.background = '#3bc56f';
    loginBtn.onmouseout = () => loginBtn.style.background = '#4ADE80';
    loginBtn.onclick = () => {
      safeSendMessage({ type: 'LOGIN_BUTTON_CLICKED', domain: domain });
      notification.style.animation = 'contextfort-slide-out 0.3s ease-out';
      setTimeout(() => {
        notification.remove();
        minimizedTab.remove();
      }, 300);
    };

    // "Restore My Session" button
    const restoreBtn = document.createElement('button');
    restoreBtn.textContent = "Restore My Session";
    restoreBtn.style.cssText = `
      flex: 1;
      padding: 12px 16px;
      background: #333;
      color: #fff;
      border: 1px solid #555;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    `;
    restoreBtn.onmouseover = () => restoreBtn.style.background = '#444';
    restoreBtn.onmouseout = () => restoreBtn.style.background = '#333';
    restoreBtn.onclick = () => {
      safeSendMessage({ type: 'RESTORE_BUTTON_CLICKED', domain: domain });
      notification.style.animation = 'contextfort-slide-out 0.3s ease-out';
      setTimeout(() => {
        notification.remove();
        minimizedTab.remove();
      }, 300);
    };

    buttons.appendChild(loginBtn);
    buttons.appendChild(restoreBtn);
  }

  notification.appendChild(header);
  notification.appendChild(message);
  notification.appendChild(buttons);

  document.body.appendChild(notification);
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


// MESSAGE LISTENER FOR NOTIFICATIONS AND SESSION ISOLATION
// ============================================================================
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SHOW_NOTIFICATION') {
    showInPageNotification(message.title, message.message, message.notificationType);
  }

  else if (message.type === 'SHOW_LOGIN_NOTIFICATION') {
    showLoginRequiredNotification(message.domain, message.phase || 1);
    sendResponse({ success: true });
    return true;
  }

  else if (message.type === 'START_AGENT_LISTENING') {
    startListening();
    sendResponse({ success: true });
    return true;
  }

  else if (message.type === 'STOP_AGENT_LISTENING') {
    stopListening();
    sendResponse({ success: true });
    return true;
  }
});
// ============================================================================