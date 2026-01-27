// Popup script for opening dashboard

document.addEventListener('DOMContentLoaded', async () => {
  const openDashboardBtn = document.getElementById('open-dashboard-btn');
  const restoreSessionBtn = document.getElementById('restore-session-btn');
  const agentStatusDiv = document.getElementById('agent-status');
  const swappedDomainsSpan = document.getElementById('swapped-domains');

  // Open dashboard
  openDashboardBtn.addEventListener('click', () => {
    chrome.tabs.create({
      url: chrome.runtime.getURL('dashboard/home/index.html')
    });
  });

  // Check agent status
  async function checkAgentStatus() {
    try {
      // Get active tab
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      console.log('[Popup] Active tab:', activeTab?.id, activeTab?.url);

      if (activeTab) {
        // Ask background for agent status
        console.log('[Popup] Sending GET_AGENT_STATUS for tab:', activeTab.id);
        chrome.runtime.sendMessage({
          type: 'GET_AGENT_STATUS',
          tabId: activeTab.id
        }, (response) => {
          console.log('[Popup] Received response:', response);

          if (response && response.isAgentActive) {
            console.log('[Popup] Agent IS active! Showing button...');
            // Show agent active status
            agentStatusDiv.classList.remove('hidden');
            restoreSessionBtn.classList.remove('hidden');

            // Show swapped domains
            if (response.swappedDomains && response.swappedDomains.length > 0) {
              swappedDomainsSpan.textContent = `Domains: ${response.swappedDomains.join(', ')}`;
              console.log('[Popup] Swapped domains:', response.swappedDomains);
            }
          } else {
            console.log('[Popup] Agent NOT active, hiding button');
            // Hide agent status
            agentStatusDiv.classList.add('hidden');
            restoreSessionBtn.classList.add('hidden');
          }
        });
      }
    } catch (e) {
      console.error('[Popup] Failed to check agent status:', e);
    }
  }

  // Restore human session
  restoreSessionBtn.addEventListener('click', async () => {
    try {
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (activeTab) {
        chrome.runtime.sendMessage({
          type: 'RESTORE_HUMAN_SESSION',
          tabId: activeTab.id
        }, (response) => {
          if (response && response.success) {
            // Close popup after successful restore
            window.close();
          }
        });
      }
    } catch (e) {
      console.error('Failed to restore session:', e);
    }
  });

  // Initial check
  checkAgentStatus();

  // Refresh status every 2 seconds
  setInterval(checkAgentStatus, 2000);
});
