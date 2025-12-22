// Popup script for POST Request Monitor + Text Blur Feature

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[POST Monitor] Popup loaded');

  // ===== TEXT BLUR FEATURE =====

  const blurWordsInput = document.getElementById('blur-words-input');
  const toggleBlurBtn = document.getElementById('toggle-blur-btn');
  const blurStatus = document.getElementById('blur-status');

  // Default words
  const DEFAULT_WORDS = ['Rishabh', 'Arya'];

  // Load saved words from storage
  chrome.storage.sync.get(['blurWords'], (result) => {
    const savedWords = result.blurWords || DEFAULT_WORDS;
    blurWordsInput.value = savedWords.join(', ');
  });

  // Load blur state for current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const tabId = tab.id;

  chrome.storage.local.get([`blurState_${tabId}`], (result) => {
    const isBlurActive = result[`blurState_${tabId}`] || false;
    updateBlurUI(isBlurActive);
  });

  // Toggle blur button click handler
  toggleBlurBtn.addEventListener('click', async () => {
    // Save words to storage
    const wordsText = blurWordsInput.value.trim();
    const words = wordsText
      ? wordsText.split(',').map(w => w.trim()).filter(w => w.length > 0)
      : DEFAULT_WORDS;

    await chrome.storage.sync.set({ blurWords: words });

    // Get current blur state
    const currentState = await new Promise((resolve) => {
      chrome.storage.local.get([`blurState_${tabId}`], (result) => {
        resolve(result[`blurState_${tabId}`] || false);
      });
    });

    const newState = !currentState;

    // Update state in storage
    await chrome.storage.local.set({ [`blurState_${tabId}`]: newState });

    // Send message to content script
    try {
      await chrome.tabs.sendMessage(tabId, {
        type: 'TOGGLE_BLUR',
        enabled: newState,
        words: words
      });

      updateBlurUI(newState);
    } catch (error) {
      console.error('[Popup] Error sending message to content script:', error);
      blurStatus.textContent = 'Error: Refresh page';
      blurStatus.style.color = '#ff5252';
    }
  });

  // Update UI based on blur state
  function updateBlurUI(isActive) {
    if (isActive) {
      toggleBlurBtn.textContent = 'Disable Auto-Blur';
      toggleBlurBtn.classList.add('active');
      blurStatus.textContent = 'Status: Active - Monitoring screenshots';
      blurStatus.style.color = '#4CAF50';
    } else {
      toggleBlurBtn.textContent = 'Enable Auto-Blur';
      toggleBlurBtn.classList.remove('active');
      blurStatus.textContent = 'Status: Disabled';
      blurStatus.style.color = '#666';
    }
  }

  // Auto-save words when user types (with debounce)
  let saveTimeout;
  blurWordsInput.addEventListener('input', () => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      const wordsText = blurWordsInput.value.trim();
      const words = wordsText
        ? wordsText.split(',').map(w => w.trim()).filter(w => w.length > 0)
        : DEFAULT_WORDS;
      chrome.storage.sync.set({ blurWords: words });
    }, 500);
  });

  // Test Screenshot button handler
  const testScreenshotBtn = document.getElementById('test-screenshot-btn');
  const screenshotStatus = document.getElementById('screenshot-status');

  testScreenshotBtn.addEventListener('click', async () => {
    screenshotStatus.textContent = '📸 Taking screenshot...';
    screenshotStatus.style.color = '#2196F3';
    testScreenshotBtn.disabled = true;

    try {
      const response = await chrome.tabs.sendMessage(tabId, {
        type: 'TEST_SCREENSHOT'
      });

      if (response && response.success) {
        screenshotStatus.textContent = '✅ Screenshot saved!';
        screenshotStatus.style.color = '#4CAF50';
      } else {
        screenshotStatus.textContent = '❌ Error: ' + (response?.error || 'Unknown error');
        screenshotStatus.style.color = '#ff5252';
      }
    } catch (error) {
      console.error('[Popup] Screenshot error:', error);
      screenshotStatus.textContent = '❌ Error: ' + error.message;
      screenshotStatus.style.color = '#ff5252';
    }

    testScreenshotBtn.disabled = false;

    // Clear status after 3 seconds
    setTimeout(() => {
      screenshotStatus.textContent = '';
    }, 3000);
  });

  // ===== CLICK DETECTION FEATURE =====

  const toggleClickDetectionBtn = document.getElementById('toggle-click-detection-btn');
  const clickDetectionStatus = document.getElementById('click-detection-status');

  // Load click detection state for current tab
  chrome.storage.local.get([`clickDetectionState_${tabId}`], (result) => {
    const isClickDetectionActive = result[`clickDetectionState_${tabId}`] || false;
    updateClickDetectionUI(isClickDetectionActive);
  });

  // Toggle click detection button click handler
  toggleClickDetectionBtn.addEventListener('click', async () => {
    // Get current state
    const currentState = await new Promise((resolve) => {
      chrome.storage.local.get([`clickDetectionState_${tabId}`], (result) => {
        resolve(result[`clickDetectionState_${tabId}`] || false);
      });
    });

    const newState = !currentState;

    // Update state in storage
    await chrome.storage.local.set({ [`clickDetectionState_${tabId}`]: newState });

    // Send message to content script
    try {
      await chrome.tabs.sendMessage(tabId, {
        type: 'TOGGLE_CLICK_DETECTION',
        enabled: newState
      });

      updateClickDetectionUI(newState);
    } catch (error) {
      console.error('[Popup] Error sending message to content script:', error);
      clickDetectionStatus.textContent = 'Error: Refresh page';
      clickDetectionStatus.style.color = '#ff5252';
    }
  });

  // Update UI based on click detection state
  function updateClickDetectionUI(isActive) {
    if (isActive) {
      toggleClickDetectionBtn.textContent = 'Disable Click Detection';
      toggleClickDetectionBtn.classList.add('active');
      clickDetectionStatus.textContent = 'Status: Active - Monitoring clicks';
      clickDetectionStatus.style.color = '#4CAF50';
    } else {
      toggleClickDetectionBtn.textContent = 'Enable Click Detection';
      toggleClickDetectionBtn.classList.remove('active');
      clickDetectionStatus.textContent = 'Status: Disabled';
      clickDetectionStatus.style.color = '#666';
    }
  }
});
