console.log('[Content Censor] Content script loaded');

// Load sensitive words from storage
let sensitiveWords = ['ashwin', 'password', 'secret', 'token', 'api_key', 'ashwinramachandrang@gmail.com'];
let isCensored = false;
const censoredElements = new Set();
let mutationObserver = null;

chrome.storage.local.get(['sensitiveWords'], (result) => {
  if (result.sensitiveWords) {
    sensitiveWords = result.sensitiveWords;
    console.log('[Content Censor] Loaded sensitive words:', sensitiveWords);
  }
});

function containsSensitiveData(text) {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return sensitiveWords.some(word => lowerText.includes(word.toLowerCase()));
}

function redactText(text) {
  let redacted = text;
  sensitiveWords.forEach(word => {
    const regex = new RegExp(word, 'gi'); // Case insensitive, global
    redacted = redacted.replace(regex, '[REDACTED]');
  });
  return redacted;
}

function getAllTextNodes(element) {
  const textNodes = [];
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null
  );

  let node;
  while (node = walker.nextNode()) {
    if (node.textContent.trim()) {
      textNodes.push(node);
    }
  }

  return textNodes;
}

function censorElement(element) {
  // Skip if already censored
  if (censoredElements.has(element)) return false;

  // Skip script tags
  if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') {
    return false;
  }

  let wasCensored = false;

  // Handle input/textarea values
  if ((element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') && element.value) {
    if (containsSensitiveData(element.value)) {
      element.dataset.originalValue = element.value;
      element.value = redactText(element.value);
      censoredElements.add(element);
      console.log('[Content Censor] Redacted input value');
      wasCensored = true;
    }
  }

  // Handle all text nodes within element (recursively)
  const textNodes = getAllTextNodes(element);

  console.log(`[Content Censor] Found ${textNodes.length} text nodes in ${element.tagName}`);

  if (textNodes.length > 0) {
    textNodes.forEach(textNode => {
      console.log(`[Content Censor] Checking text node: "${textNode.textContent.substring(0, 50)}"`);

      if (containsSensitiveData(textNode.textContent)) {
        console.log('[Content Censor] ✓ Contains sensitive data!');

        // Store original HTML on the parent element
        const parentElement = textNode.parentElement;
        if (parentElement && !parentElement.dataset.originalText) {
          parentElement.dataset.originalText = parentElement.innerHTML;
          censoredElements.add(parentElement);
        }

        textNode.textContent = redactText(textNode.textContent);
        console.log('[Content Censor] Redacted text:', textNode.textContent.substring(0, 50));
        wasCensored = true;
      } else {
        console.log('[Content Censor] ✗ No sensitive data');
      }
    });
  }

  return wasCensored;
}

function censorContent() {
  if (isCensored) return;

  console.log('[Content Censor] 🔴 CENSORING CONTENT');

  // Censor all existing elements
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_ELEMENT,
    null
  );

  let node;
  while (node = walker.nextNode()) {
    censorElement(node);
  }

  isCensored = true;
  console.log(`[Content Censor] Censored ${censoredElements.size} elements`);

  // Start watching for new elements
  startContinuousCensoring();
}

function startContinuousCensoring() {
  if (mutationObserver) return; // Already observing

  console.log('[Content Censor] Started continuous monitoring for new elements');

  mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      // Check added nodes
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          console.log('[Content Censor] New element added:', node.tagName, node.className, node.textContent?.substring(0, 100));

          // Censor the added element
          censorElement(node);

          // Censor all children of the added element
          const walker = document.createTreeWalker(
            node,
            NodeFilter.SHOW_ELEMENT,
            null
          );

          let childNode;
          while (childNode = walker.nextNode()) {
            censorElement(childNode);
          }
        }
      });

      // Check for attribute/text changes in existing elements
      if (mutation.type === 'characterData' || mutation.type === 'attributes') {
        const element = mutation.target.nodeType === Node.ELEMENT_NODE
          ? mutation.target
          : mutation.target.parentElement;

        if (element) {
          censorElement(element);
        }
      }
    });
  });

  mutationObserver.observe(document.body, {
    childList: true,      // Watch for added/removed nodes
    subtree: true,        // Watch entire tree
    attributes: true,     // Watch attribute changes
    characterData: true,  // Watch text changes
    attributeOldValue: false,
    characterDataOldValue: false
  });
}

function stopContinuousCensoring() {
  if (mutationObserver) {
    mutationObserver.disconnect();
    mutationObserver = null;
    console.log('[Content Censor] Stopped continuous monitoring');
  }
}

function uncensorContent() {
  if (!isCensored) return;

  console.log('[Content Censor] 🟢 UNCENSORING CONTENT');

  // Stop monitoring for new elements
  stopContinuousCensoring();

  censoredElements.forEach(element => {
    // Restore original text
    if (element.dataset.originalText !== undefined) {
      element.innerHTML = element.dataset.originalText;
      delete element.dataset.originalText;
    }

    // Restore original input value
    if (element.dataset.originalValue !== undefined) {
      element.value = element.dataset.originalValue;
      delete element.dataset.originalValue;
    }
  });

  censoredElements.clear();
  isCensored = false;
  console.log('[Content Censor] Content restored');
}

// Listen for messages from background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CENSOR_CONTENT') {
    censorContent();
    sendResponse({ success: true });
  } else if (message.type === 'UNCENSOR_CONTENT') {
    uncensorContent();
    sendResponse({ success: true });
  }
});

console.log('[Content Censor] Ready - will censor on debugger attach');
