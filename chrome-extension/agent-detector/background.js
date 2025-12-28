console.log('[Agent Detector] Extension loaded');

// Track debugger state per tab
const debuggerState = new Map();
let checkCount = 0;

async function checkDebuggers() {
  try {
    const targets = await chrome.debugger.getTargets();
    const tabs = await chrome.tabs.query({});

    checkCount++;

    // Log every 20 checks (every 10 seconds)
    if (checkCount % 20 === 0) {
      console.log(`[Agent Detector] Still monitoring... (${checkCount} checks, ${tabs.length} tabs)`);
    }

    // Check each tab
    for (const tab of tabs) {
      if (!tab.id || tab.url?.startsWith('chrome://') || tab.url?.startsWith('chrome-extension://')) {
        continue;
      }

      const target = targets.find(t => t.tabId === tab.id);
      const isAttached = target?.attached === true;
      const wasAttached = debuggerState.get(tab.id);

      // State changed from not attached to attached
      if (isAttached && !wasAttached) {
        console.log('');
        console.log('🔴 ═══════════════════════════════════════════════════════');
        console.log('🔴 DEBUGGER ATTACHED');
        console.log('🔴 ═══════════════════════════════════════════════════════');
        console.log(`Tab ID: ${tab.id}`);
        console.log(`Tab Title: ${tab.title?.substring(0, 60)}`);
        console.log(`Tab URL: ${tab.url?.substring(0, 80)}`);
        console.log(`Target Type: ${target.type}`);
        console.log(`Attached: ${target.attached}`);
        console.log(`Time: ${new Date().toLocaleTimeString()}`);
        console.log('🔴 ═══════════════════════════════════════════════════════');
        console.log('');

        debuggerState.set(tab.id, true);
      }
      // State changed from attached to not attached
      else if (!isAttached && wasAttached) {
        console.log('');
        console.log('🟢 ═══════════════════════════════════════════════════════');
        console.log('🟢 DEBUGGER DETACHED');
        console.log('🟢 ═══════════════════════════════════════════════════════');
        console.log(`Tab ID: ${tab.id}`);
        console.log(`Tab Title: ${tab.title?.substring(0, 60)}`);
        console.log(`Tab URL: ${tab.url?.substring(0, 80)}`);
        console.log(`Time: ${new Date().toLocaleTimeString()}`);
        console.log('🟢 ═══════════════════════════════════════════════════════');
        console.log('');

        debuggerState.set(tab.id, false);
      }
    }
  } catch (error) {
    console.error('[Agent Detector] Error checking debuggers:', error.message);
  }
}

// Start polling every 500ms
setInterval(checkDebuggers, 500);

// Clean up state when tabs close
chrome.tabs.onRemoved.addListener((tabId) => {
  debuggerState.delete(tabId);
});

console.log('[Agent Detector] Monitoring for debugger attachments every 500ms');
