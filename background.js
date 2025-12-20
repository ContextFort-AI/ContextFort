console.log('[POST Monitor] Background script starting...');

// Store input data from recent clicks
let activeMonitoring = [];

// Time window to monitor POST requests after a user action (in milliseconds)
const MONITORING_WINDOW = 2000; // 2 seconds after user action

// Backend API URL
const API_URL = 'http://127.0.0.1:8000';

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

  return true;
});

// Monitor POST requests and check against recent input data
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    // Only process POST requests
    if (details.method !== 'POST') {
      return;
    }

    // IMPORTANT: Ignore requests to our own backend API to prevent infinite loops
    if (details.url.startsWith(API_URL)) {
      return;
    }

    // Check if we have any active monitoring (from button clicks)
    if (activeMonitoring.length === 0) {
      return;
    }

    // Get the request body if available
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
          return;
        }
      }
    }

    // If no request body, nothing to check
    if (!requestBody) {
      return;
    }

    console.log('[POST Monitor] 📡 POST request detected to:', new URL(details.url).hostname);
    console.log('[POST Monitor] Checking against', activeMonitoring.length, 'monitoring entries');

    // Check against all active monitoring entries
    const now = Date.now();
    for (let entry of activeMonitoring) {
      // Only check recent entries (within monitoring window)
      if ((now - entry.timestamp) < MONITORING_WINDOW) {
        console.log('[POST Monitor] Checking entry from', (now - entry.timestamp), 'ms ago');

        // Check if request body contains any of the input values
        const matchedFields = [];

        for (let [fieldName, fieldValue] of Object.entries(entry.inputs)) {
          // Only check meaningful input (more than 2 characters)
          if (fieldValue.length > 2 && requestBody.includes(fieldValue)) {
            console.log('[POST Monitor] ✓ MATCH FOUND for field:', fieldName);
            matchedFields.push({
              field: fieldName,
              value: fieldValue
            });
          }
        }

        console.log('[POST Monitor] Total matches found:', matchedFields.length);

        // If we found matches, alert and save
        if (matchedFields.length > 0) {
          console.warn('[POST Monitor] ⚠️⚠️⚠️ POST request DETECTED with user input!');
          console.warn('[POST Monitor] Target:', details.url);
          console.warn('[POST Monitor] Matched fields:', matchedFields.map(f => f.field).join(', '));

          // Log matched values (truncated for privacy)
          matchedFields.forEach(match => {
            console.warn(`  - ${match.field}: "${match.value.substring(0, 20)}..."`);
          });

          // Prepare data for backend
          const targetHostname = new URL(details.url).hostname;
          const backendData = {
            target_url: details.url,
            target_hostname: targetHostname,
            source_url: entry.url,
            matched_fields: matchedFields.map(f => f.field),
            matched_values: matchedFields.reduce((acc, f) => {
              acc[f.field] = f.value;
              return acc;
            }, {}),
            request_method: 'POST',
            status: 'detected'
          };

          // Save to backend
          saveToBackend(backendData);

          // Show notification
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
            title: '⚠️ POST Request Detected',
            message: `Request to ${targetHostname} contains ${matchedFields.length} field(s) from your input: ${matchedFields.map(f => f.field).join(', ')}`,
            priority: 2
          }, (notificationId) => {
            if (chrome.runtime.lastError) {
              console.error('[POST Monitor] Notification error:', chrome.runtime.lastError.message);
            } else {
              console.log('[POST Monitor] ✓ Notification created:', notificationId);
            }
          });

          // Send alert to content script
          chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs[0]) {
              chrome.tabs.sendMessage(tabs[0].id, {
                type: 'ALERT_DETECTED',
                matchedFields: matchedFields.map(f => f.field),
                url: targetHostname,
                count: matchedFields.length
              }).catch(err => {
                console.log('[POST Monitor] Could not send alert to tab:', err);
              });
            }
          });

          // Don't block, just detect
          break;
        }
      }
    }
  },
  { urls: ['<all_urls>'] },
  ['requestBody']
);

console.log('[POST Monitor] Extension loaded and ready');
console.log('[POST Monitor] Monitoring strategy: Button-click-triggered POST request detection');
console.log('[POST Monitor] Will ONLY detect POST requests that occur within 2 seconds of clicking a button/link WITH input data present');
