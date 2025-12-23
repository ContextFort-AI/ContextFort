// Store all user input on the current page
console.log('[POST Monitor] Content script starting...');

let pageInputData = {};

// Listen for alerts from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ALERT_DETECTED') {
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
  // NEW: Handle auto-blur toggle messages
  else if (message.type === 'TOGGLE_BLUR') {
    console.log('[Text Blur] Toggle auto-blur:', message.enabled);
    if (message.enabled) {
      enableAutoBlur(message.words);
    } else {
      disableAutoBlur();
    }
    sendResponse({ success: true });
  }
  // NEW: Handle test screenshot request
  else if (message.type === 'TEST_SCREENSHOT') {
    console.log('[Screenshot] Test screenshot requested');
    takeTestScreenshot().then(result => {
      sendResponse(result);
    }).catch(error => {
      sendResponse({ success: false, error: error.message });
    });
    return true; // Keep message channel open for async response
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

// ===== AUTO-BLUR ON SCREENSHOT FEATURE =====

// Store auto-blur state
let autoBlurEnabled = false;
let isCurrentlyBlurred = false;
let blurredElements = []; // Track elements we've modified
let autoBlurWords = ['Rishabh', 'Arya']; // Store words for auto-blur
let listenerSetup = false; // Track if message listener is already setup

// Page context script now injected via manifest.json with world: 'MAIN'
// This bypasses CSP restrictions and content script isolation

/**
 * Listen for messages from page context script
 */
function setupPageContextListener() {
  if (listenerSetup) {
    console.log('[Auto-Blur] Message listener already setup, skipping');
    return;
  }

  console.log('[Auto-Blur] Setting up page context message listener...');

  window.addEventListener('message', async (event) => {
    // Debug: log all messages
    if (event.data && event.data.type && event.data.type.includes('AUTO_BLUR')) {
      console.log('[Auto-Blur] Received message:', event.data.type, 'from:', event.data.source, 'autoBlurEnabled:', autoBlurEnabled);
    }

    // Only accept messages from same origin and our page script
    if (event.source !== window || !event.data || event.data.source !== 'auto-blur-page-script') {
      return;
    }

    if (event.data.type === 'AUTO_BLUR_SCREENSHOT_START') {
      console.log('[Auto-Blur] 📸 Screenshot detected! Applying blur...');

      if (autoBlurEnabled) {
        console.log('[Auto-Blur] 🔒 Calling applyBlur with words:', autoBlurWords);
        applyBlur(autoBlurWords);
        showAutoBlurIndicator('📸 Screenshot in progress');

        // Force reflow to ensure CSS filter is applied
        document.body.offsetHeight;

        // Wait longer for blur CSS filter to fully render
        await new Promise(resolve => setTimeout(resolve, 150));

        // Force another reflow
        document.body.offsetHeight;

        console.log('[Auto-Blur] ✅ Blur applied and rendered (after 150ms)');
      } else {
        console.log('[Auto-Blur] ⚠️ Auto-blur is disabled, skipping blur');
      }

      // Tell page context we're ready
      window.postMessage({
        type: 'AUTO_BLUR_READY',
        source: 'auto-blur-content-script'
      }, '*');

    } else if (event.data.type === 'AUTO_BLUR_SCREENSHOT_END') {
      console.log('[Auto-Blur] 📸 Screenshot complete! Removing blur...');

      if (autoBlurEnabled) {
        removeBlur();
        console.log('[Auto-Blur] ✅ Blur removed');
      }
    }
  });

  listenerSetup = true;
  console.log('[Auto-Blur] Message listener ready');
}

// Old wrapper functions removed - now using page context injection

/**
 * Intercept canvas operations for DevTools screenshots
 */
function interceptCanvasForDevTools() {
  const originalGetContext = HTMLCanvasElement.prototype.getContext;

  HTMLCanvasElement.prototype.getContext = function(...args) {
    if (autoBlurEnabled) {
      // Check if this is a large canvas (likely screenshot)
      const isScreenshotCanvas = this.width >= 800 && this.height >= 600;

      if (isScreenshotCanvas) {
        console.log('[Auto-Blur] Large canvas detected:', this.width, 'x', this.height);

        // Blur quickly for DevTools screenshot
        if (!isCurrentlyBlurred) {
          applyBlur(autoBlurWords);
          showAutoBlurIndicator('📸 DevTools screenshot detected');

          // Unblur after 1 second (enough time for DevTools to capture)
          setTimeout(() => {
            if (isCurrentlyBlurred) {
              removeBlur();
            }
          }, 1000);
        }
      }
    }

    return originalGetContext.apply(this, args);
  };

  console.log('[Auto-Blur] Canvas interception installed for DevTools');
}

/**
 * Enable auto-blur mode - monitors for screenshots but keeps page visible
 * @param {string[]} words - Array of words to blur when screenshot detected
 */
function enableAutoBlur(words) {
  console.log('[Auto-Blur] Enabling auto-blur mode for words:', words);
  autoBlurEnabled = true;
  autoBlurWords = words;

  // Setup listener for messages from page context (page-script.js runs automatically)
  setupPageContextListener();

  // Setup canvas interception for DevTools screenshots
  interceptCanvasForDevTools();

  // Don't blur the page yet - only blur when screenshot is detected
  showAutoBlurIndicator('✓ Auto-blur enabled - Page stays visible, screenshots will be blurred');
}

/**
 * Disable auto-blur mode
 */
function disableAutoBlur() {
  console.log('[Auto-Blur] Disabling auto-blur mode');
  autoBlurEnabled = false;

  // Remove blur if currently active
  if (isCurrentlyBlurred) {
    removeBlur();
  }
}

/**
 * Apply blur to all text nodes containing the specified words
 * @param {string[]} words - Array of words to blur
 */
function applyBlur(words) {
  console.log('[Auto-Blur] 🔒 START APPLYING BLUR for words:', words);

  if (words.length === 0) {
    console.warn('[Auto-Blur] No words to blur');
    return;
  }

  if (isCurrentlyBlurred) {
    console.log('[Auto-Blur] ⚠️ Already blurred, skipping');
    return;
  }

  isCurrentlyBlurred = true;
  blurredElements = [];

  // Create case-insensitive regex pattern
  // Escape special regex characters in words
  const escapedWords = words.map(word =>
    word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );
  const pattern = new RegExp(`(${escapedWords.join('|')})`, 'gi');

  // Walk through all text nodes in the document
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        // Skip script, style, and already blurred elements
        const parentTag = node.parentElement?.tagName?.toLowerCase();
        if (parentTag === 'script' || parentTag === 'style' || parentTag === 'noscript') {
          return NodeFilter.FILTER_REJECT;
        }

        // Skip if parent already has blur class
        if (node.parentElement?.classList?.contains('text-blur-wrapper')) {
          return NodeFilter.FILTER_REJECT;
        }

        // Only accept if text contains one of our words
        if (pattern.test(node.textContent)) {
          return NodeFilter.FILTER_ACCEPT;
        }

        return NodeFilter.FILTER_REJECT;
      }
    }
  );

  const nodesToProcess = [];
  let currentNode;

  while (currentNode = walker.nextNode()) {
    nodesToProcess.push(currentNode);
  }

  console.log('[Text Blur] Found', nodesToProcess.length, 'text nodes to process');

  // Process each text node
  nodesToProcess.forEach(textNode => {
    try {
      const originalText = textNode.textContent;
      const parent = textNode.parentElement;

      if (!parent) return;

      // Create a document fragment to hold new nodes
      const fragment = document.createDocumentFragment();
      let lastIndex = 0;
      let match;

      // Reset regex to start from beginning
      const localPattern = new RegExp(pattern.source, pattern.flags);

      while ((match = localPattern.exec(originalText)) !== null) {
        // Add text before match
        if (match.index > lastIndex) {
          fragment.appendChild(
            document.createTextNode(originalText.slice(lastIndex, match.index))
          );
        }

        // Create blurred span for matched text
        const blurSpan = document.createElement('span');
        blurSpan.className = 'text-blur-wrapper';

        // Replace text with black blocks (█ character repeated)
        const blockText = '█'.repeat(match[0].length);
        blurSpan.textContent = blockText;

        blurSpan.style.cssText = 'background: #000; color: #000; padding: 2px 4px; border-radius: 3px; user-select: none; cursor: not-allowed; display: inline-block;';
        blurSpan.setAttribute('data-original-text', match[0]);
        fragment.appendChild(blurSpan);

        lastIndex = localPattern.lastIndex;
      }

      // Add remaining text after last match
      if (lastIndex < originalText.length) {
        fragment.appendChild(
          document.createTextNode(originalText.slice(lastIndex))
        );
      }

      // Store reference to original node and parent for cleanup
      blurredElements.push({
        parent: parent,
        originalNode: textNode.cloneNode(true),
        blurredNodes: Array.from(fragment.childNodes).map(n => n.cloneNode(true))
      });

      // Replace original text node with fragment
      parent.replaceChild(fragment, textNode);

    } catch (error) {
      console.error('[Auto-Blur] Error processing node:', error);
    }
  });

  console.log('[Auto-Blur] ✅ BLUR COMPLETE! Blurred', blurredElements.length, 'text sections');
  console.log('[Auto-Blur] 📊 Total .text-blur-wrapper elements:', document.querySelectorAll('.text-blur-wrapper').length);

  // Show visual indicator
  showAutoBlurIndicator('🔒 Blurred! Take your screenshot now');
}

/**
 * Remove all blur effects and restore original text
 */
function removeBlur() {
  console.log('[Auto-Blur] Removing blur from', blurredElements.length, 'elements');

  isCurrentlyBlurred = false;

  // Remove all blur wrapper spans
  document.querySelectorAll('.text-blur-wrapper').forEach(span => {
    try {
      const originalText = span.getAttribute('data-original-text') || span.textContent;
      const textNode = document.createTextNode(originalText);
      span.parentNode?.replaceChild(textNode, span);
    } catch (error) {
      console.error('[Auto-Blur] Error removing blur span:', error);
    }
  });

  // Clear tracked elements
  blurredElements = [];

  console.log('[Auto-Blur] Blur removed');

  // Show indicator
  if (autoBlurEnabled) {
    showAutoBlurIndicator('✓ Unblurred - Ready for next screenshot');
  }
}

/**
 * Show a temporary visual indicator for auto-blur status
 * @param {string} message - Message to display
 */
function showAutoBlurIndicator(message) {
  // Remove existing indicator
  const existing = document.getElementById('auto-blur-indicator');
  if (existing) {
    existing.remove();
  }

  // Create indicator
  const indicator = document.createElement('div');
  indicator.id = 'auto-blur-indicator';
  indicator.textContent = message;
  indicator.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(33, 33, 33, 0.95);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    z-index: 999998;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    animation: slideInFromBottom 0.3s ease-out;
    pointer-events: none;
  `;

  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInFromBottom {
      from {
        transform: translateY(100px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(indicator);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (indicator && indicator.parentNode) {
      indicator.style.opacity = '0';
      indicator.style.transition = 'opacity 0.3s';
      setTimeout(() => indicator.remove(), 300);
    }
  }, 3000);
}

// Listen for dynamic content changes to reapply blur
const blurMutationObserver = new MutationObserver((mutations) => {
  if (!isCurrentlyBlurred) return;

  // Check if new text nodes were added
  let shouldReapply = false;

  for (const mutation of mutations) {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      for (const node of mutation.addedNodes) {
        // Check if added node contains text
        if (node.nodeType === Node.TEXT_NODE ||
            (node.nodeType === Node.ELEMENT_NODE && node.textContent.length > 0)) {
          shouldReapply = true;
          break;
        }
      }
    }
    if (shouldReapply) break;
  }

  if (shouldReapply) {
    console.log('[Auto-Blur] New content detected, reapplying blur');
    removeBlur();
    applyBlur(autoBlurWords);
  }
});

// Start observing for dynamic content
if (document.body) {
  blurMutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Old polling and observer code removed - now using page context injection
console.log('[Auto-Blur] Feature initialized - will inject on enable');

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

/**
 * Take a test screenshot of the current page
 * Uses page-script.js to take screenshot (runs in page context)
 */
async function takeTestScreenshot() {
  console.log('[Screenshot] Starting test screenshot...');

  try {
    // Inject html2canvas first (always inject to ensure it's there)
    console.log('[Screenshot] Injecting html2canvas...');
    await injectHtml2Canvas();

    // Wait for it to load and be wrapped
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('[Screenshot] Requesting screenshot from page context...');

    // Send screenshot request to page-script.js
    const result = await requestScreenshotFromPageScript();

    return result;

  } catch (error) {
    console.error('[Screenshot] ❌ Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Request screenshot from page-script.js via postMessage
 */
function requestScreenshotFromPageScript() {
  return new Promise((resolve, reject) => {
    // Generate unique ID for this screenshot request
    const requestId = 'screenshot-' + Date.now();

    // Listen for result from page script
    const messageListener = (event) => {
      if (event.data &&
          event.data.type === 'SCREENSHOT_RESULT' &&
          event.data.source === 'page-script' &&
          event.data.requestId === requestId) {

        window.removeEventListener('message', messageListener);

        if (event.data.success) {
          console.log('[Screenshot] ✅ Screenshot completed:', event.data.filename);
          resolve({ success: true, filename: event.data.filename });
        } else {
          console.error('[Screenshot] ❌ Screenshot failed:', event.data.error);
          resolve({ success: false, error: event.data.error });
        }
      }
    };

    window.addEventListener('message', messageListener);

    // Timeout after 10 seconds
    setTimeout(() => {
      window.removeEventListener('message', messageListener);
      reject(new Error('Screenshot timeout'));
    }, 10000);

    // Send request to page script
    window.postMessage({
      type: 'TAKE_SCREENSHOT_REQUEST',
      source: 'content-script',
      requestId: requestId
    }, '*');

    console.log('[Screenshot] Screenshot request sent:', requestId);
  });
}

/**
 * Inject html2canvas library dynamically from extension
 */
function injectHtml2Canvas() {
  return new Promise((resolve, reject) => {
    console.log('[Screenshot] Injecting html2canvas script...');

    const script = document.createElement('script');
    // Use local html2canvas.min.js from extension (bypasses CSP)
    script.src = chrome.runtime.getURL('html2canvas.min.js');

    script.onload = () => {
      console.log('[Screenshot] ✅ html2canvas loaded successfully');
      resolve();
    };

    script.onerror = (error) => {
      console.error('[Screenshot] ❌ Failed to load html2canvas:', error);
      reject(new Error('Failed to load html2canvas library'));
    };

    (document.head || document.documentElement).appendChild(script);
  });
}
