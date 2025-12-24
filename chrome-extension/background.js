console.log('[POST Monitor] Background script starting...');

// Store input data from recent clicks
let activeMonitoring = [];

// Time window to monitor POST requests after a user action (in milliseconds)
const MONITORING_WINDOW = 2000; // 2 seconds after user action

// Backend API URLs (Unified Backend)
const API_URL = 'http://127.0.0.1:8000';
const CLICK_DETECTION_API_URL = 'http://127.0.0.1:8000';

// Click correlation configuration
const CORRELATION_WINDOW = 3000; // 3 seconds for click correlation
const IGNORED_EXTENSIONS = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2', '.ttf', '.ico', '.webp'];

// Query recent clicks from click detection API to correlate with requests
async function queryRecentClick(requestTimestamp, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(`${CLICK_DETECTION_API_URL}/api/click-detection/recent?limit=10`);
      if (!response.ok) {
        console.log('[Click Correlation] API request failed:', response.status);
        continue;
      }

      const recentClicks = await response.json();
      console.log('[Click Correlation] Checking', recentClicks.length, 'recent clicks');

      // Find click within CORRELATION_WINDOW
      for (const click of recentClicks) {
        const clickTime = click.timestamp * 1000; // Convert to ms
        const timeDiff = Math.abs(requestTimestamp - clickTime);

        if (timeDiff <= CORRELATION_WINDOW) {
          console.log('[Click Correlation] ✓ Found matching click:', {
            id: click.id,
            timeDiff: timeDiff + 'ms',
            is_suspicious: click.is_suspicious
          });
          return {
            click_id: click.id,
            is_suspicious: click.is_suspicious,
            time_diff_ms: timeDiff,
            click_timestamp: clickTime,
            click_coordinates: { x: click.x, y: click.y }
          };
        }
      }

      // Retry after 200ms if no match and retries remain
      if (i < retries) {
        console.log('[Click Correlation] No match found, retrying in 200ms...');
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    } catch (error) {
      console.error('[Click Correlation] Error:', error);
    }
  }

  console.log('[Click Correlation] No matching click found after retries');
  return null; // No click found
}

// Send detected request to backend
async function saveToBackend(data) {
  try {
    const response = await fetch(`${API_URL}/api/blocked-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('[POST Monitor] ✓ Saved to backend with ID:', result.id);
      return result;
    } else {
      console.error('[POST Monitor] Backend save failed:', response.status);
    }
  } catch (error) {
    console.error('[POST Monitor] Backend connection error:', error.message);
    console.log('[POST Monitor] Make sure backend is running at', API_URL);
  }
}

// Clean up old monitoring entries
setInterval(() => {
  const now = Date.now();
  const before = activeMonitoring.length;
  activeMonitoring = activeMonitoring.filter(entry => {
    return (now - entry.timestamp) < MONITORING_WINDOW;
  });
  if (before > activeMonitoring.length) {
    console.log('[POST Monitor] Cleaned up', before - activeMonitoring.length, 'expired entries');
  }
}, 1000);

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CLICK_WITH_INPUT') {
    console.log('[POST Monitor] ⚡ User clicked BUTTON/LINK with input data present');
    console.log('[POST Monitor] Clicked element:', message.clickedElement?.tag, message.clickedElement);
    console.log('[POST Monitor] Tracking', Object.keys(message.inputs).length, 'input fields');
    console.log('[POST Monitor] ✓ Now monitoring POST requests for next', MONITORING_WINDOW / 1000, 'seconds...');

    // Store the input data with timestamp
    activeMonitoring.push({
      inputs: message.inputs,
      url: message.url,
      timestamp: message.timestamp,
      tabId: sender.tab?.id,
      clickedElement: message.clickedElement
    });

    console.log('[POST Monitor] Active monitoring entries:', activeMonitoring.length);
    sendResponse({ success: true });
  }
  // Handle click detection API forwarding (to avoid per-site local network permission)
  else if (message.type === 'SEND_CLICK_TO_API') {
    (async () => {
      try {
        const response = await fetch(`${CLICK_DETECTION_API_URL}/api/click-detection/events/dom`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message.clickData)
        });

        const result = await response.json();
        sendResponse(result);
      } catch (error) {
        console.error('[Click Detection] API error:', error);
        sendResponse({ is_suspicious: false, error: error.message });
      }
    })();
    return true; // Keep message channel open for async response
  }

  return true;
});

// Monitor ALL requests (not just POST) and check against recent input data
chrome.webRequest.onBeforeRequest.addListener(
  async (details) => {
    // IMPORTANT: Ignore requests to our own backend APIs to prevent infinite loops
    if (details.url.startsWith(API_URL) ||
        details.url.startsWith('http://localhost:8000') ||
        details.url.startsWith(CLICK_DETECTION_API_URL)) {
      return;
    }

    // Ignore static assets for performance
    try {
      const url = new URL(details.url);
      const pathname = url.pathname.toLowerCase();
      const isStaticAsset = IGNORED_EXTENSIONS.some(ext => pathname.endsWith(ext));
      if (isStaticAsset) {
        return;
      }
    } catch (e) {
      // Invalid URL, skip
      return;
    }

    const now = Date.now();

    // Query click correlation FIRST to determine if request is human or bot
    const clickCorrelation = await queryRecentClick(now);

    if (!clickCorrelation) {
      // No click correlation found - skip this request (background AJAX)
      return;
    }

    console.log('[POST Monitor] 📡 Request detected:', details.method, 'to', new URL(details.url).hostname);
    console.log('[POST Monitor] Click correlation found:', clickCorrelation.is_suspicious ? 'BOT' : 'HUMAN');
    console.log('[POST Monitor] Creating notification...');

    // Get the request body if available for input field matching
    let requestBody = '';
    if (details.requestBody) {
      // Handle form data
      if (details.requestBody.formData) {
        requestBody = JSON.stringify(details.requestBody.formData);
      }
      // Handle raw data
      else if (details.requestBody.raw) {
        try {
          const decoder = new TextDecoder('utf-8');
          requestBody = details.requestBody.raw.map(item => {
            return decoder.decode(item.bytes);
          }).join('');
        } catch (e) {
          console.log('[POST Monitor] Could not decode request body:', e);
        }
      }
    }

    // Try to match input fields if we have active monitoring
    const matchedFields = [];
    let sourceUrl = '';

    if (activeMonitoring.length > 0 && requestBody) {
      for (let entry of activeMonitoring) {
        // Only check recent entries (within monitoring window)
        if ((now - entry.timestamp) < MONITORING_WINDOW) {
          sourceUrl = entry.url;

          // Check if request body contains any of the input values
          for (let [fieldName, fieldValue] of Object.entries(entry.inputs)) {
            // Only check meaningful input (more than 2 characters)
            if (fieldValue.length > 2 && requestBody.includes(fieldValue)) {
              console.log('[POST Monitor] ✓ MATCH FOUND for field:', fieldName);
              matchedFields.push({
                field: fieldName,
                value: fieldValue
              });
              console.log('[POST Monitor] Matched value:', fieldValue);
            }
          }
        }
      }
    }

    // Prepare data for backend (save ALL requests with click correlation)
    const targetHostname = new URL(details.url).hostname;
    const backendData = {
      target_url: details.url,
      target_hostname: targetHostname,
      source_url: sourceUrl || details.initiator || details.url,
      matched_fields: matchedFields.map(f => f.field),
      matched_values: matchedFields.reduce((acc, f) => {
        acc[f.field] = f.value;
        return acc;
      }, {}),
      request_method: details.method,
      status: 'detected',

      // Human/Bot Classification from click correlation
      has_click_correlation: true,
      is_bot: clickCorrelation.is_suspicious,
      click_correlation_id: clickCorrelation.click_id,
      click_time_diff_ms: clickCorrelation.time_diff_ms,
      click_coordinates: clickCorrelation.click_coordinates
    };
    console.log('[POST Monitor] Preparing data for backend:', backendData); //chnegd thi now by rizz
    // Save to backend
    await saveToBackend(backendData);

    // Show notification with human/bot classification
    const classification = clickCorrelation.is_suspicious ? '🤖 BOT' : '👤 HUMAN';
    const matchInfo = matchedFields.length > 0
      ? ` (${matchedFields.length} input field matches)`
      : '';

    // Create notification with inline icon (required by Chrome)
    // Minimal 48x48 PNG as data URI - a simple colored square
    const iconDataUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    const notificationOptions = {
      type: 'basic',
      iconUrl: iconDataUri,
      title: `${classification} Request Detected`,
      message: `${details.method} to ${targetHostname}${matchInfo}`,
      priority: 2,
      requireInteraction: false,
      silent: false
    };

    console.log('[POST Monitor] 🔔 Attempting to create notification with options:', notificationOptions);

    chrome.notifications.create('contextfort-' + Date.now(), notificationOptions, (notificationId) => {
      if (chrome.runtime.lastError) {
        console.error('[POST Monitor] ❌ Notification error:', chrome.runtime.lastError.message);
      } else {
        console.log('[POST Monitor] ✓ Notification created successfully! ID:', notificationId);
      }
    });

    // Send in-page alert to the tab (for the red modal popup)
    if (details.tabId && details.tabId >= 0) {
      chrome.tabs.sendMessage(details.tabId, {
        type: 'ALERT_DETECTED',
        classification: clickCorrelation.is_suspicious ? 'BOT' : 'HUMAN',
        matchedFields: matchedFields.map(f => f.field),
        url: targetHostname,
        method: details.method,
        count: matchedFields.length
      }).catch(err => {
        console.log('[POST Monitor] Could not send alert to tab:', err);
      });
    }
  },
  { urls: ['<all_urls>'] },
  ['requestBody']
);

console.log('[POST Monitor] Extension loaded and ready');
console.log('[POST Monitor] Monitoring strategy: Button-click-triggered POST request detection');
console.log('[POST Monitor] Will ONLY detect POST requests that occur within 2 seconds of clicking a button/link WITH input data present');

// ===== CLICK DETECTION INTEGRATION =====

// CLICK_DETECTION_API_URL already declared at top of file

// Store click detection stats
let clickDetectionStats = {
  total_clicks: 0,
  legitimate_clicks: 0,
  suspicious_clicks: 0
};

// Fetch click detection stats periodically
async function fetchClickDetectionStats() {
  try {
    const response = await fetch(`${CLICK_DETECTION_API_URL}/api/click-detection/stats`);
    if (response.ok) {
      const stats = await response.json();
      clickDetectionStats = stats;
      console.log('[Click Detection] Stats updated:', stats);
    }
  } catch (error) {
    // API may not be running, fail silently
    console.log('[Click Detection] API not available at', CLICK_DETECTION_API_URL);
  }
}

// Fetch stats every 10 seconds
setInterval(fetchClickDetectionStats, 10000);
fetchClickDetectionStats(); // Initial fetch

console.log('[Click Detection] Backend integration ready');
console.log('[Click Detection] API URL:', CLICK_DETECTION_API_URL);

// ===== GLOBAL CLICK DETECTION TOGGLE =====

// Function to enable/disable click detection on a specific tab
async function setClickDetectionOnTab(tabId, enabled) {
  try {
    await chrome.tabs.sendMessage(tabId, {
      type: 'TOGGLE_CLICK_DETECTION',
      enabled: enabled
    });
    console.log(`[Click Detection] ${enabled ? 'Enabled' : 'Disabled'} on tab ${tabId}`);
  } catch (error) {
    // Tab may not be ready or content script not loaded yet, fail silently
    console.log(`[Click Detection] Could not toggle on tab ${tabId}:`, error.message);
  }
}

// Function to apply click detection state to all tabs
async function applyClickDetectionToAllTabs(enabled) {
  try {
    const tabs = await chrome.tabs.query({});
    console.log(`[Click Detection] Applying state (${enabled ? 'enabled' : 'disabled'}) to ${tabs.length} tabs`);

    for (const tab of tabs) {
      // Skip chrome:// and other special URLs
      if (tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
        await setClickDetectionOnTab(tab.id, enabled);
      }
    }
  } catch (error) {
    console.error('[Click Detection] Error applying to all tabs:', error);
  }
}

// Listen for messages from popup to toggle click detection globally
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TOGGLE_CLICK_DETECTION_GLOBAL') {
    console.log('[Click Detection] Global toggle requested:', message.enabled);

    // Apply to all existing tabs
    applyClickDetectionToAllTabs(message.enabled).then(() => {
      sendResponse({ success: true });
    });

    return true; // Keep message channel open for async response
  }
});

// Listen for tab updates (page load, navigation) and auto-apply click detection state
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Only act when the page has finished loading
  if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
    // Check if click detection is enabled globally
    chrome.storage.local.get(['clickDetectionEnabled'], async (result) => {
      const enabled = result.clickDetectionEnabled || false;
      if (enabled) {
        console.log(`[Click Detection] Auto-enabling on newly loaded tab ${tabId}`);
        // Wait a bit for content script to be ready
        setTimeout(() => {
          setClickDetectionOnTab(tabId, true);
        }, 500);
      }
    });
  }
});

console.log('[Click Detection] Global toggle system initialized');
