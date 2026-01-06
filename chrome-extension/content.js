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

let blockedElements = [];

// Scroll debouncing
let scrollDebounceTimer = null;
const SCROLL_DEBOUNCE_MS = 300;
let lastScrollPosition = window.scrollY;

// Load blocked actions from storage on initialization
(async () => {
  const result = await chrome.storage.local.get(['blockedActions']);
  if (result.blockedActions) {
    blockedElements = result.blockedActions;
  }
})();

// Listen for storage changes to update blockedElements when dashboard changes
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.blockedActions) {
    blockedElements = changes.blockedActions.newValue || [];
  }
});


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
      coordinates: {
        x: e.clientX * window.devicePixelRatio,         // Convert CSS pixels to physical pixels
        y: e.clientY * window.devicePixelRatio
      },
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
      coordinates: {
        x: e.clientX * window.devicePixelRatio,         // Convert CSS pixels to physical pixels
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
        x: e.clientX * window.devicePixelRatio,         // Convert CSS pixels to physical pixels
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
    const currentScroll = window.scrollY;
    const scrollDistance = Math.abs(currentScroll - lastScrollPosition);

    // Ignore small shifts (< 50px) - filters out layout shifts from debugger notifications, ads, etc.
    if (scrollDistance < 50) {
      return;
    }

    lastScrollPosition = currentScroll;

    // Clear existing debounce timer
    if (scrollDebounceTimer) {
      clearTimeout(scrollDebounceTimer);
    }

    // Set new debounce timer - only send after scrolling stops for 300ms
    scrollDebounceTimer = setTimeout(() => {
      safeSendMessage({
        type: 'SCREENSHOT_TRIGGER',
        action: 'scroll',
        eventType: 'navigation',
        element: null,
        coordinates: null,
        url: window.location.href,
        title: document.title
      });
      scrollDebounceTimer = null;
    }, SCROLL_DEBOUNCE_MS);
  }
}

function startListening() {
  if (agentModeActive) {
    return;
  }
  agentModeActive = true;
  // Add blocking listeners FIRST (before capture listeners)
  document.addEventListener('click', onBlockedElementClick, true);
  document.addEventListener('input', onBlockedElementInput, true);
  // Then add capture listeners (no change/scroll events)
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
  // Remove in reverse order
  document.removeEventListener('input', onInputCapture, true);
  document.removeEventListener('contextmenu', onContextMenuCapture, true);
  document.removeEventListener('dblclick', onDblClickCapture, true);
  document.removeEventListener('click', onClickCapture, true);
  document.removeEventListener('input', onBlockedElementInput, true);
  document.removeEventListener('click', onBlockedElementClick, true);
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
    setTimeout(() => {
      if (!document.getElementById('claude-agent-glow-border') && agentModeActive) {
        // Glow didn't reappear - agent stopped while we were away
        safeSendMessage({ type: 'AGENT_STOPPED' });
        stopListening();
      } else {
      }
    }, 500);
  }
});

// ============================================================================
// BLOCKED ELEMENT CLICK PREVENTION

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

// Check if click should be blocked
function shouldBlockClick(element) {
  const currentUrl = window.location.href;
  const currentTitle = document.title;

  // Check element and all its parents
  let currentElement = element;
  while (currentElement && currentElement !== document.body) {
    for (const blockedMeta of blockedElements) {
      // Check if actionType is click
      if (blockedMeta.actionType !== 'click') {
        continue;
      }

      // Check if URL and title match
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

// Check if input should be blocked
function shouldBlockInput(element) {
  const currentUrl = window.location.href;
  const currentTitle = document.title;

  // Check element and all its parents
  let currentElement = element;
  while (currentElement && currentElement !== document.body) {
    for (const blockedMeta of blockedElements) {
      // Check if actionType is input or change
      if (blockedMeta.actionType !== 'input' && blockedMeta.actionType !== 'change') {
        continue;
      }

      // Check if URL and title match
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


    // Visual feedback
    showBlockedFeedback(e.target);

    return false;
  }
}

function onBlockedElementInput(e) {
  if (shouldBlockInput(e.target)) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    // Visual feedback
    showBlockedFeedback(e.target);

    return false;
  }
}


// ============================================================================
// USER AUTH FUNCTIONS (from auth.js)

function authSendMessage(action, data = {}) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action, ...data }, resolve);
    });
}


async function handleEmailSubmit() {
    const email = emailInput.value.trim();

    if (!email) {
        showStatus('Please enter your email', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showStatus('Please enter a valid email', 'error');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';

    const result = await authSendMessage('login', { email });

    submitBtn.disabled = false;
    submitBtn.textContent = 'Continue';

    if (result.success) {
        if (result.requiresOTP) {
            showOTPSection();
            showStatus(result.message, 'success');
        } else {
            showDashboard();
            showStatus('Login successful!', 'success');
        }
    } else {
        showStatus(result.error, 'error');
    }
}

async function handleOTPVerify() {
    const result = await chrome.storage.local.get('userEmail');
    const email = result.userEmail;
    const otpCode = otpInput.value.trim();

    if (!otpCode || otpCode.length !== 6) {
        showStatus('Please enter a valid 6-digit OTP', 'error');
        return;
    }

    verifyBtn.disabled = true;
    verifyBtn.textContent = 'Verifying...';

    const verifyResult = await authSendMessage('verifyOTP', { email, otpCode });

    verifyBtn.disabled = false;
    verifyBtn.textContent = 'Verify OTP';

    if (verifyResult.success) {
        showDashboard();
        showStatus('Email verified successfully!', 'success');
    } else {
        showStatus(verifyResult.error, 'error');
    }
}

async function handleResendOTP() {
    const result = await chrome.storage.local.get('userEmail');
    const email = result.userEmail;

    resendBtn.disabled = true;
    resendBtn.textContent = 'Sending...';

    const resendResult = await authSendMessage('resendOTP', { email });

    resendBtn.disabled = false;
    resendBtn.textContent = 'Resend OTP';

    if (resendResult.success) {
        showStatus(resendResult.message, 'success');
    } else {
        showStatus(resendResult.error, 'error');
    }
}

async function handleLogout() {
    const result = await authSendMessage('logout');
    
    if (result.success) {
        showEmailSection();
        showStatus('Logged out successfully', 'success');
    }
}

function showEmailSection() {
}

function showOTPSection() {
}

function showDashboard() {

}


function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
