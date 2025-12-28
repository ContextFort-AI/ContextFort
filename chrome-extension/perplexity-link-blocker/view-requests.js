/**
 * View captured Perplexity API requests
 */

const requestsDiv = document.getElementById('requests');
const clearBtn = document.getElementById('clearBtn');

function loadRequests() {
  chrome.storage.local.get(['perplexityRequests'], (result) => {
    const requests = result.perplexityRequests || [];

    if (requests.length === 0) {
      requestsDiv.innerHTML = '<div class="empty">No requests captured yet</div>';
      return;
    }

    // Show most recent first
    const html = requests.reverse().map((req, index) => `
      <div class="request">
        <div class="request-header">#${requests.length - index} - ${req.timestamp}</div>
        <div class="request-detail"><strong>Method:</strong> ${req.method}</div>
        <div class="request-detail"><strong>URL:</strong> ${req.url}</div>
        <div class="request-detail"><strong>Tab:</strong> ${req.tabId}</div>
        <div class="request-detail"><strong>Request ID:</strong> ${req.requestId}</div>
        ${req.initiator ? `<div class="request-detail"><strong>Initiator:</strong> ${req.initiator}</div>` : ''}
        ${req.payload ? `<div class="request-detail"><strong>Payload:</strong> <pre>${typeof req.payload === 'object' ? JSON.stringify(req.payload, null, 2) : req.payload}</pre></div>` : '<div class="request-detail"><em>No payload captured</em></div>'}
      </div>
    `).join('');

    requestsDiv.innerHTML = html;
  });
}

clearBtn.addEventListener('click', () => {
  chrome.storage.local.set({ perplexityRequests: [] }, () => {
    loadRequests();
  });
});

// Load on page load
loadRequests();

// Refresh every 2 seconds
setInterval(loadRequests, 2000);
