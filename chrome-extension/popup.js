// Popup script for ContextFort Security Extension

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[ContextFort] Popup loaded');

  // ===== CLICK DETECTION FEATURE =====

  const toggleClickDetectionBtn = document.getElementById('toggle-click-detection-btn');
  const clickDetectionStatus = document.getElementById('click-detection-status');

  // Load GLOBAL click detection state
  chrome.storage.local.get(['clickDetectionEnabled'], (result) => {
    const isClickDetectionActive = result.clickDetectionEnabled || false;
    updateClickDetectionUI(isClickDetectionActive);
  });

  // Toggle click detection button click handler
  toggleClickDetectionBtn.addEventListener('click', async () => {
    // Get current GLOBAL state
    const currentState = await new Promise((resolve) => {
      chrome.storage.local.get(['clickDetectionEnabled'], (result) => {
        resolve(result.clickDetectionEnabled || false);
      });
    });

    const newState = !currentState;

    // Update GLOBAL state in storage
    await chrome.storage.local.set({ clickDetectionEnabled: newState });

    // Send message to BACKGROUND SCRIPT to enable/disable globally
    try {
      await chrome.runtime.sendMessage({
        type: 'TOGGLE_CLICK_DETECTION_GLOBAL',
        enabled: newState
      });

      updateClickDetectionUI(newState);

      // Show success message
      clickDetectionStatus.textContent = newState
        ? 'Status: Active - Monitoring all tabs'
        : 'Status: Disabled';
    } catch (error) {
      console.error('[Popup] Error sending message to background:', error);
      clickDetectionStatus.textContent = 'Error: Try again';
      clickDetectionStatus.style.color = '#ff5252';
    }
  });

  // Update UI based on click detection state
  function updateClickDetectionUI(isActive) {
    if (isActive) {
      toggleClickDetectionBtn.textContent = 'Disable Click Detection';
      toggleClickDetectionBtn.classList.add('active');
      clickDetectionStatus.textContent = 'Status: Active - Monitoring all tabs';
      clickDetectionStatus.style.color = '#4CAF50';
    } else {
      toggleClickDetectionBtn.textContent = 'Enable Click Detection';
      toggleClickDetectionBtn.classList.remove('active');
      clickDetectionStatus.textContent = 'Status: Disabled';
      clickDetectionStatus.style.color = '#666';
    }
  }
});
