// Browser injector - captures DOM click events and sends to SDK API
// This can be loaded as a browser extension or injected via native messaging

(function() {
  'use strict';

  const SDK_API_URL = 'http://localhost:9999/api/events/dom';

  console.log('[Click Detection SDK] Browser injector loaded');

  // Function to detect if we're in an email compose window
  function isEmailCompose() {
    const url = window.location.href.toLowerCase();
    const title = document.title.toLowerCase();

    // Gmail
    if (url.includes('mail.google.com') && url.includes('compose')) {
      return true;
    }

    // Outlook/Hotmail
    if ((url.includes('outlook.live.com') || url.includes('outlook.office.com')) &&
        (url.includes('compose') || title.includes('compose'))) {
      return true;
    }

    // Yahoo Mail
    if (url.includes('mail.yahoo.com') && url.includes('compose')) {
      return true;
    }

    // Generic detection
    if (title.includes('compose') || title.includes('new message') || title.includes('draft')) {
      return true;
    }

    return false;
  }

  // Function to detect if target is an email send button
  function isEmailSendButton(target) {
    if (!target) return false;

    const text = (target.textContent || target.value || '').toLowerCase();
    const ariaLabel = (target.getAttribute('aria-label') || '').toLowerCase();
    const dataAction = (target.getAttribute('data-action') || '').toLowerCase();
    const className = (target.className || '').toLowerCase();

    // Common send button patterns
    const sendPatterns = [
      'send', 'enviar', 'envoyer', 'senden', // Multiple languages
      'submit', 'post'
    ];

    return sendPatterns.some(pattern =>
      text.includes(pattern) ||
      ariaLabel.includes(pattern) ||
      dataAction.includes(pattern) ||
      className.includes(pattern)
    );
  }

  // Function to show blocking popup
  function showBlockingPopup() {
    // Remove existing popup if any
    const existing = document.getElementById('sdk-blocking-popup');
    if (existing) existing.remove();

    const popup = document.createElement('div');
    popup.id = 'sdk-blocking-popup';
    popup.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #ff4757 0%, #ff6348 100%);
      color: white;
      padding: 30px 40px;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(255, 71, 87, 0.5);
      z-index: 999999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-width: 400px;
      animation: popupSlideIn 0.3s ease-out;
    `;

    popup.innerHTML = `
      <div style="text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 15px;">🛑</div>
        <div style="font-size: 1.5rem; font-weight: 700; margin-bottom: 10px;">
          SUSPICIOUS ACTIVITY BLOCKED
        </div>
        <div style="font-size: 1rem; margin-bottom: 20px; opacity: 0.9;">
          This email send attempt was detected as automated/suspicious behavior and has been blocked for your security.
        </div>
        <div style="font-size: 0.85rem; margin-bottom: 20px; padding: 12px; background: rgba(0, 0, 0, 0.2); border-radius: 8px;">
          ⚠️ If this was a legitimate action, please try clicking again manually.
        </div>
        <button id="sdk-popup-close" style="
          background: white;
          color: #ff4757;
          border: none;
          padding: 12px 30px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: transform 0.2s;
        ">
          OK, I Understand
        </button>
      </div>
    `;

    // Add popup styles
    if (!document.getElementById('sdk-popup-styles')) {
      const style = document.createElement('style');
      style.id = 'sdk-popup-styles';
      style.textContent = `
        @keyframes popupSlideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        #sdk-popup-close:hover {
          transform: scale(1.05);
        }

        #sdk-blocking-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          z-index: 999999998;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }

    // Add overlay
    const overlay = document.createElement('div');
    overlay.id = 'sdk-blocking-overlay';
    document.body.appendChild(overlay);
    document.body.appendChild(popup);

    // Close popup handler
    document.getElementById('sdk-popup-close').addEventListener('click', () => {
      popup.remove();
      overlay.remove();
    });

    // Auto-close after 10 seconds
    setTimeout(() => {
      if (document.getElementById('sdk-blocking-popup')) {
        popup.remove();
        overlay.remove();
      }
    }, 10000);

    // Play alert sound
    playBlockSound();
  }

  // Function to play blocking sound
  function playBlockSound() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Alert tone sequence
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);

      // Second beep
      setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        osc2.frequency.value = 600;
        osc2.type = 'sine';
        gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        osc2.start(audioContext.currentTime);
        osc2.stop(audioContext.currentTime + 0.3);
      }, 200);
    } catch (e) {
      console.error('[Click Detection SDK] Audio error:', e);
    }
  }

  // Listen for all click events in CAPTURE phase (before default action)
  document.addEventListener('click', async function(event) {
    const timestamp = Date.now() / 1000; // Convert to seconds

    // Determine action type and details
    const target = event.target.closest('a, button, input[type="submit"], input[type="button"], [role="button"]') || event.target;

    let actionType = 'click';
    let actionDetails = {};

    if (target.tagName === 'A') {
      actionType = 'navigation';
      actionDetails = {
        href: target.href,
        linkText: target.textContent.trim().substring(0, 100),
        isExternal: target.hostname !== window.location.hostname
      };
    } else if (target.tagName === 'BUTTON' || target.type === 'submit' || target.type === 'button') {
      actionType = 'button';
      actionDetails = {
        buttonText: target.textContent.trim().substring(0, 100) || target.value,
        buttonType: target.type
      };
    } else if (target.tagName === 'INPUT') {
      actionType = 'input';
      actionDetails = {
        inputType: target.type,
        inputName: target.name
      };
    }

    // Check if this is an email send button in compose window
    const isEmailSend = isEmailCompose() && isEmailSendButton(target);

    const clickData = {
      x: event.clientX,
      y: event.clientY,
      timestamp: timestamp,
      isTrusted: event.isTrusted,
      target: {
        tagName: target.tagName,
        id: target.id,
        className: target.className
      },
      action: {
        type: actionType,
        details: actionDetails
      },
      page: {
        url: window.location.href,
        title: document.title
      }
    };

    console.log('[Click Detection SDK] DOM click:', clickData);

    // Send to SDK API
    try {
      const response = await fetch(SDK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          x: clickData.x,
          y: clickData.y,
          timestamp: clickData.timestamp,
          action_type: clickData.action.type,
          action_details: JSON.stringify(clickData.action.details),
          page_url: clickData.page.url,
          page_title: clickData.page.title,
          target_tag: clickData.target.tagName,
          target_id: clickData.target.id,
          target_class: clickData.target.className,
          is_trusted: clickData.isTrusted
        })
      });

      const result = await response.json();

      if (result.is_suspicious) {
        console.warn('[Click Detection SDK] ⚠️ SUSPICIOUS CLICK DETECTED!', result);

        // If this is an email send button, BLOCK IT!
        if (isEmailSend) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();

          console.error('[Click Detection SDK] 🛑 EMAIL SEND BLOCKED - Suspicious activity detected!');
          showBlockingPopup();

          return false;
        }

        // For other suspicious clicks, just show visual warning
        showSuspiciousClickWarning(event.clientX, event.clientY);
      } else {
        console.log('[Click Detection SDK] ✓ Click verified as legitimate');
      }
    } catch (error) {
      console.error('[Click Detection SDK] Failed to send click:', error);
    }
  }, true); // Use capture phase to intercept BEFORE default action

  // Optional: Show visual warning for suspicious clicks
  function showSuspiciousClickWarning(x, y) {
    const warning = document.createElement('div');
    warning.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 40px;
      height: 40px;
      border: 3px solid red;
      border-radius: 50%;
      pointer-events: none;
      z-index: 999999;
      animation: pulse-warning 0.6s ease-out;
    `;

    // Add animation
    if (!document.getElementById('sdk-warning-styles')) {
      const style = document.createElement('style');
      style.id = 'sdk-warning-styles';
      style.textContent = `
        @keyframes pulse-warning {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(warning);
    setTimeout(() => warning.remove(), 600);
  }

  console.log('[Click Detection SDK] Monitoring active - Email protection enabled');
})();
