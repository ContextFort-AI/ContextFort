// Popup script for opening dashboard
document.addEventListener('DOMContentLoaded', async () => {
  const openDashboardBtn = document.getElementById('open-dashboard-btn');
  openDashboardBtn.addEventListener('click', () => {
    chrome.tabs.create({
      url: chrome.runtime.getURL('dashboard/home/index.html')
    });
  });
});