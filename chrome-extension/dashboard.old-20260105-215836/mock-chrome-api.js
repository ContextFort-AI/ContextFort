// Mock Chrome API for development
// This simulates chrome.storage.local API using a local JSON file

let mockStorageData = null;

// Load mock data from JSON file
async function loadMockData() {
  if (mockStorageData) return mockStorageData;

  try {
    const response = await fetch('/mock-storage-data.json');
    mockStorageData = await response.json();
    return mockStorageData;
  } catch (error) {
    console.error('[Mock Chrome API] Failed to load mock data:', error);
    // Return empty data structure as fallback
    mockStorageData = {
      blockedRequests: [],
      clickEvents: [],
      downloadRequests: [],
      screenshots: [],
      sessions: [],
      whitelist: { urls: [], hostnames: [] },
      sensitiveWords: []
    };
    return mockStorageData;
  }
}

// Create mock chrome object
if (typeof window !== 'undefined' && !window.chrome?.storage) {
  window.chrome = window.chrome || {};
  window.chrome.storage = {
    local: {
      get: async function(keys) {
        const data = await loadMockData();
        const result = {};

        // Handle different input types
        if (typeof keys === 'string') {
          // Single key as string
          result[keys] = data[keys];
        } else if (Array.isArray(keys)) {
          // Array of keys
          for (const key of keys) {
            result[key] = data[key];
          }
        } else if (keys === null || keys === undefined) {
          // Get all data
          Object.assign(result, data);
        } else if (typeof keys === 'object') {
          // Object with default values
          for (const [key, defaultValue] of Object.entries(keys)) {
            result[key] = data[key] !== undefined ? data[key] : defaultValue;
          }
        }

        return result;
      },

      set: async function(items) {
        const data = await loadMockData();
        Object.assign(data, items);
        return Promise.resolve();
      },

      remove: async function(keys) {
        const data = await loadMockData();
        const keysArray = Array.isArray(keys) ? keys : [keys];
        for (const key of keysArray) {
          delete data[key];
        }
        return Promise.resolve();
      },

      clear: async function() {
        mockStorageData = {
          blockedRequests: [],
          clickEvents: [],
          downloadRequests: [],
          screenshots: [],
          sessions: [],
          whitelist: { urls: [], hostnames: [] },
          sensitiveWords: []
        };
        return Promise.resolve();
      }
    }
  };
}
