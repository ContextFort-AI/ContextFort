// Export Chrome Storage Script
const STORAGE_KEYS = [
  'blockedRequests',
  'clickEvents',
  'downloadRequests',
  'screenshots',
  'sessions',
  'whitelist',
  'sensitiveWords',
  'userEmail',
  'userData',
];

async function exportStorage() {
  try {
    const exportBtn = document.getElementById('exportBtn');
    exportBtn.disabled = true;
    exportBtn.textContent = 'Exporting...';

    // Get all data from storage
    const result = await chrome.storage.local.get(STORAGE_KEYS);

    // Show stats
    showStats(result);

    // Create blob and download
    const dataStr = JSON.stringify(result, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `chrome-storage-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showStatus('success', `Successfully exported ${Object.keys(result).length} storage keys to JSON file!`);

    exportBtn.disabled = false;
    exportBtn.textContent = 'Export Storage Data';
  } catch (error) {
    showStatus('error', `Error exporting: ${error.message}`);
    exportBtn.disabled = false;
    exportBtn.textContent = 'Export Storage Data';
  }
}

async function viewData() {
  try {
    const viewBtn = document.getElementById('viewBtn');
    viewBtn.disabled = true;
    viewBtn.textContent = 'Loading...';

    const result = await chrome.storage.local.get(STORAGE_KEYS);

    showStats(result);

    const preview = document.getElementById('preview');
    const previewContent = document.getElementById('previewContent');
    previewContent.textContent = JSON.stringify(result, null, 2);
    preview.style.display = 'block';

    showStatus('success', 'Data loaded successfully!');

    viewBtn.disabled = false;
    viewBtn.textContent = 'View Data';
  } catch (error) {
    showStatus('error', `Error loading: ${error.message}`);
    viewBtn.disabled = false;
    viewBtn.textContent = 'View Data';
  }
}

function showStats(data) {
  const stats = document.getElementById('stats');
  const statsList = document.getElementById('statsList');

  statsList.innerHTML = '';

  for (const key of STORAGE_KEYS) {
    const value = data[key];
    let count = 'N/A';

    if (Array.isArray(value)) {
      count = value.length;
    } else if (typeof value === 'object' && value !== null) {
      count = `${Object.keys(value).length} keys`;
    }

    const li = document.createElement('li');
    li.textContent = `${key}: ${count}`;
    statsList.appendChild(li);
  }

  stats.style.display = 'block';
}

function showStatus(type, message) {
  const status = document.getElementById('status');
  status.className = `status ${type}`;
  status.textContent = message;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('exportBtn').addEventListener('click', exportStorage);
  document.getElementById('viewBtn').addEventListener('click', viewData);
});
