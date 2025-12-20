// Store all user input on the current page
console.log('[POST Monitor] Content script starting...');

let pageInputData = {};

// Listen for alerts from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ALERT_DETECTED') {
    console.warn('[POST Monitor] 🚨 ALERT: POST request detected with your data!');
    console.warn('[POST Monitor] Target:', message.url);
    console.warn('[POST Monitor] Matched fields:', message.matchedFields.join(', '));

    // Show visual alert on page
    showPageAlert(message);
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
    background: #ff5252;
    color: white;
    padding: 20px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    max-width: 400px;
    animation: slideIn 0.3s ease-out;
  `;

  alert.innerHTML = `
    <div style="display: flex; align-items: start; gap: 12px;">
      <div style="font-size: 24px;">⚠️</div>
      <div style="flex: 1;">
        <div style="font-weight: bold; margin-bottom: 8px; font-size: 16px;">
          Suspicious POST Request Detected!
        </div>
        <div style="margin-bottom: 6px;">
          Request to <strong>${data.url}</strong> contains ${data.count} field(s) from your input:
        </div>
        <div style="background: rgba(0,0,0,0.2); padding: 8px; border-radius: 4px; font-family: monospace; font-size: 12px;">
          ${data.matchedFields.join(', ')}
        </div>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" style="
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
        opacity: 0.7;
      ">×</button>
    </div>
  `;

  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(alert);

  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (alert.parentElement) {
      alert.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => alert.remove(), 300);
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
