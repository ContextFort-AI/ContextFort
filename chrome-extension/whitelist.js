// Whitelist management script
console.log('[Whitelist] Script loading...');

// Load and display current whitelist
async function loadWhitelist() {
  try {
    const result = await chrome.storage.local.get(['whitelist']);
    const whitelist = result.whitelist || { urls: [], hostnames: [] };

    console.log('[Whitelist] Loaded:', whitelist);

    displayUrls(whitelist.urls);
    displayHostnames(whitelist.hostnames);
  } catch (error) {
    console.error('[Whitelist] Error loading:', error);
  }
}

// Display URLs list
function displayUrls(urls) {
  const container = document.getElementById('urlList');

  if (urls.length === 0) {
    container.innerHTML = '<p class="empty-message">No URLs whitelisted yet</p>';
    return;
  }

  container.innerHTML = urls.map((url, index) => `
    <div class="list-item">
      <code>${escapeHtml(url)}</code>
      <button class="remove-btn" data-type="url" data-index="${index}">Remove</button>
    </div>
  `).join('');

  // Add event listeners to remove buttons
  container.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', handleRemove);
  });
}

// Display hostnames list
function displayHostnames(hostnames) {
  const container = document.getElementById('hostnameList');

  if (hostnames.length === 0) {
    container.innerHTML = '<p class="empty-message">No hostnames whitelisted yet</p>';
    return;
  }

  container.innerHTML = hostnames.map((hostname, index) => `
    <div class="list-item">
      <code>${escapeHtml(hostname)}</code>
      <button class="remove-btn" data-type="hostname" data-index="${index}">Remove</button>
    </div>
  `).join('');

  // Add event listeners to remove buttons
  container.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', handleRemove);
  });
}

// Add to whitelist
async function addToWhitelist(type) {
  try {
    const input = document.getElementById(type === 'url' ? 'urlInput' : 'hostnameInput');
    const value = input.value.trim();

    if (!value) {
      alert('Please enter a value');
      return;
    }

    // Get current whitelist
    const result = await chrome.storage.local.get(['whitelist']);
    const whitelist = result.whitelist || { urls: [], hostnames: [] };

    // Add to appropriate array
    if (type === 'url') {
      if (whitelist.urls.includes(value)) {
        alert('URL already whitelisted');
        return;
      }
      whitelist.urls.push(value);
      console.log('[Whitelist] Added URL:', value);
    } else {
      if (whitelist.hostnames.includes(value)) {
        alert('Hostname already whitelisted');
        return;
      }
      whitelist.hostnames.push(value);
      console.log('[Whitelist] Added hostname:', value);
    }

    // Save to storage
    await chrome.storage.local.set({ whitelist });

    // Clear input and reload
    input.value = '';
    loadWhitelist();

    console.log('[Whitelist] Saved successfully');
  } catch (error) {
    console.error('[Whitelist] Error adding:', error);
    alert('Error adding to whitelist');
  }
}

// Remove from whitelist
async function handleRemove(event) {
  try {
    const type = event.target.dataset.type;
    const index = parseInt(event.target.dataset.index);

    // Get current whitelist
    const result = await chrome.storage.local.get(['whitelist']);
    const whitelist = result.whitelist || { urls: [], hostnames: [] };

    // Remove from appropriate array
    if (type === 'url') {
      const removed = whitelist.urls.splice(index, 1);
      console.log('[Whitelist] Removed URL:', removed[0]);
    } else {
      const removed = whitelist.hostnames.splice(index, 1);
      console.log('[Whitelist] Removed hostname:', removed[0]);
    }

    // Save to storage
    await chrome.storage.local.set({ whitelist });

    // Reload
    loadWhitelist();

    console.log('[Whitelist] Removed successfully');
  } catch (error) {
    console.error('[Whitelist] Error removing:', error);
    alert('Error removing from whitelist');
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Setup event listeners
document.addEventListener('DOMContentLoaded', () => {
  console.log('[Whitelist] DOM loaded, setting up...');

  // Load initial data
  loadWhitelist();

  // Add button listeners
  document.getElementById('addUrlBtn').addEventListener('click', () => addToWhitelist('url'));
  document.getElementById('addHostnameBtn').addEventListener('click', () => addToWhitelist('hostname'));

  // Enter key support
  document.getElementById('urlInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addToWhitelist('url');
  });
  document.getElementById('hostnameInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addToWhitelist('hostname');
  });

  console.log('[Whitelist] Setup complete');
});
