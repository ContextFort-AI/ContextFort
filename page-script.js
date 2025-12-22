// Page Context Script - runs in 'MAIN' world to access window.html2canvas
// This bypasses content script isolation and CSP restrictions

(function() {
  console.log('[Auto-Blur Page] Script loaded in page context (world: MAIN)');

  let originalHtml2Canvas = null;
  let isWrapped = false;

  // Function to wrap html2canvas
  function wrapHtml2Canvas() {
    if (isWrapped) {
      console.log('[Auto-Blur Page] html2canvas already wrapped, skipping');
      return true;
    }

    const h2c = window.html2canvas;
    if (!h2c || typeof h2c !== 'function') {
      return false;
    }

    console.log('[Auto-Blur Page] 🎯 Found html2canvas! Wrapping it now...');
    originalHtml2Canvas = h2c;

    // Create wrapper function that communicates with content script
    window.html2canvas = async function(...args) {
      console.log('[Auto-Blur Page] ✅ html2canvas called! Args:', args.length, 'First arg:', args[0]?.tagName || args[0]);

      // Send message to content script to apply blur
      window.postMessage({
        type: 'AUTO_BLUR_SCREENSHOT_START',
        source: 'auto-blur-page-script'
      }, '*');

      // Wait for content script to blur (give it time to apply blur)
      await new Promise(resolve => {
        const listener = (event) => {
          if (event.data && event.data.type === 'AUTO_BLUR_READY') {
            console.log('[Auto-Blur Page] ✅ Blur ready, waiting 100ms more...');
            window.removeEventListener('message', listener);
            resolve();
          }
        };
        window.addEventListener('message', listener);

        // Timeout after 300ms if no response
        setTimeout(() => {
          window.removeEventListener('message', listener);
          resolve();
        }, 300);
      });

      // Extra wait to ensure CSS filter is fully rendered
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log('[Auto-Blur Page] ⏰ Proceeding with html2canvas now');

      // Call original html2canvas (will capture blurred content)
      try {
        const result = await originalHtml2Canvas.apply(this, args);
        console.log('[Auto-Blur Page] html2canvas completed successfully');

        // Tell content script to remove blur
        window.postMessage({
          type: 'AUTO_BLUR_SCREENSHOT_END',
          source: 'auto-blur-page-script'
        }, '*');

        return result;
      } catch (error) {
        console.error('[Auto-Blur Page] html2canvas error:', error);
        // Remove blur even on error
        window.postMessage({
          type: 'AUTO_BLUR_SCREENSHOT_END',
          source: 'auto-blur-page-script'
        }, '*');
        throw error;
      }
    };

    // Preserve function properties
    Object.setPrototypeOf(window.html2canvas, originalHtml2Canvas);
    for (const key in originalHtml2Canvas) {
      if (originalHtml2Canvas.hasOwnProperty(key)) {
        window.html2canvas[key] = originalHtml2Canvas[key];
      }
    }

    isWrapped = true;
    console.log('[Auto-Blur Page] ✅ html2canvas wrapped successfully!');
    return true;
  }

  // Try to wrap immediately
  if (wrapHtml2Canvas()) {
    console.log('[Auto-Blur Page] Wrapped html2canvas on first try');
  } else {
    console.log('[Auto-Blur Page] html2canvas not found yet, watching for it...');

    // Watch for html2canvas to be added
    let checkCount = 0;
    const checkInterval = setInterval(() => {
      checkCount++;
      if (wrapHtml2Canvas()) {
        clearInterval(checkInterval);
        console.log('[Auto-Blur Page] Successfully wrapped html2canvas after', checkCount, 'checks');
      } else if (checkCount >= 100) {
        clearInterval(checkInterval);
        console.log('[Auto-Blur Page] Gave up after 100 checks');
      }
    }, 100);

    // Also watch for script tags being added
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.tagName === 'SCRIPT' &&
              ((node.src && node.src.includes('html2canvas')) ||
               (node.textContent && node.textContent.includes('html2canvas')))) {
            console.log('[Auto-Blur Page] html2canvas script detected, will check after load');
            if (node.src) {
              node.addEventListener('load', () => {
                setTimeout(() => wrapHtml2Canvas(), 100);
              });
            } else {
              setTimeout(() => wrapHtml2Canvas(), 100);
            }
          }
        }
      }
    });

    if (document.documentElement) {
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }
  }

  // Listen for screenshot requests from content script
  window.addEventListener('message', async (event) => {
    if (event.data && event.data.type === 'TAKE_SCREENSHOT_REQUEST' && event.data.source === 'content-script') {
      const requestId = event.data.requestId;
      console.log('[Auto-Blur Page] Screenshot request received:', requestId);

      try {
        if (typeof html2canvas === 'undefined') {
          throw new Error('html2canvas not available');
        }

        console.log('[Auto-Blur Page] Calling html2canvas for screenshot...');
        const canvas = await html2canvas(document.body, {
          allowTaint: true,
          useCORS: false,
          scale: 1,
          logging: false,
          foreignObjectRendering: false,
          removeContainer: true,
          backgroundColor: '#ffffff',
          windowWidth: document.documentElement.scrollWidth,
          windowHeight: document.documentElement.scrollHeight
        });

        console.log('[Auto-Blur Page] Converting to image...');
        const dataUrl = canvas.toDataURL('image/png');

        // Create download
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const filename = 'screenshot-' + timestamp + '.png';

        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.click();

        console.log('[Auto-Blur Page] ✅ Screenshot downloaded:', filename);

        // Send success message back
        window.postMessage({
          type: 'SCREENSHOT_RESULT',
          source: 'page-script',
          requestId: requestId,
          success: true,
          filename: filename
        }, '*');

      } catch (error) {
        console.error('[Auto-Blur Page] ❌ Screenshot error:', error);

        // Send error message back
        window.postMessage({
          type: 'SCREENSHOT_RESULT',
          source: 'page-script',
          requestId: requestId,
          success: false,
          error: error.message
        }, '*');
      }
    }
  });

  console.log('[Auto-Blur Page] Screenshot listener ready');
})();
