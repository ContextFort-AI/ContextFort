// Store all user input on the current page
console.log('[POST Monitor] Content script starting...');

let pageInputData = {};
// Track which fields user has actually typed in (using unique identifiers)
let userTypedFieldIdentifiers = new Set();

// Get whitelist from background
let whitelist = { urls: [], hostnames: [] };
chrome.storage.local.get(['whitelist'], (result) => {
  if (result.whitelist) {
    whitelist = result.whitelist;
    console.log('[Click Detection] Loaded whitelist:', whitelist);
  }
});

// Listen for whitelist updates
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.whitelist) {
    whitelist = changes.whitelist.newValue || { urls: [], hostnames: [] };
    console.log('[Click Detection] Whitelist updated:', whitelist);
  }
});

// Check if current page is whitelisted
function isCurrentPageWhitelisted() {
  const currentUrl = window.location.href;
  const currentHostname = window.location.hostname;

  // Check URL match
  if (whitelist.urls.some(url => currentUrl.includes(url))) {
    return true;
  }
  // Check hostname match
  if (whitelist.hostnames.some(hostname => currentHostname.includes(hostname))) {
    return true;
  }
  return false;
}

// Listen for alerts from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ALERT_DETECTED') {
    console.log('[POST Monitor] message received:', message);
    console.warn('[POST Monitor] 🚨 ALERT: Request detected!');
    console.warn('[POST Monitor] Classification:', message.classification);
    console.warn('[POST Monitor] Target:', message.url);
    console.warn('[POST Monitor] Method:', message.method);
    console.warn('[POST Monitor] Matched fields:', message.count);

    // ONLY show modal popup for BOT requests WITH user input data
    if (message.classification === 'BOT' && message.count > 0) {
      console.error('[POST Monitor] 🛑 BOT REQUEST WITH USER DATA BLOCKED!');
      showClickBlockingPopup();
    }
    // Show banner for requests with matched fields (human or bot)
    else if (message.count > 0) {
      showPageAlert(message);
    }
    // Otherwise, just log it (no visual alert)
    else {
      console.log('[POST Monitor] Request detected but no user input matched - no alert shown');
    }

    sendResponse({ success: true });
  }
  return true;
});

// Show a visual alert banner on the page
function showPageAlert(data) {
  // Remove any existing alert
  const existingAlert = document.getElementById('post-monitor-alert');
  if (existingAlert) {
    existingAlert.remove();
  }

  // Create alert banner
  const alert = document.createElement('div');
  alert.id = 'post-monitor-alert';
  alert.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #0a0a0a;
    border: 1px solid #f51f41;
    color: #ffffff;
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.6);
    z-index: 999999;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 14px;
    max-width: 400px;
    animation: slideInRight 200ms ease;
  `;

  alert.innerHTML = `
    <div style="display: flex; align-items: start; gap: 12px;">
      <div style="flex: 1;">
        <div style="font-weight: 600; margin-bottom: 8px; font-size: 15px; letter-spacing: -0.01em;">
          Suspicious POST Request Detected
        </div>
        <div style="margin-bottom: 8px; color: #cccccc; line-height: 1.5;">
          Request to <strong style="color: #ffffff;">${data.url}</strong> contains ${data.count} field(s):
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${data.matchedFields.map(field => `
            <span style="
              background: rgba(245, 31, 65, 0.1);
              border: 1px solid rgba(245, 31, 65, 0.3);
              color: #f51f41;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: 600;
              font-family: 'SF Mono', 'Monaco', monospace;
            ">${field}</span>
          `).join('')}
        </div>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" style="
        background: none;
        border: none;
        color: #888888;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
        transition: color 150ms ease;
      " onmouseover="this.style.color='#ffffff'" onmouseout="this.style.color='#888888'">×</button>
    </div>
  `;

  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(alert);

  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (alert.parentElement) {
      alert.style.opacity = '0';
      alert.style.transform = 'translateX(20px)';
      alert.style.transition = 'opacity 200ms ease, transform 200ms ease';
      setTimeout(() => alert.remove(), 200);
    }
  }, 10000);
}

// Get unique identifier for an input element
function getInputIdentifier(input) {
  // Use name, id, or create a stable identifier
  if (input.name) return `name:${input.name}`;
  if (input.id) return `id:${input.id}`;
  // For contenteditable or elements without name/id, use a path-based identifier
  const path = [];
  let elem = input;
  while (elem && elem !== document.body) {
    const tag = elem.tagName.toLowerCase();
    const index = Array.from(elem.parentNode?.children || []).indexOf(elem);
    path.unshift(`${tag}[${index}]`);
    elem = elem.parentNode;
  }
  return `path:${path.join('>')}`;
}

// Collect all input values from the page
// ONLY collect fields that the user has actually typed in
function collectAllInputs() {
  const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="tel"], input[type="url"], input:not([type]), textarea, [contenteditable="true"]');

  const data = {};
  inputs.forEach((input, index) => {
    const identifier = getInputIdentifier(input);

    // CRITICAL: Only include fields user has actually typed in
    if (!userTypedFieldIdentifiers.has(identifier)) {
      return; // Skip fields user never touched
    }

    let value = '';

    if (input.isContentEditable) {
      value = input.textContent || input.innerText;
    } else {
      value = input.value;
    }

    // Store non-empty values from user-typed fields only
    if (value && value.trim().length > 0) {
      const fieldName = input.name || input.id || input.placeholder || `field_${index}`;
      data[fieldName] = value.trim();
    }
  });

  return data;
}

// Update stored input data whenever user types
function updateInputData(element) {
  element.addEventListener('input', () => {
    // Mark this field as user-typed using its identifier
    const identifier = getInputIdentifier(element);
    userTypedFieldIdentifiers.add(identifier);
    console.log('[POST Monitor] User typed in field:', identifier);

    pageInputData = collectAllInputs();
    console.log('[POST Monitor] Updated input data:', Object.keys(pageInputData).length, 'user-typed fields');
  });

  element.addEventListener('change', () => {
    // Also track change events
    const identifier = getInputIdentifier(element);
    userTypedFieldIdentifiers.add(identifier);
    pageInputData = collectAllInputs();
  });
}

// Attach listeners to all input fields
function monitorInputFields() {
  const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="tel"], input[type="url"], input:not([type]), textarea, [contenteditable="true"]');

  inputs.forEach(input => {
    if (!input.dataset.postMonitorAttached) {
      updateInputData(input);
      input.dataset.postMonitorAttached = 'true';
    }
  });
}

// Watch for dynamically added input fields
const observer = new MutationObserver(() => {
  monitorInputFields();
});

// Check if an element is actionable (can trigger a POST request)
function isActionableElement(element) {
  if (!element) return false;

  const tagName = element.tagName ? element.tagName.toLowerCase() : '';
  const type = element.type ? element.type.toLowerCase() : '';
  console.log('[POST Monitor] Checking if element is actionable:', tagName, type);
  // Direct actionable elements
  if (tagName === 'button') return true;
  if (tagName === 'a') return true;
  if (tagName === 'input' && (type === 'submit' || type === 'button')) return true;
  if (element.onclick || element.getAttribute('onclick')) return true;
  if (element.role === 'button') return true;

  // Check if element or parent is a form element
  if (element.closest('form')) return true;

  // Check if element has click handlers or is interactive
  const computedCursor = window.getComputedStyle(element).cursor;
  if (computedCursor === 'pointer') return true;

  return false;
}

// Listen for clicks anywhere on the page
document.addEventListener('click', (event) => {
  const clickedElement = event.target;

  // Check if the click was on an actionable element
  const isActionable = isActionableElement(clickedElement);

  // Collect all current input values
  const currentInputs = collectAllInputs();

  if (Object.keys(currentInputs).length > 0 && isActionable) {
    console.log('[POST Monitor] ✓ User clicked ACTIONABLE element:', clickedElement.tagName, clickedElement.className);
    console.log('[POST Monitor] ✓ Input fields detected:', Object.keys(currentInputs).length);
    console.log('[POST Monitor] ✓ Starting POST request monitoring for next 2 seconds...');

    // Send to background script to monitor POST requests
    try {
      chrome.runtime.sendMessage({
        type: 'CLICK_WITH_INPUT',
        inputs: currentInputs,
        url: window.location.href,
        timestamp: Date.now(),
        isUserAction: true,
        clickedElement: {
          tag: clickedElement.tagName,
          id: clickedElement.id,
          className: clickedElement.className,
          text: clickedElement.textContent?.substring(0, 50)
        }
      }).catch(err => {
        if (err.message.includes('Extension context invalidated')) {
          console.error('[POST Monitor] ⚠️ Extension was reloaded. Please REFRESH THIS PAGE to reconnect.');
          alert('POST Monitor: Extension was reloaded. Please refresh this page.');
        } else {
          console.error('[POST Monitor] Could not send message:', err);
        }
      });
    } catch (err) {
      if (err.message.includes('Extension context invalidated')) {
        console.error('[POST Monitor] ⚠️ Extension was reloaded. Please REFRESH THIS PAGE to reconnect.');
        alert('POST Monitor: Extension was reloaded. Please refresh this page.');
      } else {
        console.error('[POST Monitor] Error:', err);
      }
    }
  } else if (Object.keys(currentInputs).length > 0 && !isActionable) {
    console.log('[POST Monitor] Click detected but not on actionable element, ignoring');
  }
}, true); // Use capture phase to catch all clicks

// Initialize the extension once DOM is ready
function initialize() {
  // Initial scan for input fields
  monitorInputFields();

  // Collect initial data
  pageInputData = collectAllInputs();

  // Start observing the document for changes
  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  console.log('[POST Monitor] Content script initialized - monitoring', document.querySelectorAll('input, textarea').length, 'input fields');
  console.log('[POST Monitor] Click on buttons, links, or forms to monitor user-triggered POST requests');
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  console.log('[POST Monitor] Waiting for DOMContentLoaded...');
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  // DOM is already loaded
  console.log('[POST Monitor] DOM already loaded, initializing immediately...');
  initialize();
}

// ===== CLICK DETECTION FEATURE =====

let clickDetectionEnabled = false;

console.log('[Click Detection] Feature initialized');

// Auto-enable click detection if it's enabled globally
chrome.storage.local.get(['clickDetectionEnabled'], (result) => {
  const isGloballyEnabled = result.clickDetectionEnabled || false;
  if (isGloballyEnabled) {
    console.log('[Click Detection] Auto-enabling from global state');
    enableClickDetection();
  }
});

/**
 * Detect if we're in an email compose window
 */
function isEmailCompose() {
  const url = window.location.href.toLowerCase();
  const title = document.title.toLowerCase();

  if (url.includes('mail.google.com') && url.includes('compose')) return true;
  if ((url.includes('outlook.live.com') || url.includes('outlook.office.com')) &&
      (url.includes('compose') || title.includes('compose'))) return true;
  if (url.includes('mail.yahoo.com') && url.includes('compose')) return true;
  if (title.includes('compose') || title.includes('new message') || title.includes('draft')) return true;

  return false;
}

/**
 * Detect if target is an email send button
 */
function isEmailSendButton(target) {
  if (!target) return false;

  const text = (target.textContent || target.value || '').toLowerCase();
  const ariaLabel = (target.getAttribute('aria-label') || '').toLowerCase();
  const dataAction = (target.getAttribute('data-action') || '').toLowerCase();
  const className = (target.className || '').toLowerCase();

  const sendPatterns = ['send', 'enviar', 'envoyer', 'senden', 'submit', 'post'];

  return sendPatterns.some(pattern =>
    text.includes(pattern) || ariaLabel.includes(pattern) ||
    dataAction.includes(pattern) || className.includes(pattern)
  );
}

/**
 * Show blocking popup for suspicious email send
 */
function showClickBlockingPopup() {
  const existing = document.getElementById('click-blocking-popup');
  if (existing) existing.remove();

  const popup = document.createElement('div');
  popup.id = 'click-blocking-popup';
  popup.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #ff4757 0%, #ff6348 100%);
    color: white;
    padding: 30px 40px;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(255, 71, 87, 0.5);
    z-index: 999999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    min-width: 400px;
    animation: popupSlideIn 0.3s ease-out;
  `;

  popup.innerHTML = `
    <div style="text-align: center;">
      <div style="font-size: 3rem; margin-bottom: 15px;">🛑</div>
      <div style="font-size: 1.5rem; font-weight: 700; margin-bottom: 10px;">
        SUSPICIOUS ACTIVITY BLOCKED
      </div>
      <div style="font-size: 1rem; margin-bottom: 20px; opacity: 0.9;">
        This automated action can lead to data exfiltration
      </div>
      <div style="font-size: 0.85rem; margin-bottom: 20px; padding: 12px; background: rgba(0, 0, 0, 0.2); border-radius: 8px;">
        ⚠️ If this was a legitimate action, please try clicking again manually.
      </div>
      <button id="click-popup-close" style="
        background: white;
        color: #ff4757;
        border: none;
        padding: 12px 30px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;
        transition: transform 0.2s;
      ">
        OK, I Understand
      </button>
    </div>
  `;

  if (!document.getElementById('click-popup-styles')) {
    const style = document.createElement('style');
    style.id = 'click-popup-styles';
    style.textContent = `
      @keyframes popupSlideIn {
        from {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.8);
        }
        to {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
      }
      #click-popup-close:hover {
        transform: scale(1.05);
      }
      #click-blocking-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 999999998;
        animation: fadeIn 0.3s ease-out;
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  const overlay = document.createElement('div');
  overlay.id = 'click-blocking-overlay';
  document.body.appendChild(overlay);
  document.body.appendChild(popup);

  document.getElementById('click-popup-close').addEventListener('click', () => {
    popup.remove();
    overlay.remove();
  });

  setTimeout(() => {
    if (document.getElementById('click-blocking-popup')) {
      popup.remove();
      overlay.remove();
    }
  }, 10000);

  playClickBlockSound();
}

/**
 * Save blocked action to storage
 * Returns true if action was saved (has user input), false otherwise
 */
async function saveBlockedAction(target, event) {
  try {
    // Collect all input data from the page
    const inputData = collectAllInputs();

    // Get matched fields (fields with user input)
    const matchedFields = Object.keys(inputData);

    // Only save if there are matched input fields
    if (matchedFields.length === 0) {
      console.log('[Click Detection] No user input data - blocking silently without popup');
      return false;
    }

    // Build blocked request data
    const blockedData = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      target_url: window.location.href,
      target_hostname: window.location.hostname,
      source_url: window.location.href,
      matched_fields: matchedFields,
      matched_values: inputData,
      request_method: 'POST', // Assumed for blocked form submission
      status: 'blocked',
      has_click_correlation: true,
      is_bot: true,
      click_correlation_id: Date.now(),
      click_time_diff_ms: 0,
      click_coordinates: { x: event.clientX, y: event.clientY },
      blocked_by: 'content_script', // Indicate this was blocked before POST
      element_type: target.tagName,
      element_classes: target.className,
      element_text: target.textContent?.substring(0, 50) || ''
    };

    console.log('[Click Detection] 💾 Saving blocked action to storage:', blockedData);

    // Save to Chrome local storage
    const result = await chrome.storage.local.get(['blockedRequests']);
    let requests = result.blockedRequests || [];

    // Add new request to the beginning
    requests.unshift(blockedData);

    // Keep only last 1000 requests
    if (requests.length > 1000) {
      requests = requests.slice(0, 1000);
    }

    await chrome.storage.local.set({ blockedRequests: requests });
    console.log('[Click Detection] ✓✓ Blocked action saved! Total requests:', requests.length);

    return true; // Successfully saved

  } catch (error) {
    console.error('[Click Detection] Error saving blocked action:', error);
    return false; // Failed to save
  }
}

/**
 * Play blocking sound
 */
function playClickBlockSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);

    setTimeout(() => {
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      osc2.connect(gain2);
      gain2.connect(audioContext.destination);
      osc2.frequency.value = 600;
      osc2.type = 'sine';
      gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      osc2.start(audioContext.currentTime);
      osc2.stop(audioContext.currentTime + 0.3);
    }, 200);
  } catch (e) {
    console.error('[Click Detection] Audio error:', e);
  }
}

/**
 * Show visual warning for suspicious clicks
 */
function showSuspiciousClickWarning(x, y) {
  const warning = document.createElement('div');
  warning.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    width: 40px;
    height: 40px;
    border: 3px solid red;
    border-radius: 50%;
    pointer-events: none;
    z-index: 999999;
    animation: pulse-warning 0.6s ease-out;
  `;

  if (!document.getElementById('click-warning-styles')) {
    const style = document.createElement('style');
    style.id = 'click-warning-styles';
    style.textContent = `
      @keyframes pulse-warning {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        100% {
          transform: scale(2);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(warning);
  setTimeout(() => warning.remove(), 600);
}

/**
 * Enable click detection
 */
function enableClickDetection() {
  if (clickDetectionEnabled) {
    console.log('[Click Detection] Already enabled');
    return;
  }

  console.log('[Click Detection] Enabling click detection');
  clickDetectionEnabled = true;

  document.addEventListener('click', handleClickDetection, true);
  console.log('[Click Detection] Monitoring active - Email protection enabled');
}

/**
 * Disable click detection
 */
function disableClickDetection() {
  console.log('[Click Detection] Disabling click detection');
  clickDetectionEnabled = false;
  document.removeEventListener('click', handleClickDetection, true);
}

// Track clicks we've already processed to avoid re-checking
const processedClicks = new WeakSet();

/**
 * Handle click events for detection
 */
async function handleClickDetection(event) {
  if (!clickDetectionEnabled) return;

  // Skip if this click was already processed (re-triggered by us)
  if (processedClicks.has(event)) {
    console.log('[Click Detection] Skipping already-processed click');
    return;
  }

  const timestamp = Date.now() / 1000;
  const target = event.target.closest('a, button, input[type="submit"], input[type="button"], [role="button"]') || event.target;

  let actionType = 'click';
  let actionDetails = {};

  if (target.tagName === 'A') {
    actionType = 'navigation';
    actionDetails = {
      href: target.href,
      linkText: target.textContent.trim().substring(0, 100),
      isExternal: target.hostname !== window.location.hostname
    };
  } else if (target.tagName === 'BUTTON' || target.type === 'submit' || target.type === 'button') {
    actionType = 'button';
    actionDetails = {
      buttonText: target.textContent.trim().substring(0, 100) || target.value,
      buttonType: target.type
    };
  } else if (target.tagName === 'INPUT') {
    actionType = 'input';
    actionDetails = {
      inputType: target.type,
      inputName: target.name
    };
  }

  const isEmailSend = isEmailCompose() && isEmailSendButton(target);

  // Check if this is ANY actionable element (button, submit, etc.)
  const isActionableElement =
    target.tagName === 'BUTTON' ||
    target.type === 'submit' ||
    target.role === 'button' ||
    target.closest('button') !== null ||
    target.closest('[role="button"]') !== null ||
    isEmailSend;

  // Check if current page is whitelisted
  if (isCurrentPageWhitelisted()) {
    console.log('[Click Detection] ✅ Page is WHITELISTED - allowing all actions');
    return; // Don't block anything on whitelisted pages
  }

  // Check if there's user input data FIRST before deciding to block
  const currentInputs = collectAllInputs();
  const hasUserInput = Object.keys(currentInputs).length > 0;
  console.log('[Click Detection] User input check:', {
    hasUserInput,
    inputFieldCount: Object.keys(currentInputs).length,
    userTypedFieldsTracked: userTypedFieldIdentifiers.size,
    inputFields: Object.keys(currentInputs)
  });

  // ONLY intercept actionable elements that have user input data
  // Don't block random clicks like "Compose" button - only block when user data is at risk
  if (isActionableElement && hasUserInput) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    console.log('[Click Detection] Actionable element with user input intercepted - checking for suspicious activity...');

    // Notify background script to monitor for POST requests
    console.log('[Click Detection] Notifying background of', Object.keys(currentInputs).length, 'input fields');
    chrome.runtime.sendMessage({
      type: 'CLICK_WITH_INPUT',
      inputs: currentInputs,
      url: window.location.href,
      timestamp: Date.now(),
      isUserAction: true,
      clickedElement: {
        tag: target.tagName,
        id: target.id,
        className: target.className
      }
    }).catch(err => console.log('[Click Detection] Could not send to background:', err));
  } else if (isActionableElement && !hasUserInput) {
    console.log('[Click Detection] Actionable element clicked but no user input - allowing without check');
    // Let it proceed normally - no user data at risk
    return;
  }

  const clickData = {
    x: event.clientX,
    y: event.clientY,
    timestamp: timestamp,
    isTrusted: event.isTrusted,
    target: {
      tagName: target.tagName,
      id: target.id,
      className: target.className
    },
    action: {
      type: actionType,
      details: actionDetails
    },
    page: {
      url: window.location.href,
      title: document.title
    }
  };

  console.log('[Click Detection] Click detected:', clickData);

  // Only check for bot/human if there's user input (already checked above)
  if (!hasUserInput) {
    // No user input - nothing to check or block
    return;
  }

  try {
    // Send click data to background script to check if bot or human
    const result = await chrome.runtime.sendMessage({
      type: 'SEND_CLICK_TO_API',
      clickData: {
        x: clickData.x,
        y: clickData.y,
        timestamp: clickData.timestamp,
        action_type: clickData.action.type,
        action_details: JSON.stringify(clickData.action.details),
        page_url: clickData.page.url,
        page_title: clickData.page.title,
        target_tag: clickData.target.tagName,
        target_id: clickData.target.id,
        target_class: clickData.target.className,
        is_trusted: clickData.isTrusted
      }
    });

    if (result && result.is_suspicious) {
      console.warn('[Click Detection] ⚠️ SUSPICIOUS CLICK DETECTED!', result);

      if (isActionableElement && hasUserInput) {
        console.error('[Click Detection] 🛑 ACTION BLOCKED - Suspicious activity detected!');
        // Note: Already called stopPropagation() earlier to block Gmail handlers

        // Save the blocked action to storage
        await saveBlockedAction(target, event);

        // Show popup since we know there's user input
        showClickBlockingPopup();

        return false;
      }

      showSuspiciousClickWarning(event.clientX, event.clientY);
    } else {
      console.log('[Click Detection] ✓ Click verified as legitimate');

      // If it's an actionable element with user input and it was legitimate, allow it to proceed
      if (isActionableElement && hasUserInput) {
        console.log('[Click Detection] ✅ Action allowed - re-dispatching click event');

        // Create a new click event with the same properties
        const newClickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: event.clientX,
          clientY: event.clientY,
          screenX: event.screenX,
          screenY: event.screenY,
          ctrlKey: event.ctrlKey,
          shiftKey: event.shiftKey,
          altKey: event.altKey,
          metaKey: event.metaKey,
          button: event.button,
          buttons: event.buttons
        });

        // Mark this new event as already processed so we don't intercept it again
        processedClicks.add(newClickEvent);

        console.log('[Click Detection] Dispatching new click event to allow natural submission');

        // Dispatch the new event on the target after a tiny delay
        setTimeout(() => {
          target.dispatchEvent(newClickEvent);
        }, 10);
      }
    }
  } catch (error) {
    console.error('[Click Detection] Failed to send click:', error);
  }
}

// Listen for click detection toggle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TOGGLE_CLICK_DETECTION') {
    console.log('[Click Detection] Toggle click detection:', message.enabled);
    if (message.enabled) {
      enableClickDetection();
    } else {
      disableClickDetection();
    }
    sendResponse({ success: true });
  }
  else if (message.type === 'CENSOR_CONTENT') {
    console.log('[Content Censor] Received CENSOR_CONTENT message');
    censorContent();
    sendResponse({ success: true });
  }
  else if (message.type === 'UNCENSOR_CONTENT') {
    console.log('[Content Censor] Received UNCENSOR_CONTENT message');
    uncensorContent();
    sendResponse({ success: true });
  }
  return true;
});

// ===== END CLICK DETECTION FEATURE =====

// ============================================================================
// CONTENT CENSORING - Hides sensitive content when agent mode is active
// ============================================================================

console.log('[Content Censor] Content script loaded');

// Load sensitive words from storage
let sensitiveWords = ['password', 'secret', 'token', 'api_key', 'credential', 'private'];
let isCensored = false;
const censoredElements = new Set();
let mutationObserver = null;

// Load custom sensitive words from storage
chrome.storage.local.get(['sensitiveWords'], (result) => {
  if (result.sensitiveWords && result.sensitiveWords.length > 0) {
    sensitiveWords = result.sensitiveWords;
    console.log('[Content Censor] Loaded custom sensitive words:', sensitiveWords);
  } else {
    console.log('[Content Censor] Using default sensitive words:', sensitiveWords);
  }
});

function containsSensitiveData(text) {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return sensitiveWords.some(word => lowerText.includes(word.toLowerCase()));
}

function redactText(text) {
  let redacted = text;
  sensitiveWords.forEach(word => {
    const regex = new RegExp(word, 'gi'); // Case insensitive, global
    redacted = redacted.replace(regex, '[REDACTED]');
  });
  return redacted;
}

function getAllTextNodes(element) {
  const textNodes = [];
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null
  );

  let node;
  while (node = walker.nextNode()) {
    if (node.textContent.trim()) {
      textNodes.push(node);
    }
  }

  return textNodes;
}

function censorElement(element) {
  // Skip if already censored
  if (censoredElements.has(element)) return false;

  // Skip script and style tags
  if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') {
    return false;
  }

  let wasCensored = false;

  // Handle input/textarea values
  if ((element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') && element.value) {
    if (containsSensitiveData(element.value)) {
      element.dataset.originalValue = element.value;
      element.value = redactText(element.value);
      censoredElements.add(element);
      console.log('[Content Censor] Redacted input value');
      wasCensored = true;
    }
  }

  // Handle all text nodes within element (recursively)
  const textNodes = getAllTextNodes(element);

  if (textNodes.length > 0) {
    textNodes.forEach(textNode => {
      if (containsSensitiveData(textNode.textContent)) {
        // Store original HTML on the parent element
        const parentElement = textNode.parentElement;
        if (parentElement && !parentElement.dataset.originalText) {
          parentElement.dataset.originalText = parentElement.innerHTML;
          censoredElements.add(parentElement);
        }

        textNode.textContent = redactText(textNode.textContent);
        console.log('[Content Censor] Redacted text');
        wasCensored = true;
      }
    });
  }

  return wasCensored;
}

function censorContent() {
  if (isCensored) {
    console.log('[Content Censor] Already censored, skipping');
    return;
  }

  console.log('[Content Censor] 🔴 CENSORING CONTENT - Hiding sensitive information');

  // Censor all existing elements
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_ELEMENT,
    null
  );

  let node;
  while (node = walker.nextNode()) {
    censorElement(node);
  }

  isCensored = true;
  console.log(`[Content Censor] ✓ Censored ${censoredElements.size} elements`);

  // Start watching for new elements
  startContinuousCensoring();
}

function startContinuousCensoring() {
  if (mutationObserver) return; // Already observing

  console.log('[Content Censor] Started continuous monitoring for new elements');

  mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      // Check added nodes
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Censor the added element
          censorElement(node);

          // Censor all children of the added element
          const walker = document.createTreeWalker(
            node,
            NodeFilter.SHOW_ELEMENT,
            null
          );

          let childNode;
          while (childNode = walker.nextNode()) {
            censorElement(childNode);
          }
        }
      });

      // Check for attribute/text changes in existing elements
      if (mutation.type === 'characterData' || mutation.type === 'attributes') {
        const element = mutation.target.nodeType === Node.ELEMENT_NODE
          ? mutation.target
          : mutation.target.parentElement;

        if (element) {
          censorElement(element);
        }
      }
    });
  });

  mutationObserver.observe(document.body, {
    childList: true,      // Watch for added/removed nodes
    subtree: true,        // Watch entire tree
    attributes: true,     // Watch attribute changes
    characterData: true,  // Watch text changes
    attributeOldValue: false,
    characterDataOldValue: false
  });
}

function stopContinuousCensoring() {
  if (mutationObserver) {
    mutationObserver.disconnect();
    mutationObserver = null;
    console.log('[Content Censor] Stopped continuous monitoring');
  }
}

function uncensorContent() {
  if (!isCensored) {
    console.log('[Content Censor] Not censored, skipping');
    return;
  }

  console.log('[Content Censor] 🟢 UNCENSORING CONTENT - Restoring sensitive information');

  // Stop monitoring for new elements
  stopContinuousCensoring();

  censoredElements.forEach(element => {
    // Restore original text
    if (element.dataset.originalText !== undefined) {
      element.innerHTML = element.dataset.originalText;
      delete element.dataset.originalText;
    }

    // Restore original input value
    if (element.dataset.originalValue !== undefined) {
      element.value = element.dataset.originalValue;
      delete element.dataset.originalValue;
    }
  });

  censoredElements.clear();
  isCensored = false;
  console.log('[Content Censor] ✓ Content restored');
}

console.log('[Content Censor] Ready - will censor on agent mode detection');

// ===== END CONTENT CENSORING FEATURE =====

// ============================================================================
// SCREENSHOT LOGGER - Captures screenshots on DOM changes and scrolling
// ============================================================================

console.log('[Screenshot Logger] Content script loaded');

let mutationTimeout;
let scrollTimeout;
let lastScreenshotTime = 0;
const MIN_SCREENSHOT_INTERVAL = 1000; // Don't take screenshots more than once per second

function captureScreenshot(reason) {
  const now = Date.now();

  // Throttle screenshots
  if (now - lastScreenshotTime < MIN_SCREENSHOT_INTERVAL) {
    console.log(`[Screenshot Logger] Throttled (${reason})`);
    return;
  }

  lastScreenshotTime = now;

  console.log(`[Screenshot Logger] Requesting screenshot: ${reason}`);

  chrome.runtime.sendMessage({
    type: 'CAPTURE_SCREENSHOT',
    reason: reason
  }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('[Screenshot Logger] Error:', chrome.runtime.lastError.message);
    } else if (response?.success) {
      console.log(`[Screenshot Logger] ✅ Screenshot captured: ${reason}`);
    }
  });
}

// Watch for DOM changes
const screenshotObserver = new MutationObserver((mutations) => {
  clearTimeout(mutationTimeout);

  mutationTimeout = setTimeout(() => {
    const mutationTypes = mutations.map(m => m.type).join(', ');
    console.log(`[Screenshot Logger] DOM changed: ${mutations.length} mutations (${mutationTypes})`);
    captureScreenshot(`dom_change (${mutations.length} mutations)`);
  }, 500); // Debounce 500ms
});

// Start observing after page loads
function startScreenshotObserving() {
  screenshotObserver.observe(document.body, {
    childList: true,      // Detect added/removed nodes
    subtree: true,        // Watch entire tree
    attributes: true,     // Detect attribute changes
    characterData: true   // Detect text changes
  });

  console.log('[Screenshot Logger] Started observing DOM changes');
}

// Watch for scrolling
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);

  scrollTimeout = setTimeout(() => {
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    console.log(`[Screenshot Logger] Scrolled to: (${scrollX}, ${scrollY})`);
    captureScreenshot(`scroll (x:${scrollX}, y:${scrollY})`);
  }, 500); // Debounce 500ms
}, { passive: true });

// Initialize screenshot observer
if (document.body) {
  startScreenshotObserving();
} else {
  window.addEventListener('DOMContentLoaded', startScreenshotObserving);
}

console.log('[Screenshot Logger] Ready - monitoring DOM changes and scrolling');

// ===== END SCREENSHOT LOGGER FEATURE =====
