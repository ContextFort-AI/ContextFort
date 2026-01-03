/**
 * Simplified Dummy Data for ContextFort Dashboard Demo
 *
 * Contains only data needed for Screenshots and URL Logs pages
 */

// Helper functions
const generateTimestamp = (daysAgo = 0, hoursAgo = 0, minutesAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(date.getHours() - hoursAgo);
  date.setMinutes(date.getMinutes() - minutesAgo);
  return date.toISOString();
};

const generateSessionId = (index) => `session-${Date.now()}-${index}`;

// Generate colored placeholder screenshots (400x250 solid colors)
const colors = {
  // Blue gradient (Gmail)
  blue: 'iVBORw0KGgoAAAANSUhEUgAAAZAAAAD6CAYAAACPpxFEAAAACXBIWXMAAAsTAAALEwEAmpwYAAABWklEQVR4nO3BMQEAAADCoPVPbQwfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOA1AxkAAe0DYlUAAAAASUVORK5CYII=',
  // Green gradient (GitHub)
  green: 'iVBORw0KGgoAAAANSUhEUgAAAZAAAAD6CAYAAACPpxFEAAAACXBIWXMAAAsTAAALEwEAmpwYAAABVklEQVR4nO3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOBvBv4AAe2Vke0AAAAASUVORK5CYII=',
  // Red gradient (Suspicious)
  red: 'iVBORw0KGgoAAAANSUhEUgAAAZAAAAD6CAYAAACPpxFEAAAACXBIWXMAAAsTAAALEwEAmpwYAAABU0lEQVR4nO3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOBvBuYAAe0CSKcsAAAAAElFTkSuQmCC',
  // Yellow gradient (Reddit)
  yellow: 'iVBORw0KGgoAAAANSUhEUgAAAZAAAAD6CAYAAACPpxFEAAAACXBIWXMAAAsTAAALEwEAmpwYAAABVElEQVR4nO3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOBvBuIAAe2F6JMxAAAAAElFTkSuQmCC',
  // Purple gradient (Stack Overflow)
  purple: 'iVBORw0KGgoAAAANSUhEUgAAAZAAAAD6CAYAAACPpxFEAAAACXBIWXMAAAsTAAALEwEAmpwYAAABVUlEQVR4nO3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOBvBuoAAe1RYCHxAAAAAElFTkSuQmCC'
};

// ==================== SESSIONS ====================
export const dummySessions = [
  {
    id: generateSessionId(1),
    startTime: generateTimestamp(0, 2, 30),
    endTime: generateTimestamp(0, 1, 15),
    tabId: 12345,
    windowId: 1,
    active: false
  },
  {
    id: generateSessionId(2),
    startTime: generateTimestamp(0, 4, 0),
    endTime: generateTimestamp(0, 3, 20),
    tabId: 12346,
    windowId: 1,
    active: false
  },
  {
    id: generateSessionId(3),
    startTime: generateTimestamp(1, 2, 0),
    endTime: generateTimestamp(1, 0, 30),
    tabId: 12347,
    windowId: 1,
    active: false
  },
  {
    id: generateSessionId(4),
    startTime: generateTimestamp(2, 1, 0),
    endTime: generateTimestamp(2, 0, 15),
    tabId: 12348,
    windowId: 1,
    active: false
  },
  {
    id: generateSessionId(5),
    startTime: generateTimestamp(0, 0, 30),
    endTime: null,
    tabId: 12349,
    windowId: 1,
    active: true
  }
];

// ==================== SCREENSHOTS ====================
export const dummyScreenshots = [
  // Session 1: Gmail workflow
  {
    id: `screenshot-${Date.now()}-1`,
    sessionId: dummySessions[0].id,
    url: 'https://mail.google.com/mail/u/0/#inbox',
    dataUrl: `data:image/png;base64,${colors.blue}`,
    timestamp: generateTimestamp(0, 2, 28),
    eventType: 'click',
    clickedElement: {
      tag: 'button',
      id: 'compose-btn',
      class: 'primary-button'
    },
    reason: 'normal_click'
  },
  {
    id: `screenshot-${Date.now()}-2`,
    sessionId: dummySessions[0].id,
    url: 'https://mail.google.com/mail/u/0/#inbox/compose',
    dataUrl: `data:image/png;base64,${colors.green}`,
    timestamp: generateTimestamp(0, 2, 20),
    eventType: 'input',
    reason: 'input_detected'
  },
  {
    id: `screenshot-${Date.now()}-3`,
    sessionId: dummySessions[0].id,
    url: 'https://mail.google.com/mail/u/0/#inbox',
    dataUrl: `data:image/png;base64,${colors.red}`,
    timestamp: generateTimestamp(0, 2, 15),
    eventType: 'click',
    clickedElement: {
      tag: 'button',
      id: 'send-btn',
      class: 'send-button'
    },
    reason: 'suspicious_click'
  },
  {
    id: `screenshot-${Date.now()}-4`,
    sessionId: dummySessions[0].id,
    url: 'https://mail.google.com/mail/u/0/#sent',
    dataUrl: `data:image/png;base64,${colors.blue}`,
    timestamp: generateTimestamp(0, 2, 10),
    eventType: 'navigation',
    reason: 'page_load'
  },

  // Session 2: GitHub browsing
  {
    id: `screenshot-${Date.now()}-5`,
    sessionId: dummySessions[1].id,
    url: 'https://github.com/anthropics/claude-code',
    dataUrl: `data:image/png;base64,${colors.purple}`,
    timestamp: generateTimestamp(0, 3, 50),
    eventType: 'navigation',
    reason: 'page_load'
  },
  {
    id: `screenshot-${Date.now()}-6`,
    sessionId: dummySessions[1].id,
    url: 'https://github.com/anthropics/claude-code/issues',
    dataUrl: `data:image/png;base64,${colors.blue}`,
    timestamp: generateTimestamp(0, 3, 40),
    eventType: 'click',
    clickedElement: {
      tag: 'a',
      id: 'issues-tab',
      class: 'tab-link'
    },
    reason: 'normal_click'
  },
  {
    id: `screenshot-${Date.now()}-7`,
    sessionId: dummySessions[1].id,
    url: 'https://github.com/anthropics/claude-code/pulls',
    dataUrl: `data:image/png;base64,${colors.green}`,
    timestamp: generateTimestamp(0, 3, 30),
    eventType: 'click',
    clickedElement: {
      tag: 'a',
      id: 'pulls-tab',
      class: 'tab-link'
    },
    reason: 'normal_click'
  },

  // Session 3: Reddit browsing
  {
    id: `screenshot-${Date.now()}-8`,
    sessionId: dummySessions[2].id,
    url: 'https://www.reddit.com/r/programming',
    dataUrl: `data:image/png;base64,${colors.red}`,
    timestamp: generateTimestamp(1, 1, 50),
    eventType: 'navigation',
    reason: 'page_load'
  },
  {
    id: `screenshot-${Date.now()}-9`,
    sessionId: dummySessions[2].id,
    url: 'https://www.reddit.com/r/programming',
    dataUrl: `data:image/png;base64,${colors.blue}`,
    timestamp: generateTimestamp(1, 1, 45),
    eventType: 'scroll',
    reason: 'scroll_detected'
  },
  {
    id: `screenshot-${Date.now()}-10`,
    sessionId: dummySessions[2].id,
    url: 'https://www.reddit.com/r/programming/comments/abc123',
    dataUrl: `data:image/png;base64,${colors.yellow}`,
    timestamp: generateTimestamp(1, 1, 30),
    eventType: 'click',
    clickedElement: {
      tag: 'div',
      id: 'post-card',
      class: 'post-item'
    },
    reason: 'normal_click'
  },
  {
    id: `screenshot-${Date.now()}-11`,
    sessionId: dummySessions[2].id,
    url: 'https://www.reddit.com/r/programming/comments/abc123',
    dataUrl: `data:image/png;base64,${colors.green}`,
    timestamp: generateTimestamp(1, 1, 20),
    eventType: 'input',
    reason: 'input_detected'
  },

  // Session 4: Stack Overflow search
  {
    id: `screenshot-${Date.now()}-12`,
    sessionId: dummySessions[3].id,
    url: 'https://stackoverflow.com/questions',
    dataUrl: `data:image/png;base64,${colors.blue}`,
    timestamp: generateTimestamp(2, 0, 50),
    eventType: 'navigation',
    reason: 'page_load'
  },
  {
    id: `screenshot-${Date.now()}-13`,
    sessionId: dummySessions[3].id,
    url: 'https://stackoverflow.com/questions',
    dataUrl: `data:image/png;base64,${colors.purple}`,
    timestamp: generateTimestamp(2, 0, 45),
    eventType: 'input',
    reason: 'search_query'
  },
  {
    id: `screenshot-${Date.now()}-14`,
    sessionId: dummySessions[3].id,
    url: 'https://stackoverflow.com/questions/12345/how-to-fix-bug',
    dataUrl: `data:image/png;base64,${colors.green}`,
    timestamp: generateTimestamp(2, 0, 30),
    eventType: 'click',
    clickedElement: {
      tag: 'a',
      id: 'question-link',
      class: 'question-hyperlink'
    },
    reason: 'normal_click'
  },

  // Session 5: Current active session - Gmail
  {
    id: `screenshot-${Date.now()}-15`,
    sessionId: dummySessions[4].id,
    url: 'https://mail.google.com/mail/u/0/#inbox',
    dataUrl: `data:image/png;base64,${colors.blue}`,
    timestamp: generateTimestamp(0, 0, 25),
    eventType: 'navigation',
    reason: 'page_load'
  },
  {
    id: `screenshot-${Date.now()}-16`,
    sessionId: dummySessions[4].id,
    url: 'https://mail.google.com/mail/u/0/#inbox',
    dataUrl: `data:image/png;base64,${colors.red}`,
    timestamp: generateTimestamp(0, 0, 20),
    eventType: 'click',
    clickedElement: {
      tag: 'div',
      id: 'email-row',
      class: 'email-item'
    },
    reason: 'suspicious_click'
  },
  {
    id: `screenshot-${Date.now()}-17`,
    sessionId: dummySessions[4].id,
    url: 'https://mail.google.com/mail/u/0/#inbox/FMfcgzGpFXsPqWbXxJQfSmKvHnMBjKZP',
    dataUrl: `data:image/png;base64,${colors.yellow}`,
    timestamp: generateTimestamp(0, 0, 15),
    eventType: 'navigation',
    reason: 'page_load'
  }
];

// ==================== EXPORT ====================
export const dummyData = {
  sessions: dummySessions,
  screenshots: dummyScreenshots
};

export default dummyData;

// ==================== HELPER FUNCTIONS ====================

/**
 * Load dummy data into Chrome storage
 */
export async function loadDummyDataToStorage() {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    await chrome.storage.local.set({
      sessions: dummySessions,
      screenshots: dummyScreenshots
    });
    console.log('[Dummy Data] Loaded:', {
      sessions: dummySessions.length,
      screenshots: dummyScreenshots.length
    });
    return true;
  } else {
    console.error('[Dummy Data] Chrome storage not available');
    return false;
  }
}

/**
 * Clear all data from Chrome storage
 */
export async function clearAllData() {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    await chrome.storage.local.clear();
    console.log('[Dummy Data] Storage cleared');
    return true;
  }
  return false;
}
