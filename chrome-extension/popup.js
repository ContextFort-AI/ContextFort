// Popup script for opening dashboard

document.addEventListener('DOMContentLoaded', () => {
  const openDashboardBtn = document.getElementById('open-dashboard-btn');

  openDashboardBtn.addEventListener('click', () => {
    chrome.tabs.create({
      url: chrome.runtime.getURL('dashboard/dashboard/screenshots/index.html')
    });
  });
});
