console.log('[Content Censor] Extension loaded');

const debuggerState = new Map();

async function checkDebuggers() {
  try {
    const targets = await chrome.debugger.getTargets();
    const tabs = await chrome.tabs.query({});

    for (const tab of tabs) {
      if (!tab.id || tab.url?.startsWith('chrome://') || tab.url?.startsWith('chrome-extension://')) {
        continue;
      }

      const target = targets.find(t => t.tabId === tab.id);
      const isAttached = target?.attached === true;
      const wasAttached = debuggerState.get(tab.id);

      if (isAttached && !wasAttached) {
        console.log(`[Content Censor] 🔴 Debugger attached to tab ${tab.id}`);
        debuggerState.set(tab.id, true);

        // Tell content script to censor
        chrome.tabs.sendMessage(tab.id, { type: 'CENSOR_CONTENT' }).catch(() => {});
      }
      else if (!isAttached && wasAttached) {
        console.log(`[Content Censor] 🟢 Debugger detached from tab ${tab.id}`);
        debuggerState.set(tab.id, false);

        // Tell content script to uncensor
        chrome.tabs.sendMessage(tab.id, { type: 'UNCENSOR_CONTENT' }).catch(() => {});
      }
    }
  } catch (error) {
    console.error('[Content Censor] Error:', error.message);
  }
}

setInterval(checkDebuggers, 100);

chrome.tabs.onRemoved.addListener((tabId) => {
  debuggerState.delete(tabId);
});

console.log('[Content Censor] Monitoring for debugger attachments');
