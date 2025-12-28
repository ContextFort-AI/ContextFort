// Load configuration from config.js
importScripts('config.js');

console.log('[POST Monitor] Background script starting...');

// Store input data from recent clicks
let activeMonitoring = [];

// Time window to monitor POST requests after a user action (in milliseconds)
const MONITORING_WINDOW = 2000; // 2 seconds after user action

// Backend API URLs (Loaded from config.js)
const API_URL = CONFIG.API_URL;
const CLICK_DETECTION_API_URL = CONFIG.CLICK_DETECTION_API_URL;

console.log('[POST Monitor] Using API URLs from config:');
console.log('[POST Monitor] API_URL:', API_URL);
console.log('[POST Monitor] CLICK_DETECTION_API_URL:', CLICK_DETECTION_API_URL);

// Click correlation configuration
const CORRELATION_WINDOW = 3000; // 3 seconds for click correlation
const IGNORED_EXTENSIONS = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2', '.ttf', '.ico', '.webp'];

// Query recent clicks from Chrome local storage to correlate with requests
async function queryRecentClick(requestTimestamp, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      // Read from Chrome local storage
      const result = await chrome.storage.local.get(['clickEvents']);
      const recentClicks = result.clickEvents || [];

      console.log('[Click Correlation] Checking', recentClicks.length, 'recent clicks from local storage');

      // Find click within CORRELATION_WINDOW
      for (const click of recentClicks) {
        const clickTime = click.timestamp; // Already in ms
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

// Send detected request to backend AND store in local storage
async function saveToBackend(data) {
  // Add timestamp and ID for local storage
  const requestWithMetadata = {
    ...data,
    id: Date.now(), // Use timestamp as ID
    timestamp: new Date().toISOString()
  };

  // Save to Chrome local storage
  try {
    const result = await chrome.storage.local.get(['blockedRequests']);
    let requests = result.blockedRequests || [];

    // Add new request to the beginning
    requests.unshift(requestWithMetadata);

    // Keep only last 1000 requests to avoid storage limits
    if (requests.length > 1000) {
      requests = requests.slice(0, 1000);
    }

    await chrome.storage.local.set({ blockedRequests: requests });
    console.log('[POST Monitor] ✓ Saved to local storage. Total requests:', requests.length);
  } catch (storageError) {
    console.error('[POST Monitor] Local storage error:', storageError);
  }

  // Also try to send to backend API (if available)
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
      console.log('[POST Monitor] ✓ Also saved to backend with ID:', result.id);
      return result;
    } else {
      console.log('[POST Monitor] Backend save failed (API may be offline):', response.status);
    }
  } catch (error) {
    console.log('[POST Monitor] Backend not available (using local storage only):', error.message);
  }

  return requestWithMetadata;
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
  // Handle click detection - store in local storage instead of API
  else if (message.type === 'SEND_CLICK_TO_API') {
    (async () => {
      try {
        // Check if bot mode is enabled (for testing)
        const botModeResult = await chrome.storage.local.get(['botModeEnabled']);
        const isBotModeEnabled = botModeResult.botModeEnabled || false;

        // Add metadata to click event
        const clickEvent = {
          ...message.clickData,
          id: Date.now(),
          created_at: new Date().toISOString(),
          timestamp: Date.now(),
          // Force suspicious if bot mode is enabled, otherwise normal detection
          is_suspicious: isBotModeEnabled ? true : false
        };

        if (isBotModeEnabled) {
          console.log('[Click Detection] 🤖 BOT MODE ACTIVE - Marking click as suspicious');
        }

        // Save to Chrome local storage
        const result = await chrome.storage.local.get(['clickEvents']);
        let events = result.clickEvents || [];

        // Add new event to the beginning
        events.unshift(clickEvent);

        // Keep only last 1000 events
        if (events.length > 1000) {
          events = events.slice(0, 1000);
        }

        await chrome.storage.local.set({ clickEvents: events });
        console.log('[Click Detection] ✓ Saved to local storage. Total events:', events.length);

        sendResponse({ is_suspicious: clickEvent.is_suspicious });
      } catch (error) {
        console.error('[Click Detection] Local storage error:', error);
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
    // IMPORTANT: Ignore requests to our own backend APIs and whitelisted URLs to prevent infinite loops
    if (details.url.startsWith(API_URL) ||
        details.url.startsWith('http://localhost:8000') ||
        details.url.startsWith('http://localhost:3000') ||
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

    console.log('[POST Monitor] 📡 Request detected:', details.method, 'to', new URL(details.url).hostname);

    if (clickCorrelation) {
      console.log('[POST Monitor] Click correlation found:', clickCorrelation.is_suspicious ? 'BOT' : 'HUMAN');
      console.log('[POST Monitor] Creating notification...');
    } else {
      console.log('[POST Monitor] No click correlation found - marking as background request');
    }

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
    let matchedFields = [];
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

      // Filter out 'q' fields ONLY if all matches are 'q' fields
      if (matchedFields.length > 0) {
        const nonQMatches = matchedFields.filter(f => f.field.toLowerCase() !== 'q');

        if (nonQMatches.length === 0) {
          // All matches are 'q' fields - ignore them
          console.log('[POST Monitor] ⊘ Ignoring matches - only "q" field(s) matched');
          matchedFields = [];
        } else {
          // We have non-q matches, keep everything (including q if present)
          console.log('[POST Monitor] ✓ Keeping all matches - non-q fields present');
        }
      }
    }

    // Prepare data for backend (save ALL requests, with or without click correlation)
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
      has_click_correlation: clickCorrelation ? true : false,
      is_bot: clickCorrelation ? clickCorrelation.is_suspicious : false,
      click_correlation_id: clickCorrelation ? clickCorrelation.click_id : null,
      click_time_diff_ms: clickCorrelation ? clickCorrelation.time_diff_ms : null,
      click_coordinates: clickCorrelation ? clickCorrelation.click_coordinates : null
    };
    console.log('[POST Monitor] Preparing data for backend:', backendData); //chnegd thi now by rizz
    // Save to backend
    await saveToBackend(backendData);

    // Show notification ONLY if there's click correlation (not for background requests)
    if (clickCorrelation) {
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
    } // End of if (clickCorrelation)
  },
  { urls: ['<all_urls>'] },
  ['requestBody']
);

console.log('[POST Monitor] Extension loaded and ready');
console.log('[POST Monitor] Monitoring strategy: Button-click-triggered POST request detection');
console.log('[POST Monitor] Will ONLY detect POST requests that occur within 2 seconds of clicking a button/link WITH input data present');

// ===== CLICK DETECTION INTEGRATION =====

// Click detection now uses Chrome local storage (no API calls)
console.log('[Click Detection] Using Chrome local storage for click events');

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

// ===== DOWNLOAD TRACKING =====

// Track all downloads
chrome.downloads.onCreated.addListener(async (downloadItem) => {
  try {
    console.log('[Download Monitor] Download detected:', downloadItem.filename);

    // Extract file extension
    const filename = downloadItem.filename || '';
    const fileExtension = filename.includes('.') ? filename.split('.').pop().toLowerCase() : 'unknown';

    // Get file size in readable format
    const fileSize = downloadItem.fileSize || downloadItem.estimatedEndTime || 0;
    const fileSizeStr = formatFileSize(fileSize);

    // Determine file type category
    const fileCategory = getFileCategory(fileExtension);

    const downloadData = {
      id: downloadItem.id,
      filename: filename,
      url: downloadItem.url,
      referrer: downloadItem.referrer || downloadItem.url,
      mime_type: downloadItem.mime || 'unknown',
      file_extension: fileExtension,
      file_category: fileCategory,
      file_size: fileSize,
      file_size_str: fileSizeStr,
      start_time: new Date(downloadItem.startTime).toISOString(),
      timestamp: Date.now(),
      danger: downloadItem.danger || 'safe',
      state: downloadItem.state || 'in_progress'
    };

    // Save to Chrome local storage
    const result = await chrome.storage.local.get(['downloadRequests']);
    let downloads = result.downloadRequests || [];

    // Add new download to the beginning
    downloads.unshift(downloadData);

    // Keep only last 1000 downloads
    if (downloads.length > 1000) {
      downloads = downloads.slice(0, 1000);
    }

    await chrome.storage.local.set({ downloadRequests: downloads });
    console.log('[Download Monitor] ✓ Saved to local storage. Total downloads:', downloads.length);

    // Show notification for potentially dangerous downloads
    if (downloadItem.danger && downloadItem.danger !== 'safe') {
      const iconDataUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      chrome.notifications.create('download-' + downloadItem.id, {
        type: 'basic',
        iconUrl: iconDataUri,
        title: '⚠️ Potentially Dangerous Download',
        message: `${filename} (${downloadItem.danger})`,
        priority: 2
      });
    }
  } catch (error) {
    console.error('[Download Monitor] Error saving download:', error);
  }
});

// Helper function to format file size
function formatFileSize(bytes) {
  if (bytes === 0) return 'Unknown';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Helper function to categorize file types
function getFileCategory(extension) {
  const categories = {
    'document': ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 'pages'],
    'spreadsheet': ['xls', 'xlsx', 'csv', 'ods', 'numbers'],
    'presentation': ['ppt', 'pptx', 'key', 'odp'],
    'image': ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico'],
    'video': ['mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv', 'webm'],
    'audio': ['mp3', 'wav', 'flac', 'aac', 'm4a', 'ogg'],
    'archive': ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'],
    'executable': ['exe', 'dmg', 'app', 'deb', 'rpm', 'apk', 'msi'],
    'code': ['js', 'py', 'java', 'cpp', 'c', 'html', 'css', 'php', 'rb', 'go', 'ts'],
    'data': ['json', 'xml', 'yaml', 'sql', 'db']
  };

  for (const [category, extensions] of Object.entries(categories)) {
    if (extensions.includes(extension)) {
      return category;
    }
  }

  return 'other';
}

console.log('[Download Monitor] Download tracking initialized');
