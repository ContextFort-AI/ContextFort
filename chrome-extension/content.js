// Store all user input on the current page
console.log('[POST Monitor] Content script starting...');

let pageInputData = {};

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

// Collect all input values from the page
function collectAllInputs() {
  const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="tel"], input[type="url"], input:not([type]), textarea, [contenteditable="true"]');

  const data = {};
  inputs.forEach((input, index) => {
    let value = '';

    if (input.isContentEditable) {
      value = input.textContent || input.innerText;
    } else {
      value = input.value;
    }

    // Store non-empty values
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
    pageInputData = collectAllInputs();
    console.log('[POST Monitor] Updated input data:', Object.keys(pageInputData).length, 'fields');
  });

  element.addEventListener('change', () => {
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

/**
 * Handle click events for detection
 */
async function handleClickDetection(event) {
  if (!clickDetectionEnabled) return;

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

  try {
    // Send click data to background script to avoid per-site local network permission prompts
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

      if (isEmailSend) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        console.error('[Click Detection] 🛑 EMAIL SEND BLOCKED - Suspicious activity detected!');
        showClickBlockingPopup();

        return false;
      }

      showSuspiciousClickWarning(event.clientX, event.clientY);
    } else {
      console.log('[Click Detection] ✓ Click verified as legitimate');
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
  return true;
});

// ===== END CLICK DETECTION FEATURE =====
