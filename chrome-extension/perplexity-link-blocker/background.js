console.log('[Link Blocker] Extension loaded');

const perplexityTabs = new Set();

// ============================================================================
// LINK BLOCKING - Prevents Perplexity from opening external links with query params
// ============================================================================

function isPerplexityUrl(url) {
  if (!url) return false;
  try {
    return new URL(url).hostname.includes('perplexity.ai');
  } catch {
    return false;
  }
}

function hasQueryParams(url) {
  if (!url) return false;
  try {
    return new URL(url).search.length > 0;
  } catch {
    return false;
  }
}

async function updateTabBlocking(tabId, shouldBlock) {
  if (!chrome.declarativeNetRequest) return;

  const ruleId = tabId;

  if (shouldBlock) {
    try {
      await chrome.declarativeNetRequest.updateSessionRules({
        removeRuleIds: [ruleId],
        addRules: [{
          id: ruleId,
          priority: 1,
          action: { type: 'block' },
          condition: {
            tabIds: [tabId],
            resourceTypes: ['main_frame'],
            regexFilter: '\\?.*',
            excludedRequestDomains: ['perplexity.ai']
          }
        }]
      });
    } catch (e) {}
  } else {
    try {
      await chrome.declarativeNetRequest.updateSessionRules({
        removeRuleIds: [ruleId]
      });
    } catch (e) {}
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url || changeInfo.status === 'complete') {
    const isPerplexity = isPerplexityUrl(tab.url);

    if (isPerplexity && !perplexityTabs.has(tabId)) {
      perplexityTabs.add(tabId);
      updateTabBlocking(tabId, true);
    } else if (!isPerplexity && perplexityTabs.has(tabId)) {
      perplexityTabs.delete(tabId);
      updateTabBlocking(tabId, false);
    }
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  perplexityTabs.delete(tabId);
  updateTabBlocking(tabId, false);
});

chrome.tabs.query({}, (tabs) => {
  tabs.forEach(tab => {
    if (isPerplexityUrl(tab.url)) {
      perplexityTabs.add(tab.id);
      updateTabBlocking(tab.id, true);
    }
  });
});

chrome.webNavigation.onCreatedNavigationTarget.addListener((details) => {
  const sourceTabId = details.sourceTabId;
  const newTabId = details.tabId;
  const targetUrl = details.url;
  const sourceFrameId = details.sourceFrameId;

  const checkAndBlock = (isFromPerplexity) => {
    if (!isFromPerplexity) return;

    const hasQuery = hasQueryParams(targetUrl);
    const isPerplexityDomain = isPerplexityUrl(targetUrl);

    if (hasQuery && !isPerplexityDomain) {
      chrome.tabs.remove(newTabId, () => {
        if (!chrome.runtime.lastError) {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon48.png',
            title: 'Link Blocked',
            message: `Blocked: ${new URL(targetUrl).hostname}`,
            priority: 2
          });
        }
      });
    }
  };

  if (perplexityTabs.has(sourceTabId)) {
    checkAndBlock(true);
  } else {
    chrome.webNavigation.getAllFrames({ tabId: sourceTabId }, (frames) => {
      if (chrome.runtime.lastError || !frames) return;

      const sourceFrame = frames.find(f => f.frameId === sourceFrameId);
      if (sourceFrame && isPerplexityUrl(sourceFrame.url)) {
        perplexityTabs.add(sourceTabId);
        updateTabBlocking(sourceTabId, true);
        checkAndBlock(true);
      }
    });
  }
});

console.log('[Link Blocker] Ready - Blocking external links with query params from Perplexity');
