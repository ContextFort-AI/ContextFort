// Vanilla JS to override React and inject data dynamically from Chrome storage
// This bypasses Next.js hydration issues

console.log('[Dashboard Override] Loading...');

// Pagination state
let currentPage = 1;
const itemsPerPage = 20;

// Separate pagination for Human Requests page (2 sections)
let humanSection1Page = 1;
let humanSection2Page = 1;

// Wait for page to load
window.addEventListener('DOMContentLoaded', () => {
  console.log('[Dashboard Override] DOM loaded, loading data from storage...');

  // Detect which page we're on
  const path = window.location.pathname;
  console.log('[Dashboard Override] Current path:', path);

  // Load data from Chrome storage
  loadDataAndInject();

  // Auto-refresh every 5 seconds (but keep the same page)
  // Don't auto-refresh on React-managed pages or screenshots page (to avoid collapsing expanded sessions)
  setInterval(() => {
    const pageType = getPageType();
    if (pageType !== 'whitelist' && pageType !== 'sensitive-words' && pageType !== 'screenshots') {
      loadDataAndInject(false);
    }
  }, 5000);
});

// Detect which page we're on
function getPageType() {
  const path = window.location.pathname;
  if (path.includes('human-requests')) return 'human';
  if (path.includes('bot-requests')) return 'bot';
  if (path.includes('post-requests')) return 'post';
  if (path.includes('click-detection')) return 'click-detection';
  if (path.includes('downloads')) return 'downloads';
  if (path.includes('screenshots')) return 'screenshots';
  if (path.includes('whitelist')) return 'whitelist';
  if (path.includes('sensitive-words')) return 'sensitive-words';
  return null;
}

// Load data from Chrome storage and inject into page
async function loadDataAndInject(resetPage = true) {
  try {
    const pageType = getPageType();
    if (!pageType) {
      console.log('[Dashboard Override] Not on a requests page, skipping...');
      return;
    }

    // Handle Click Detection separately (uses different storage key)
    if (pageType === 'click-detection') {
      const result = await chrome.storage.local.get(['clickEvents']);
      const clickEvents = result.clickEvents || [];
      console.log('[Dashboard Override] Loaded', clickEvents.length, 'click events from storage');

      if (resetPage) {
        currentPage = 1;
      }

      updateClickDetectionStats(clickEvents);
      injectClickDetection(clickEvents);
      return;
    }

    // Handle Downloads separately (uses different storage key)
    if (pageType === 'downloads') {
      const result = await chrome.storage.local.get(['downloadRequests']);
      const downloads = result.downloadRequests || [];
      console.log('[Dashboard Override] Loaded', downloads.length, 'downloads from storage');

      if (resetPage) {
        currentPage = 1;
      }

      updateDownloadsStats(downloads);
      injectDownloads(downloads);
      return;
    }

    // Handle Screenshots separately (uses different storage keys)
    if (pageType === 'screenshots') {
      const result = await chrome.storage.local.get(['screenshots', 'sessions']);
      const screenshots = result.screenshots || [];
      const sessions = result.sessions || [];
      console.log('[Dashboard Override] Loaded', screenshots.length, 'screenshots and', sessions.length, 'sessions from storage');

      if (resetPage) {
        currentPage = 1;
      }

      updateScreenshotsStats(screenshots, sessions);
      injectScreenshots(screenshots, sessions);

      // Enable Clear All and Refresh buttons
      addScreenshotButtonHandlers();

      return;
    }

    // Handle Whitelist page - load data and inject
    if (pageType === 'whitelist') {
      const whitelistResult = await chrome.storage.local.get(['whitelist']);
      const whitelist = whitelistResult.whitelist || { urls: [], hostnames: [] };
      console.log('[Dashboard Override] Loaded whitelist:', whitelist);
      injectWhitelist(whitelist);
      attachWhitelistHandlers();
      return;
    }

    // Handle Sensitive Words page - load data and inject
    if (pageType === 'sensitive-words') {
      const wordsResult = await chrome.storage.local.get(['sensitiveWords']);
      const words = wordsResult.sensitiveWords || DEFAULT_SENSITIVE_WORDS;
      console.log('[Dashboard Override] Loaded sensitive words:', words);
      injectSensitiveWords(words);
      attachSensitiveWordsHandlers();
      return;
    }

    // Get data from Chrome storage for other pages
    const result = await chrome.storage.local.get(['blockedRequests']);
    const allRequests = result.blockedRequests || [];

    console.log('[Dashboard Override] Loaded', allRequests.length, 'requests from storage');

    // Filter data based on page type
    let filteredRequests = [];

    if (pageType === 'human') {
      // Human requests: ALL requests where is_bot=false (will be split into sections in injectHumanRequests)
      filteredRequests = allRequests.filter(req => req.is_bot === false);
      console.log('[Dashboard Override] Found', filteredRequests.length, 'total human requests');
    } else if (pageType === 'bot') {
      // Bot requests: is_bot=true
      filteredRequests = allRequests.filter(req => req.is_bot === true);
      console.log('[Dashboard Override] Found', filteredRequests.length, 'bot requests');
    } else if (pageType === 'post') {
      // Blocked Requests: ONLY requests that were ACTUALLY BLOCKED (status='blocked')
      // These are BOT requests with user input data that were prevented from executing
      filteredRequests = allRequests.filter(req =>
        req.status === 'blocked' &&
        req.is_bot === true &&
        req.has_click_correlation === true &&
        req.matched_fields && req.matched_fields.length > 0
      );
      console.log('[Dashboard Override] Found', filteredRequests.length, 'BLOCKED bot requests');
      console.log('[Dashboard Override] Total requests in storage:', allRequests.length);

      // Debug: Show how many requests meet each condition
      const botRequests = allRequests.filter(req => req.is_bot === true);
      const withCorrelation = allRequests.filter(req => req.has_click_correlation === true);
      const withMatchedFields = allRequests.filter(req => req.matched_fields && req.matched_fields.length > 0);
      const withBlockedStatus = allRequests.filter(req => req.status === 'blocked');
      console.log('[Dashboard Override] Debug counts:', {
        bot: botRequests.length,
        withCorrelation: withCorrelation.length,
        withMatchedFields: withMatchedFields.length,
        blockedStatus: withBlockedStatus.length
      });
    }

    // Reset to page 1 if requested
    if (resetPage) {
      currentPage = 1;
      humanSection1Page = 1;
      humanSection2Page = 1;
    }

    // Update stat cards first
    updateStatCards(pageType, filteredRequests, allRequests);

    // Inject the data based on page type
    if (pageType === 'human') {
      injectHumanRequests(filteredRequests);
    } else if (pageType === 'bot') {
      injectBotRequests(filteredRequests);
    } else if (pageType === 'post') {
      injectPostRequests(filteredRequests);
    }
  } catch (error) {
    console.error('[Dashboard Override] Error loading data:', error);
  }
}

// Format timestamp
function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } else {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
}

// Update stat cards
function updateStatCards(pageType, filteredRequests, allRequests) {
  // Find all stat card value elements (large numbers)
  const statValues = Array.from(document.querySelectorAll('[class*="text-"]')).filter(el => {
    const classes = String(el.className || ''); // Convert to string explicitly
    // Look for large text elements (stat values are typically text-3xl or text-4xl)
    return (classes.includes('text-3xl') || classes.includes('text-4xl') || classes.includes('text-2xl')) &&
           classes.includes('font-');
  });

  console.log('[Dashboard Override] Found', statValues.length, 'stat value elements');

  if (pageType === 'bot') {
    // Bot page stats: Total Bot Requests, Detection Rate, Unique Targets
    const totalBots = filteredRequests.length;
    const totalRequests = allRequests.length;
    const detectionRate = totalRequests > 0 ? ((totalBots / totalRequests) * 100).toFixed(1) : '0';
    const uniqueHostnames = new Set(filteredRequests.map(r => r.target_hostname)).size;

    if (statValues.length >= 3) {
      statValues[0].textContent = totalBots.toString();
      statValues[1].textContent = `${detectionRate}%`;
      statValues[2].textContent = uniqueHostnames.toString();
      console.log('[Dashboard Override] Updated bot stats:', totalBots, detectionRate + '%', uniqueHostnames);
    }
  } else if (pageType === 'human') {
    // Human page stats: Total Human Requests, User Input Requests, Background Requests
    const humanWithInput = filteredRequests.length;
    const humanBackground = allRequests.filter(req =>
      req.is_bot === false &&
      req.has_click_correlation === false
    ).length;
    const totalHuman = humanWithInput + humanBackground;

    if (statValues.length >= 3) {
      statValues[0].textContent = totalHuman.toString();
      statValues[1].textContent = humanWithInput.toString();
      statValues[2].textContent = humanBackground.toString();
      console.log('[Dashboard Override] Updated human stats:', totalHuman, humanWithInput, humanBackground);
    }
  } else if (pageType === 'post') {
    // POST page stats: Total Blocked Requests (with user input), Today's Blocked, Unique Domains
    const totalRequests = filteredRequests.length;
    const today = new Date().toDateString();
    const todayRequests = filteredRequests.filter(req => {
      const reqDate = new Date(req.timestamp).toDateString();
      return reqDate === today;
    }).length;
    const uniqueDomains = new Set(filteredRequests.map(r => r.target_hostname)).size;

    if (statValues.length >= 3) {
      statValues[0].textContent = totalRequests.toString();
      statValues[1].textContent = todayRequests.toString();
      statValues[2].textContent = uniqueDomains.toString();
      console.log('[Dashboard Override] Updated POST stats (blocked with input):', totalRequests, todayRequests, uniqueDomains);
    }
  }
}

// Inject HUMAN requests table
function injectHumanRequests(allHumanRequests) {
  // Split human requests into two categories
  const requestsWithInput = allHumanRequests.filter(req =>
    req.has_click_correlation === true &&
    req.matched_fields && req.matched_fields.length > 0
  );

  const backgroundRequests = allHumanRequests.filter(req =>
    req.has_click_correlation === false
  );

  console.log('[Dashboard Override] Human requests split:', {
    withInput: requestsWithInput.length,
    background: backgroundRequests.length
  });

  // Find the CardContent containers using data-slot attribute
  const mainElement = document.querySelector('main');

  if (!mainElement) {
    console.error('[Dashboard Override] Could not find main element');
    return;
  }

  const cardContents = mainElement.querySelectorAll('[data-slot="card-content"]');
  console.log('[Dashboard Override] Found', cardContents.length, 'CardContent elements');

  if (cardContents.length < 5) {
    console.error('[Dashboard Override] Not enough CardContent containers for Human Requests page');
    return;
  }

  // Container indices: 0,1,2 = stat cards, 3 = section 1 table, 4 = section 2 table
  const section1Container = cardContents[3]; // "Human POST Requests with User Input Data"
  const section2Container = cardContents[4]; // "Background Requests (Human)"

  // Helper function to generate table HTML for a set of requests
  function generateTableHTML(requests, sectionType, sectionPage) {
    // Calculate pagination
    const totalPages = Math.ceil(requests.length / itemsPerPage);
    const startIndex = (sectionPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedRequests = requests.slice(startIndex, endIndex);

    if (requests.length === 0) {
      const emptyMessage = sectionType === 'withInput'
        ? 'No requests with user input detected yet.'
        : 'No background requests detected yet.';
      return `
        <div class="rounded-md border">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b bg-muted/50">
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[120px]">Time</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Target URL</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[180px]">Hostname</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Matched Fields</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Matched Input Values</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[150px]">Click Correlation</th>
              </tr>
            </thead>
            <tbody>
              <tr><td colspan="6" class="p-8 text-center text-muted-foreground">${emptyMessage}</td></tr>
            </tbody>
          </table>
        </div>
      `;
    }

    const tableRows = paginatedRequests.map((req) => {
      const timestamp = formatTime(req.timestamp);
      const targetUrl = req.target_url.length > 50 ? req.target_url.substring(0, 50) + '...' : req.target_url;

      const matchedFields = req.matched_fields || [];
      const matchedFieldsBadges = matchedFields.slice(0, 3).map(field =>
          `<span class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">${field}</span>`
        ).join('');

      const extraFieldsCount = matchedFields.length > 3 ?
        `<span class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">+${matchedFields.length - 3}</span>` : '';

      let matchedValuesHtml = '<span class="text-xs text-muted-foreground italic">No input data</span>';
      if (req.matched_values && Object.keys(req.matched_values).length > 0) {
        const entries = Object.entries(req.matched_values).slice(0, 2);
        matchedValuesHtml = entries.map(([key, value]) => {
          const displayValue = value.length > 30 ? value.substring(0, 30) + '...' : value;
          return `<div class="text-xs"><span class="font-medium text-muted-foreground">${key}:</span><span class="text-foreground"> ${displayValue}</span></div>`;
        }).join('');

        if (Object.keys(req.matched_values).length > 2) {
          matchedValuesHtml += `<span class="text-xs text-muted-foreground">+${Object.keys(req.matched_values).length - 2} more</span>`;
        }
      }

      // Show correlation badge if available
      let correlationHtml = '<span class="text-xs text-muted-foreground italic">No correlation</span>';
      if (req.has_click_correlation && req.click_time_diff_ms !== undefined) {
        correlationHtml = `
          <div class="flex flex-col gap-1">
            <span class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80 gap-1 w-fit">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle-2 h-3 w-3"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
              Correlated
            </span>
            <div class="text-muted-foreground">Δt: ${req.click_time_diff_ms}ms</div>
          </div>
        `;
      }

      return `
        <tr class="border-b transition-colors hover:bg-muted/50 bg-green-500/5">
          <td class="p-4 align-middle font-medium text-muted-foreground">${timestamp}</td>
          <td class="p-4 align-middle">
            <code class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] text-xs font-mono">${targetUrl}</code>
          </td>
          <td class="p-4 align-middle">
            <span class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80">${req.target_hostname}</span>
          </td>
          <td class="p-4 align-middle">
            <div class="flex flex-wrap gap-1">${matchedFieldsBadges}${extraFieldsCount}</div>
          </td>
          <td class="p-4 align-middle">
            <div class="flex flex-col gap-1 max-w-xs">${matchedValuesHtml}</div>
          </td>
          <td class="p-4 align-middle text-xs">
            ${correlationHtml}
          </td>
        </tr>`;
    }).join('');

    // Build pagination HTML
    let paginationHtml = '';
    if (totalPages > 1) {
      const sectionClass = sectionType === 'withInput' ? 'section1' : 'section2';
      paginationHtml = `
        <div class="flex items-center justify-between pt-4">
          <div class="text-sm text-muted-foreground">
            Showing ${startIndex + 1} to ${Math.min(endIndex, requests.length)} of ${requests.length} requests
          </div>
          <div class="flex items-center gap-2">
            <button
              class="pagination-prev-${sectionClass} inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
              ${sectionPage === 1 ? 'disabled' : ''}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="m15 18-6-6 6-6"/></svg>
              Previous
            </button>
            <div class="text-sm font-medium">
              Page ${sectionPage} of ${totalPages}
            </div>
            <button
              class="pagination-next-${sectionClass} inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
              ${sectionPage === totalPages ? 'disabled' : ''}
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      `;
    }

    return `
      <div>
        <div class="rounded-md border">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b bg-muted/50">
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[120px]">Time</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Target URL</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[180px]">Hostname</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Matched Fields</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Matched Input Values</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[150px]">Click Correlation</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
        ${paginationHtml}
      </div>
    `;
  }

  // Inject Section 1: Human POST Requests with User Input Data
  try {
    const section1HTML = generateTableHTML(requestsWithInput, 'withInput', humanSection1Page);
    section1Container.innerHTML = section1HTML;
    console.log('[Dashboard Override] Section 1 (with input) injected:', requestsWithInput.length, 'requests');

    // Attach event listeners for Section 1 pagination
    setTimeout(() => {
      const prevBtn = section1Container.querySelector('.pagination-prev-section1');
      const nextBtn = section1Container.querySelector('.pagination-next-section1');

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          if (humanSection1Page > 1) {
            humanSection1Page--;
            loadDataAndInject(false);
          }
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          const totalPages = Math.ceil(requestsWithInput.length / itemsPerPage);
          if (humanSection1Page < totalPages) {
            humanSection1Page++;
            loadDataAndInject(false);
          }
        });
      }
    }, 100);
  } catch (error) {
    console.error('[Dashboard Override] Error injecting section 1:', error);
  }

  // Inject Section 2: Background Requests (Human)
  try {
    const section2HTML = generateTableHTML(backgroundRequests, 'background', humanSection2Page);
    section2Container.innerHTML = section2HTML;
    console.log('[Dashboard Override] Section 2 (background) injected:', backgroundRequests.length, 'requests');

    // Attach event listeners for Section 2 pagination
    setTimeout(() => {
      const prevBtn = section2Container.querySelector('.pagination-prev-section2');
      const nextBtn = section2Container.querySelector('.pagination-next-section2');

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          if (humanSection2Page > 1) {
            humanSection2Page--;
            loadDataAndInject(false);
          }
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          const totalPages = Math.ceil(backgroundRequests.length / itemsPerPage);
          if (humanSection2Page < totalPages) {
            humanSection2Page++;
            loadDataAndInject(false);
          }
        });
      }
    }, 100);
  } catch (error) {
    console.error('[Dashboard Override] Error injecting section 2:', error);
  }

  console.log('[Dashboard Override] Human requests data injected successfully!');
}

// Inject BOT requests table
function injectBotRequests(requests) {
  // Calculate pagination
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRequests = requests.slice(startIndex, endIndex);

  // Find the CardContent directly using data-slot attribute
  let targetContainer = null;

  const mainElement = document.querySelector('main');

  if (mainElement) {
    console.log('[Dashboard Override] Found main element');

    // Strategy 1: Directly find ALL CardContent elements with data-slot="card-content" in main
    const cardContents = mainElement.querySelectorAll('[data-slot="card-content"]');
    console.log('[Dashboard Override] Found', cardContents.length, 'CardContent elements');

    // The table card is the LAST CardContent (after stats cards)
    if (cardContents.length > 0) {
      targetContainer = cardContents[cardContents.length - 1];
      console.log('[Dashboard Override] Found target container for bot requests via data-slot (last CardContent)');
    }
  }

  if (!targetContainer) {
    console.error('[Dashboard Override] Could not find target container in main element for bot requests');
    return;
  }

  // Clear the container content
  targetContainer.innerHTML = '';

  // Generate table rows
  let tableRows = '';

  if (requests.length === 0) {
    tableRows = '<tr><td colspan="6" class="p-8 text-center text-muted-foreground">No bot requests detected yet.</td></tr>';
  } else {
    tableRows = paginatedRequests.map((req) => {
        const timestamp = formatTime(req.timestamp);
        const targetUrl = req.target_url.length > 50 ? req.target_url.substring(0, 50) + '...' : req.target_url;

        return `
              <tr class="border-b transition-colors hover:bg-muted/50 bg-red-500/5">
                <td class="p-4 align-middle font-medium text-muted-foreground">${timestamp}</td>
                <td class="p-4 align-middle">
                  <span class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent">${req.request_method || 'GET'}</span>
                </td>
                <td class="p-4 align-middle">
                  <code class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] text-xs font-mono">${targetUrl}</code>
                </td>
                <td class="p-4 align-middle">
                  <span class="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold bg-red-500 text-white">${req.target_hostname}</span>
                </td>
                <td class="p-4 align-middle text-xs">
                  <div>ID: #${req.click_correlation_id || 'N/A'}</div>
                  <div>Δt: ${req.click_time_diff_ms || 0}ms</div>
                </td>
                <td class="p-4 align-middle">
                  <span class="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold bg-red-500 text-white gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                    Bot
                  </span>
                </td>
              </tr>`;
      }).join('');
    }

    // Build pagination HTML
    let paginationHtml = '';
    if (requests.length > 0) {
      paginationHtml = `
        <div class="flex items-center justify-between pt-4">
          <div class="text-sm text-muted-foreground">
            Showing ${startIndex + 1} to ${Math.min(endIndex, requests.length)} of ${requests.length} requests
          </div>
          <div class="flex items-center gap-2">
            <button
              class="pagination-prev inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
              ${currentPage === 1 ? 'disabled' : ''}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="m15 18-6-6 6-6"/></svg>
              Previous
            </button>
            <div class="text-sm font-medium">
              Page ${currentPage} of ${totalPages}
            </div>
            <button
              class="pagination-next inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
              ${currentPage === totalPages ? 'disabled' : ''}
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      `;
    }

    const tableHTML = `
      <div>
        <div class="rounded-md border">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b bg-muted/50">
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[120px]">Time</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[80px]">Method</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Target URL</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[180px]">Hostname</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[150px]">Click Correlation</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[100px]">Status</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
        ${paginationHtml}
      </div>
    `;

  try {
    targetContainer.innerHTML = tableHTML;

    // Attach event listeners to pagination buttons - search within targetContainer only
    setTimeout(() => {
      const prevBtn = targetContainer.querySelector('.pagination-prev');
      const nextBtn = targetContainer.querySelector('.pagination-next');

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          if (currentPage > 1) {
            currentPage--;
            loadDataAndInject(false);
          }
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          const totalPages = Math.ceil(requests.length / itemsPerPage);
          if (currentPage < totalPages) {
            currentPage++;
            loadDataAndInject(false);
          }
        });
      }
    }, 100);

    console.log('[Dashboard Override] Bot requests data injected successfully!');
  } catch (error) {
    console.error('[Dashboard Override] Error injecting bot requests:', error);
  }
}

// Inject POST requests table
function injectPostRequests(requests) {
  // Calculate pagination
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRequests = requests.slice(startIndex, endIndex);

  // Find the CardContent directly using data-slot attribute
  let targetContainer = null;

  const mainElement = document.querySelector('main');

  if (mainElement) {
    console.log('[Dashboard Override] Found main element');

    // Strategy 1: Directly find ALL CardContent elements with data-slot="card-content" in main
    const cardContents = mainElement.querySelectorAll('[data-slot="card-content"]');
    console.log('[Dashboard Override] Found', cardContents.length, 'CardContent elements');

    // The table card is the LAST CardContent (after stats cards)
    if (cardContents.length > 0) {
      targetContainer = cardContents[cardContents.length - 1];
      console.log('[Dashboard Override] Found target container for POST requests via data-slot (last CardContent)');
    }
  }

  if (!targetContainer) {
    console.error('[Dashboard Override] Could not find target container in main element for POST requests');
    return;
  }

  // Clear the container content
  targetContainer.innerHTML = '';

  // Generate table rows
  let tableRows = '';

  if (requests.length === 0) {
    tableRows = '<tr><td colspan="7" class="p-8 text-center text-muted-foreground">No blocked bot requests yet. Bot requests with user input data will appear here when blocked.</td></tr>';
  } else {
    tableRows = paginatedRequests.map((req) => {
      const timestamp = formatTime(req.timestamp);
      const targetUrl = req.target_url.length > 60 ? req.target_url.substring(0, 60) + '...' : req.target_url;
      const sourceUrl = (req.source_url || '').length > 60 ? req.source_url.substring(0, 60) + '...' : (req.source_url || 'N/A');

        let matchedFieldsBadges = '<span class="text-xs text-muted-foreground italic">No matches</span>';
        if (req.matched_fields && req.matched_fields.length > 0) {
          matchedFieldsBadges = req.matched_fields.slice(0, 3).map(field =>
            `<span class="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold bg-red-500 text-white">${field}</span>`
          ).join('');

          if (req.matched_fields.length > 3) {
            matchedFieldsBadges += `<span class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">+${req.matched_fields.length - 3}</span>`;
          }
        }

        let matchedValuesHtml = '<span class="text-xs text-muted-foreground italic">No input data</span>';
        if (req.matched_values && Object.keys(req.matched_values).length > 0) {
          const entries = Object.entries(req.matched_values).slice(0, 2);
          matchedValuesHtml = entries.map(([key, value]) => {
            const displayValue = value.length > 30 ? value.substring(0, 30) + '...' : value;
            return `<div class="text-xs"><span class="font-medium text-muted-foreground">${key}:</span><span class="text-foreground"> ${displayValue}</span></div>`;
          }).join('');

          if (Object.keys(req.matched_values).length > 2) {
            matchedValuesHtml += `<span class="text-xs text-muted-foreground">+${Object.keys(req.matched_values).length - 2} more</span>`;
          }
        }

        // Determine blocking layer
        const blockedBy = req.blocked_by === 'content_script' ? 'Form Prevention' : 'Network Layer';
        const blockedByIcon = req.blocked_by === 'content_script' ? '🛡️' : '🌐';

        return `
              <tr class="border-b transition-colors hover:bg-muted/50 bg-red-500/5">
                <td class="p-4 align-middle font-medium text-muted-foreground">${timestamp}</td>
                <td class="p-4 align-middle">
                  <code class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] text-xs font-mono">${targetUrl}</code>
                </td>
                <td class="p-4 align-middle">
                  <span class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold">${req.target_hostname}</span>
                </td>
                <td class="p-4 align-middle text-xs">
                  <code class="text-muted-foreground">${sourceUrl}</code>
                </td>
                <td class="p-4 align-middle">
                  <div class="flex flex-wrap gap-1">${matchedFieldsBadges}</div>
                </td>
                <td class="p-4 align-middle">
                  <div class="flex flex-col gap-1 max-w-xs">${matchedValuesHtml}</div>
                </td>
                <td class="p-4 align-middle">
                  <div class="flex flex-col gap-1">
                    <span class="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold bg-red-500 text-white gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
                      BLOCKED
                    </span>
                    <span class="text-xs text-muted-foreground">${blockedByIcon} ${blockedBy}</span>
                  </div>
                </td>
              </tr>`;
      }).join('');
    }

    // Build pagination HTML
    let paginationHtml = '';
    if (requests.length > 0) {
      paginationHtml = `
        <div class="flex items-center justify-between pt-4">
          <div class="text-sm text-muted-foreground">
            Showing ${startIndex + 1} to ${Math.min(endIndex, requests.length)} of ${requests.length} requests
          </div>
          <div class="flex items-center gap-2">
            <button
              class="pagination-prev inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
              ${currentPage === 1 ? 'disabled' : ''}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="m15 18-6-6 6-6"/></svg>
              Previous
            </button>
            <div class="text-sm font-medium">
              Page ${currentPage} of ${totalPages}
            </div>
            <button
              class="pagination-next inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
              ${currentPage === totalPages ? 'disabled' : ''}
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      `;
    }

    const tableHTML = `
      <div>
        <div class="rounded-md border">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b bg-muted/50">
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[120px]">Time</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Target URL</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[180px]">Hostname</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[300px]">Source</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Matched Fields</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Matched Input Values</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[120px]">Status</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
        ${paginationHtml}
      </div>
    `;

  try {
    targetContainer.innerHTML = tableHTML;

    // Attach event listeners to pagination buttons - search within targetContainer only
    setTimeout(() => {
      const prevBtn = targetContainer.querySelector('.pagination-prev');
      const nextBtn = targetContainer.querySelector('.pagination-next');

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          if (currentPage > 1) {
            currentPage--;
            loadDataAndInject(false);
          }
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          const totalPages = Math.ceil(requests.length / itemsPerPage);
          if (currentPage < totalPages) {
            currentPage++;
            loadDataAndInject(false);
          }
        });
      }
    }, 100);

    console.log('[Dashboard Override] POST requests data injected successfully!');
  } catch (error) {
    console.error('[Dashboard Override] Error injecting POST requests:', error);
  }
}

// ===== CLICK DETECTION PAGE FUNCTIONS =====

function updateClickDetectionStats(clickEvents) {
  try {
    // Calculate stats
    const totalClicks = clickEvents.length;
    const legitimateClicks = clickEvents.filter(e => !e.is_suspicious).length;
    const suspiciousClicks = clickEvents.filter(e => e.is_suspicious).length;

    console.log('[Dashboard Override] Click Detection Stats:', {
      total: totalClicks,
      legitimate: legitimateClicks,
      suspicious: suspiciousClicks
    });

    // Wait for DOM to be ready
    setTimeout(() => {
      // Find all card content containers
      const cardContainers = document.querySelectorAll('[data-slot="card-content"]');

      if (cardContainers.length < 3) {
        console.error('[Dashboard Override] Not enough stat cards found for Click Detection');
        return;
      }

      // Update stat cards (assuming order: Total, Legitimate, Suspicious)
      // Total Clicks (first card)
      const totalCard = cardContainers[0];
      const totalValueEl = totalCard.querySelector('div.text-2xl');
      if (totalValueEl) {
        totalValueEl.textContent = totalClicks.toLocaleString();
      }

      // Legitimate Clicks (second card)
      const legitimateCard = cardContainers[1];
      const legitimateValueEl = legitimateCard.querySelector('div.text-2xl');
      if (legitimateValueEl) {
        legitimateValueEl.textContent = legitimateClicks.toLocaleString();
      }

      // Suspicious Clicks (third card)
      const suspiciousCard = cardContainers[2];
      const suspiciousValueEl = suspiciousCard.querySelector('div.text-2xl');
      if (suspiciousValueEl) {
        suspiciousValueEl.textContent = suspiciousClicks.toLocaleString();
      }

      console.log('[Dashboard Override] Click Detection stats updated!');
    }, 100);

  } catch (error) {
    console.error('[Dashboard Override] Error updating Click Detection stats:', error);
  }
}

function injectClickDetection(clickEvents) {
  try {
    console.log('[Dashboard Override] Injecting Click Detection data...');

    // Wait for DOM to be ready
    setTimeout(() => {
      // Find all card content containers - the last one should be the table container
      const cardContainers = document.querySelectorAll('[data-slot="card-content"]');
      const targetContainer = cardContainers[cardContainers.length - 1];

      if (!targetContainer) {
        console.error('[Dashboard Override] Could not find table container for Click Detection');
        return;
      }

      // Calculate pagination
      const itemsPerPage = 20;
      const totalPages = Math.ceil(clickEvents.length / itemsPerPage);
      const startIdx = (currentPage - 1) * itemsPerPage;
      const endIdx = startIdx + itemsPerPage;
      const pageEvents = clickEvents.slice(startIdx, endIdx);

      console.log('[Dashboard Override] Showing page', currentPage, 'of', totalPages, '(', pageEvents.length, 'events)');

      // Build table HTML
      let tableHTML = `
        <div class="rounded-md border" style="background: var(--card); border-color: var(--border);">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 1px solid var(--border);">
                <th style="padding: 12px 16px; text-align: left; font-weight: 500; color: var(--muted-foreground);">Type</th>
                <th style="padding: 12px 16px; text-align: left; font-weight: 500; color: var(--muted-foreground);">Time</th>
                <th style="padding: 12px 16px; text-align: left; font-weight: 500; color: var(--muted-foreground);">Date</th>
                <th style="padding: 12px 16px; text-align: left; font-weight: 500; color: var(--muted-foreground);">Action</th>
                <th style="padding: 12px 16px; text-align: left; font-weight: 500; color: var(--muted-foreground);">Page Title</th>
                <th style="padding: 12px 16px; text-align: left; font-weight: 500; color: var(--muted-foreground);">Page URL</th>
                <th style="padding: 12px 16px; text-align: left; font-weight: 500; color: var(--muted-foreground);">Status</th>
              </tr>
            </thead>
            <tbody>
      `;

      // Add rows
      pageEvents.forEach((event, idx) => {
        const timestamp = event.timestamp || event.created_at;
        const date = new Date(timestamp);
        const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        const isSuspicious = event.is_suspicious;
        const statusColor = isSuspicious ? '#ef4444' : '#22c55e'; // red for suspicious, green for legitimate
        const statusText = isSuspicious ? 'Suspicious' : 'Legitimate';

        const pageTitle = event.page_title || 'N/A';
        const pageUrl = event.page_url || 'N/A';
        const eventType = event.action_type || 'click'; // Fixed: use action_type not event_type
        const action = eventType.toUpperCase();

        // Map event type to icon
        let typeIcon = '👆'; // default to click
        if (eventType.toLowerCase() === 'input') {
          typeIcon = '📝';
        } else if (eventType.toLowerCase() === 'navigation') {
          typeIcon = '🔗';
        } else if (eventType.toLowerCase() === 'button') {
          typeIcon = '⭕';
        } else if (eventType.toLowerCase() === 'click') {
          typeIcon = '👆';
        }

        tableHTML += `
          <tr style="border-bottom: 1px solid var(--border); ${idx % 2 === 0 ? 'background: var(--muted/50);' : ''}">
            <td style="padding: 12px 16px; font-size: 20px;">${typeIcon}</td>
            <td style="padding: 12px 16px;">${time}</td>
            <td style="padding: 12px 16px;">${dateStr}</td>
            <td style="padding: 12px 16px; font-weight: 500;">${action}</td>
            <td style="padding: 12px 16px; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${pageTitle}">${pageTitle}</td>
            <td style="padding: 12px 16px; max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${pageUrl}">${pageUrl}</td>
            <td style="padding: 12px 16px;">
              <span style="display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500; background-color: ${statusColor}20; color: ${statusColor}; border: 1px solid ${statusColor};">
                ${statusText}
              </span>
            </td>
          </tr>
        `;
      });

      tableHTML += `
            </tbody>
          </table>
        </div>
      `;

      // Add pagination
      if (totalPages > 1) {
        tableHTML += `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px 0;">
            <div style="color: var(--muted-foreground); font-size: 14px;">
              Page ${currentPage} of ${totalPages} (${clickEvents.length} total events)
            </div>
            <div style="display: flex; gap: 8px;">
              <button id="prevPageBtn" style="padding: 8px 16px; border: 1px solid var(--border); border-radius: 6px; background: var(--background); color: var(--foreground); cursor: pointer; ${currentPage === 1 ? 'opacity: 0.5; cursor: not-allowed;' : ''}" ${currentPage === 1 ? 'disabled' : ''}>
                Previous
              </button>
              <button id="nextPageBtn" style="padding: 8px 16px; border: 1px solid var(--border); border-radius: 6px; background: var(--background); color: var(--foreground); cursor: pointer; ${currentPage >= totalPages ? 'opacity: 0.5; cursor: not-allowed;' : ''}" ${currentPage >= totalPages ? 'disabled' : ''}>
                Next
              </button>
            </div>
          </div>
        `;
      }

      // Inject the HTML
      targetContainer.innerHTML = tableHTML;

      // Attach event listeners to pagination buttons
      if (totalPages > 1) {
        const prevBtn = targetContainer.querySelector('#prevPageBtn');
        const nextBtn = targetContainer.querySelector('#nextPageBtn');

        if (prevBtn) {
          prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
              currentPage--;
              loadDataAndInject(false);
            }
          });
        }

        if (nextBtn) {
          nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
              currentPage++;
              loadDataAndInject(false);
            }
          });
        }
      }

      console.log('[Dashboard Override] Click Detection data injected successfully!');
    }, 100);

  } catch (error) {
    console.error('[Dashboard Override] Error injecting Click Detection:', error);
  }
}

// ===== DOWNLOADS PAGE FUNCTIONS =====

function updateDownloadsStats(downloads) {
  try {
    // Calculate stats
    const totalDownloads = downloads.length;
    const completedDownloads = downloads.filter(d => d.state === 'complete').length;
    const dangerousDownloads = downloads.filter(d => d.danger !== 'safe').length;

    console.log('[Dashboard Override] Downloads Stats:', {
      total: totalDownloads,
      completed: completedDownloads,
      dangerous: dangerousDownloads
    });

    // Wait for DOM to be ready
    setTimeout(() => {
      // Find all card content containers
      const cardContainers = document.querySelectorAll('[data-slot="card-content"]');

      if (cardContainers.length < 3) {
        console.error('[Dashboard Override] Not enough stat cards found for Downloads');
        return;
      }

      // Update stat cards (assuming order: Total, Completed, Dangerous)
      // Total Downloads (first card)
      const totalCard = cardContainers[0];
      const totalValueEl = totalCard.querySelector('div.text-2xl');
      if (totalValueEl) {
        totalValueEl.textContent = totalDownloads.toLocaleString();
      }

      // Completed Downloads (second card)
      const completedCard = cardContainers[1];
      const completedValueEl = completedCard.querySelector('div.text-2xl');
      if (completedValueEl) {
        completedValueEl.textContent = completedDownloads.toLocaleString();
      }

      // Dangerous Downloads (third card)
      const dangerousCard = cardContainers[2];
      const dangerousValueEl = dangerousCard.querySelector('div.text-2xl');
      if (dangerousValueEl) {
        dangerousValueEl.textContent = dangerousDownloads.toLocaleString();
      }

      console.log('[Dashboard Override] Downloads stats updated!');
    }, 100);

  } catch (error) {
    console.error('[Dashboard Override] Error updating Downloads stats:', error);
  }
}

function injectDownloads(downloads) {
  try {
    console.log('[Dashboard Override] Injecting Downloads data...');

    // Wait for DOM to be ready
    setTimeout(() => {
      // Find all card content containers - the last one should be the table container
      const cardContainers = document.querySelectorAll('[data-slot="card-content"]');
      const targetContainer = cardContainers[cardContainers.length - 1];

      if (!targetContainer) {
        console.error('[Dashboard Override] Could not find table container for Downloads');
        return;
      }

      // Calculate pagination
      const itemsPerPage = 20;
      const totalPages = Math.ceil(downloads.length / itemsPerPage);
      const startIdx = (currentPage - 1) * itemsPerPage;
      const endIdx = startIdx + itemsPerPage;
      const pageDownloads = downloads.slice(startIdx, endIdx);

      console.log('[Dashboard Override] Showing page', currentPage, 'of', totalPages, '(', pageDownloads.length, 'downloads)');

      // Helper function to get category icon
      const getCategoryIcon = (category) => {
        const icons = {
          'document': '📄',
          'spreadsheet': '📊',
          'presentation': '📽️',
          'image': '🖼️',
          'video': '🎬',
          'audio': '🎵',
          'archive': '📦',
          'executable': '⚙️',
          'code': '💻',
          'data': '📊',
          'other': '📁'
        };
        return icons[category] || '📁';
      };

      // Helper function to get category color
      const getCategoryColor = (category) => {
        const colors = {
          'document': 'background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid #3b82f6',
          'spreadsheet': 'background: rgba(34, 197, 94, 0.1); color: #22c55e; border: 1px solid #22c55e',
          'presentation': 'background: rgba(168, 85, 247, 0.1); color: #a855f7; border: 1px solid #a855f7',
          'image': 'background: rgba(236, 72, 153, 0.1); color: #ec4899; border: 1px solid #ec4899',
          'video': 'background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid #ef4444',
          'audio': 'background: rgba(99, 102, 241, 0.1); color: #6366f1; border: 1px solid #6366f1',
          'archive': 'background: rgba(234, 179, 8, 0.1); color: #eab308; border: 1px solid #eab308',
          'executable': 'background: rgba(249, 115, 22, 0.1); color: #f97316; border: 1px solid #f97316',
          'code': 'background: rgba(6, 182, 212, 0.1); color: #06b6d4; border: 1px solid #06b6d4',
          'data': 'background: rgba(20, 184, 166, 0.1); color: #14b8a6; border: 1px solid #14b8a6',
          'other': 'background: rgba(107, 114, 128, 0.1); color: #6b7280; border: 1px solid #6b7280'
        };
        return colors[category] || colors['other'];
      };

      // Build table HTML
      let tableHTML = `
        <div class="rounded-md border" style="background: var(--card); border-color: var(--border);">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 1px solid var(--border);">
                <th style="padding: 12px 16px; text-align: left; font-weight: 500; color: var(--muted-foreground);">Type</th>
                <th style="padding: 12px 16px; text-align: left; font-weight: 500; color: var(--muted-foreground);">Time</th>
                <th style="padding: 12px 16px; text-align: left; font-weight: 500; color: var(--muted-foreground);">Date</th>
                <th style="padding: 12px 16px; text-align: left; font-weight: 500; color: var(--muted-foreground);">Filename</th>
                <th style="padding: 12px 16px; text-align: left; font-weight: 500; color: var(--muted-foreground);">Size</th>
                <th style="padding: 12px 16px; text-align: left; font-weight: 500; color: var(--muted-foreground);">Category</th>
                <th style="padding: 12px 16px; text-align: left; font-weight: 500; color: var(--muted-foreground);">Status</th>
              </tr>
            </thead>
            <tbody>
      `;

      // Add rows
      pageDownloads.forEach((download, idx) => {
        const timestamp = download.timestamp || download.start_time;
        const date = new Date(timestamp);
        const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        const isDangerous = download.danger !== 'safe';
        const statusColor = isDangerous ? '#ef4444' : '#22c55e'; // red for dangerous, green for safe
        const statusText = isDangerous ? 'Danger' : 'Safe';

        const filename = download.filename || 'Unknown';
        const fileSize = download.file_size_str || 'Unknown';
        const category = download.file_category || 'other';
        const categoryIcon = getCategoryIcon(category);
        const categoryStyle = getCategoryColor(category);

        // Extract hostname from URL
        let hostname = 'Unknown';
        try {
          hostname = new URL(download.url).hostname;
        } catch (e) {
          hostname = download.url;
        }

        tableHTML += `
          <tr style="border-bottom: 1px solid var(--border); ${idx % 2 === 0 ? 'background: var(--muted/50);' : ''}">
            <td style="padding: 12px 16px; font-size: 20px;">${categoryIcon}</td>
            <td style="padding: 12px 16px; font-family: monospace; font-size: 12px;">${time}</td>
            <td style="padding: 12px 16px; font-size: 12px; color: var(--muted-foreground);">${dateStr}</td>
            <td style="padding: 12px 16px; max-width: 300px;">
              <div style="font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${filename}">${filename}</div>
              <div style="font-size: 12px; color: var(--muted-foreground); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${download.url}">${hostname}</div>
            </td>
            <td style="padding: 12px 16px; font-size: 14px;">${fileSize}</td>
            <td style="padding: 12px 16px;">
              <span style="display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500; text-transform: uppercase; ${categoryStyle}">
                ${category}
              </span>
            </td>
            <td style="padding: 12px 16px;">
              <span style="display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500; background-color: ${statusColor}20; color: ${statusColor}; border: 1px solid ${statusColor};">
                ${statusText}
              </span>
            </td>
          </tr>
        `;
      });

      tableHTML += `
            </tbody>
          </table>
        </div>
      `;

      // Add pagination
      if (totalPages > 1) {
        tableHTML += `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px 0;">
            <div style="color: var(--muted-foreground); font-size: 14px;">
              Showing ${startIdx + 1} to ${Math.min(endIdx, downloads.length)} of ${downloads.length} downloads
            </div>
            <div style="display: flex; gap: 8px;">
              <button id="prevPageBtn" style="padding: 8px 16px; border: 1px solid var(--border); border-radius: 6px; background: var(--background); color: var(--foreground); cursor: pointer; ${currentPage === 1 ? 'opacity: 0.5; cursor: not-allowed;' : ''}" ${currentPage === 1 ? 'disabled' : ''}>
                Previous
              </button>
              <button id="nextPageBtn" style="padding: 8px 16px; border: 1px solid var(--border); border-radius: 6px; background: var(--background); color: var(--foreground); cursor: pointer; ${currentPage >= totalPages ? 'opacity: 0.5; cursor: not-allowed;' : ''}" ${currentPage >= totalPages ? 'disabled' : ''}>
                Next
              </button>
            </div>
          </div>
        `;
      }

      // Inject the HTML
      targetContainer.innerHTML = tableHTML;

      // Attach event listeners to pagination buttons
      if (totalPages > 1) {
        const prevBtn = targetContainer.querySelector('#prevPageBtn');
        const nextBtn = targetContainer.querySelector('#nextPageBtn');

        if (prevBtn) {
          prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
              currentPage--;
              loadDataAndInject(false);
            }
          });
        }

        if (nextBtn) {
          nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
              currentPage++;
              loadDataAndInject(false);
            }
          });
        }
      }

      console.log('[Dashboard Override] Downloads data injected successfully!');
    }, 100);

  } catch (error) {
    console.error('[Dashboard Override] Error injecting Downloads:', error);
  }
}

// Inject whitelist management page
function injectWhitelistPage(whitelist) {
  try {
    console.log('[Dashboard Override] Injecting whitelist management page');

    const container = document.querySelector('main') || document.querySelector('[role="main"]') || document.body;

    const whitelistHTML = `
      <div style="padding: 2rem;">
        <h1 style="font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">Whitelist Management</h1>
        <p style="color: #6b7280; margin-bottom: 2rem;">Add URLs or hostnames to whitelist. Whitelisted requests will not be blocked even if detected as bot activity.</p>

        <!-- Whitelisted URLs Section -->
        <div style="margin-bottom: 3rem;">
          <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;">Whitelisted URLs</h2>
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
            <input type="text" id="urlInput" placeholder="Enter URL (e.g., https://example.com/api)" style="flex: 1; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;" />
            <button id="addUrlBtn" style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 0.375rem; cursor: pointer;">Add URL</button>
          </div>
          <div id="urlList" style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${whitelist.urls.map((url, index) => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: #f3f4f6; border-radius: 0.375rem;">
                <span style="font-family: monospace; font-size: 0.875rem;">${url}</span>
                <button class="removeUrl" data-index="${index}" style="padding: 0.25rem 0.5rem; background: #ef4444; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 0.75rem;">Remove</button>
              </div>
            `).join('') || '<p style="color: #9ca3af; font-size: 0.875rem;">No URLs whitelisted yet</p>'}
          </div>
        </div>

        <!-- Whitelisted Hostnames Section -->
        <div>
          <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;">Whitelisted Hostnames</h2>
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
            <input type="text" id="hostnameInput" placeholder="Enter hostname (e.g., api.example.com)" style="flex: 1; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;" />
            <button id="addHostnameBtn" style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 0.375rem; cursor: pointer;">Add Hostname</button>
          </div>
          <div id="hostnameList" style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${whitelist.hostnames.map((hostname, index) => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: #f3f4f6; border-radius: 0.375rem;">
                <span style="font-family: monospace; font-size: 0.875rem;">${hostname}</span>
                <button class="removeHostname" data-index="${index}" style="padding: 0.25rem 0.5rem; background: #ef4444; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 0.75rem;">Remove</button>
              </div>
            `).join('') || '<p style="color: #9ca3af; font-size: 0.875rem;">No hostnames whitelisted yet</p>'}
          </div>
        </div>
      </div>
    `;

    container.innerHTML = whitelistHTML;

    // Add event listeners
    document.getElementById('addUrlBtn').addEventListener('click', () => addToWhitelist('url'));
    document.getElementById('addHostnameBtn').addEventListener('click', () => addToWhitelist('hostname'));

    document.querySelectorAll('.removeUrl').forEach(btn => {
      btn.addEventListener('click', (e) => removeFromWhitelist('url', parseInt(e.target.dataset.index)));
    });

    document.querySelectorAll('.removeHostname').forEach(btn => {
      btn.addEventListener('click', (e) => removeFromWhitelist('hostname', parseInt(e.target.dataset.index)));
    });

    // Allow Enter key to add
    document.getElementById('urlInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addToWhitelist('url');
    });
    document.getElementById('hostnameInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addToWhitelist('hostname');
    });

    console.log('[Dashboard Override] Whitelist page injected successfully!');
  } catch (error) {
    console.error('[Dashboard Override] Error injecting whitelist page:', error);
  }
}

// Add to whitelist
async function addToWhitelist(type) {
  try {
    const input = document.getElementById(type === 'url' ? 'urlInput' : 'hostnameInput');
    const value = input.value.trim();

    if (!value) {
      alert('Please enter a value');
      return;
    }

    // Get current whitelist
    const result = await chrome.storage.local.get(['whitelist']);
    const whitelist = result.whitelist || { urls: [], hostnames: [] };

    // Add to appropriate array
    if (type === 'url') {
      if (whitelist.urls.includes(value)) {
        alert('URL already whitelisted');
        return;
      }
      whitelist.urls.push(value);
    } else {
      if (whitelist.hostnames.includes(value)) {
        alert('Hostname already whitelisted');
        return;
      }
      whitelist.hostnames.push(value);
    }

    // Save to storage
    await chrome.storage.local.set({ whitelist });
    console.log('[Dashboard Override] Added to whitelist:', value);

    // Clear input and reload
    input.value = '';
    loadDataAndInject(false);
  } catch (error) {
    console.error('[Dashboard Override] Error adding to whitelist:', error);
    alert('Error adding to whitelist');
  }
}

// Remove from whitelist
async function removeFromWhitelist(type, index) {
  try {
    // Get current whitelist
    const result = await chrome.storage.local.get(['whitelist']);
    const whitelist = result.whitelist || { urls: [], hostnames: [] };

    // Remove from appropriate array
    if (type === 'url') {
      whitelist.urls.splice(index, 1);
    } else {
      whitelist.hostnames.splice(index, 1);
    }

    // Save to storage
    await chrome.storage.local.set({ whitelist });
    console.log('[Dashboard Override] Removed from whitelist');

    // Reload
    loadDataAndInject(false);
  } catch (error) {
    console.error('[Dashboard Override] Error removing from whitelist:', error);
    alert('Error removing from whitelist');
  }
}

// ============================================================================
// SCREENSHOTS PAGE
// ============================================================================

function updateScreenshotsStats(screenshots, sessions) {
  try {
    // Calculate stats
    const totalScreenshots = screenshots.length;
    const totalSessions = sessions.length;
    const activeSessions = sessions.filter(s => s.status === 'active').length;
    const withPostRequestCount = screenshots.filter(s => s.postRequest !== null && s.postRequest !== undefined).length;

    console.log('[Dashboard Override] Screenshots Stats:', {
      totalSessions,
      activeSessions,
      totalScreenshots,
      withPostRequestCount
    });

    // Wait for DOM to be ready
    setTimeout(() => {
      // Find all card content containers
      const cardContainers = document.querySelectorAll('[data-slot="card-content"]');

      if (cardContainers.length < 4) {
        console.error('[Dashboard Override] Not enough stat cards found for Screenshots');
        return;
      }

      // Update stat cards (order: Total Sessions, Active Sessions, Total Screenshots, With POST Requests)
      // Total Sessions (first card)
      const totalSessionsCard = cardContainers[0];
      const totalSessionsValueEl = totalSessionsCard.querySelector('div.text-2xl');
      if (totalSessionsValueEl) {
        totalSessionsValueEl.textContent = totalSessions.toLocaleString();
      }

      // Active Sessions (second card)
      const activeCard = cardContainers[1];
      const activeValueEl = activeCard.querySelector('div.text-2xl');
      if (activeValueEl) {
        activeValueEl.textContent = activeSessions.toLocaleString();
      }

      // Total Screenshots (third card)
      const screenshotsCard = cardContainers[2];
      const screenshotsValueEl = screenshotsCard.querySelector('div.text-2xl');
      if (screenshotsValueEl) {
        screenshotsValueEl.textContent = totalScreenshots.toLocaleString();
      }

      // With POST Requests (fourth card)
      const postCard = cardContainers[3];
      const postValueEl = postCard.querySelector('div.text-2xl');
      if (postValueEl) {
        postValueEl.textContent = withPostRequestCount.toLocaleString();
      }

      console.log('[Dashboard Override] Screenshots stats updated!');
    }, 100);

  } catch (error) {
    console.error('[Dashboard Override] Error updating Screenshots stats:', error);
  }
}

function injectScreenshots(screenshots, sessions) {
  try {
    console.log('[Dashboard Override] Injecting Screenshots data...');
    console.log('[Dashboard Override] Sessions:', sessions.length, 'Screenshots:', screenshots.length);

    // Wait for DOM to be ready
    setTimeout(() => {
      // Find all card content containers - the last one should be the gallery container
      const cardContainers = document.querySelectorAll('[data-slot="card-content"]');
      const targetContainer = cardContainers[cardContainers.length - 1];

      if (!targetContainer) {
        console.error('[Dashboard Override] Could not find gallery container for Screenshots');
        return;
      }

      // Group screenshots by session
      const sessionMap = new Map();
      sessions.forEach(session => {
        sessionMap.set(session.id, {
          session: session,
          screenshots: screenshots.filter(s => s.sessionId === session.id)
        });
      });

      console.log('[Dashboard Override] Grouped screenshots by session:', sessionMap.size);

      // Helper functions
      const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      };

      const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      };

      const formatDuration = (seconds) => {
        if (seconds < 60) return `${seconds}s`;
        const mins = Math.floor(seconds / 60);
        if (mins < 60) return `${mins}m ${seconds % 60}s`;
        const hours = Math.floor(mins / 60);
        return `${hours}h ${mins % 60}m`;
      };

      // Build session table HTML
      if (sessions.length === 0) {
        targetContainer.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">📸</div>
            <h3 style="font-size: 1.125rem; font-weight: 500; margin-bottom: 0.5rem;">No sessions yet</h3>
            <p style="font-size: 0.875rem; color: #6b7280;">
              Sessions will appear here when agent mode (debugger) is detected
            </p>
          </div>
        `;
        return;
      }
      // Build expandable session table
      let tableHTML = `
        <div style="border: 1px solid #e5e7eb; border-radius: 0.5rem; overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead style="background: #f9fafb;">
              <tr>
                <th style="padding: 0.75rem 1rem; text-align: left; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Session ID</th>
                <th style="padding: 0.75rem 1rem; text-align: left; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Status</th>
                <th style="padding: 0.75rem 1rem; text-align: left; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Tab URL</th>
                <th style="padding: 0.75rem 1rem; text-align: left; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Start Time</th>
                <th style="padding: 0.75rem 1rem; text-align: left; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Duration</th>
                <th style="padding: 0.75rem 1rem; text-align: center; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Screenshots</th>
              </tr>
            </thead>
            <tbody>
      `;

      // Sort sessions by start time (newest first)
      const sortedSessions = [...sessions].sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

      sortedSessions.forEach((session, index) => {
        const sessionData = sessionMap.get(session.id);
        const sessionScreenshots = sessionData ? sessionData.screenshots : [];
        const isActive = session.status === 'active';
        const statusColor = isActive ? '#f97316' : '#22c55e';
        const statusBg = isActive ? 'rgba(249, 115, 22, 0.1)' : 'rgba(34, 197, 94, 0.1)';
        
        // Calculate duration
        let duration = '';
        if (session.duration) {
          duration = formatDuration(session.duration);
        } else if (isActive) {
          const start = new Date(session.startTime);
          const now = new Date();
          const seconds = Math.floor((now - start) / 1000);
          duration = formatDuration(seconds) + ' (active)';
        }

        tableHTML += `
          <tr class="session-row" data-session-id="${session.id}" style="cursor: pointer; border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 1rem; font-family: monospace; font-size: 0.875rem;">#${session.id}</td>
            <td style="padding: 1rem;">
              <span style="padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 600; color: ${statusColor}; background: ${statusBg};">
                ${isActive ? '● Active' : '✓ Ended'}
              </span>
            </td>
            <td style="padding: 1rem; font-size: 0.875rem; max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${session.tabUrl || 'Unknown'}">${session.tabTitle || session.tabUrl || 'Unknown'}</td>
            <td style="padding: 1rem; font-size: 0.875rem;">${formatDate(session.startTime)} ${formatTime(session.startTime)}</td>
            <td style="padding: 1rem; font-size: 0.875rem;">${duration}</td>
            <td style="padding: 1rem; text-align: center; font-weight: 600;">${sessionScreenshots.length}</td>
          </tr>
          <tr class="session-details" data-session-id="${session.id}" style="display: none; background: #f9fafb;">
            <td colspan="6" style="padding: 0;">
              <div id="session-content-${session.id}" style="padding: 1rem;">
                <!-- Screenshots will be loaded here when expanded -->
              </div>
            </td>
          </tr>
        `;
      });

      tableHTML += `
            </tbody>
          </table>
        </div>
      `;

      targetContainer.innerHTML = tableHTML;

      // Add click handlers to expand/collapse sessions
      document.querySelectorAll('.session-row').forEach(row => {
        row.addEventListener('click', function() {
          const sessionId = this.dataset.sessionId;
          const detailsRow = document.querySelector(`.session-details[data-session-id="${sessionId}"]`);
          const contentDiv = document.getElementById(`session-content-${sessionId}`);
          
          if (detailsRow.style.display === 'none') {
            // Collapse all other sessions first
            document.querySelectorAll('.session-details').forEach(r => r.style.display = 'none');
            
            // Expand this session
            detailsRow.style.display = '';
            
            // Load screenshots if not already loaded
            if (!contentDiv.dataset.loaded) {
              const sessionData = sessionMap.get(parseInt(sessionId));
              const sessionScreenshots = sessionData ? sessionData.screenshots : [];
              
              if (sessionScreenshots.length === 0) {
                contentDiv.innerHTML = `
                  <div style="text-align: center; padding: 2rem; color: #6b7280;">
                    <p>No screenshots captured in this session</p>
                  </div>
                `;
              } else {
                let screenshotsHTML = `
                  <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem;">
                `;
                
                sessionScreenshots.forEach(screenshot => {
                  const hostname = screenshot.url ? new URL(screenshot.url).hostname : 'Unknown';

                  // Format event type with badge color
                  let eventBadge = '';
                  if (screenshot.eventType) {
                    const eventColors = {
                      'click': '#3b82f6',
                      'input': '#10b981',
                      'change': '#8b5cf6',
                      'submit': '#f59e0b',
                      'keypress': '#ec4899',
                      'navigation': '#06b6d4',
                      'new_tab': '#f97316'
                    };
                    const color = eventColors[screenshot.eventType] || '#6b7280';
                    const eventLabel = screenshot.eventType === 'new_tab' ? 'NEW TAB' : screenshot.eventType.toUpperCase();
                    eventBadge = `<span style="display: inline-block; padding: 0.125rem 0.5rem; border-radius: 0.25rem; font-size: 0.65rem; font-weight: 600; color: white; background: ${color}; margin-bottom: 0.5rem;">${eventLabel}</span>`;
                  }

                  // Format element details
                  let elementInfo = '';
                  if (screenshot.eventDetails && screenshot.eventDetails.element) {
                    const elem = screenshot.eventDetails.element;

                    // Special handling for new tab events
                    if (screenshot.eventType === 'new_tab') {
                      const newTabUrl = elem.newTabUrl || screenshot.url || 'Unknown';
                      const newTabTitle = elem.newTabTitle || screenshot.title || 'New Tab';
                      elementInfo = `<div style="font-size: 0.65rem; color: #6b7280; margin-bottom: 0.25rem;">
                        <div><strong>🗗 ${newTabTitle}</strong></div>
                        <div style="opacity: 0.7; word-break: break-all;">${newTabUrl}</div>
                      </div>`;
                    }
                    // Special handling for navigation events
                    else if (screenshot.eventType === 'navigation') {
                      const navType = elem.navigationType || 'unknown';
                      const fromUrl = elem.fromUrl || 'Unknown';
                      const toUrl = elem.toUrl || 'Unknown';
                      elementInfo = `<div style="font-size: 0.65rem; color: #6b7280; margin-bottom: 0.25rem;">
                        <div><strong>${navType}</strong></div>
                        <div style="opacity: 0.7;">→ ${toUrl}</div>
                      </div>`;
                    } else {
                      const elemText = elem.text ? `: "${elem.text}"` : '';
                      const elemId = elem.id ? `#${elem.id}` : '';
                      const elemClass = elem.className && !elem.className.includes(' ') ? `.${elem.className}` : '';
                      elementInfo = `<div style="font-size: 0.65rem; color: #6b7280; margin-bottom: 0.25rem;">${elem.tag}${elemId}${elemClass}${elemText}</div>`;
                    }
                  }

                  screenshotsHTML += `
                    <div style="border: 1px solid #e5e7eb; border-radius: 0.5rem; overflow: hidden; background: white;">
                      <div style="position: relative; width: 100%; height: 10rem; background: #f3f4f6;">
                        <img src="${screenshot.dataUrl}" alt="Screenshot ${screenshot.id}" style="width: 100%; height: 100%; object-fit: cover;" />
                      </div>
                      <div style="padding: 0.75rem;">
                        ${eventBadge}
                        ${elementInfo}
                        <div style="font-size: 0.75rem; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 0.25rem;" title="${screenshot.title || 'Unknown'}">
                          ${screenshot.title || 'Unknown'}
                        </div>
                        <div style="font-size: 0.75rem; color: #6b7280; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 0.5rem;" title="${screenshot.url || 'Unknown'}">
                          ${hostname}
                        </div>
                        <div style="font-size: 0.75rem; color: #6b7280;">
                          ${formatDate(screenshot.timestamp)} ${formatTime(screenshot.timestamp)}
                        </div>
                      </div>
                    </div>
                  `;
                });
                
                screenshotsHTML += `</div>`;
                contentDiv.innerHTML = screenshotsHTML;
              }
              
              contentDiv.dataset.loaded = 'true';
            }
          } else {
            // Collapse this session
            detailsRow.style.display = 'none';
          }
        });
      });

      console.log('[Dashboard Override] Screenshots table injected!');
    }, 100);

  } catch (error) {
    console.error('[Dashboard Override] Error injecting Screenshots:', error);
  }
}

// Add event listeners for Refresh and Clear All buttons using MutationObserver
function addScreenshotButtonHandlers() {
  if (window.screenshotButtonHandlerAttached) {
    return;
  }

  window.screenshotButtonHandlerAttached = true;

  // Function to hijack button clicks
  const hijackButton = (button, buttonText) => {
    if (buttonText.includes('Refresh')) {
      console.log('[Dashboard Override] Hijacking Refresh button');

      // Remove all existing event listeners by cloning
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);

      // Force enable and make clickable
      newButton.disabled = false;
      newButton.style.pointerEvents = 'auto';

      // Add our handler with highest priority
      const handler = (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        console.log('[Dashboard Override] Refresh clicked!');
        currentPage = 1;
        loadDataAndInject(false);
        return false;
      };

      newButton.onclick = handler;
      newButton.addEventListener('click', handler, true);

      return newButton;
    }

    if (buttonText.includes('Clear')) {
      console.log('[Dashboard Override] Hijacking Clear All button, disabled:', button.disabled);

      // Remove all existing event listeners by cloning
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);

      // Force enable and make clickable
      newButton.disabled = false;
      newButton.style.pointerEvents = 'auto';
      newButton.removeAttribute('disabled');

      // Add our handler with highest priority
      const handler = async (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        console.log('[Dashboard Override] Clear All clicked!');

        if (confirm('Are you sure you want to clear all screenshots and sessions?')) {
          try {
            await chrome.storage.local.set({ screenshots: [], sessions: [], recentScreenshots: [] });
            console.log('[Dashboard Override] All screenshots and sessions cleared');
            currentPage = 1;
            loadDataAndInject(false);
          } catch (error) {
            console.error('[Dashboard Override] Error clearing data:', error);
            alert('Error clearing data');
          }
        }
        return false;
      };

      newButton.onclick = handler;
      newButton.addEventListener('click', handler, true);

      console.log('[Dashboard Override] Clear All button setup complete, onclick:', !!newButton.onclick);

      return newButton;
    }
  };

  // Watch for button changes and hijack them
  const observer = new MutationObserver(() => {
    const buttons = document.querySelectorAll('button');

    buttons.forEach(button => {
      const buttonText = button.textContent.trim();

      if ((buttonText.includes('Refresh') || buttonText.includes('Clear')) &&
          !button.dataset.hijacked) {
        button.dataset.hijacked = 'true';
        hijackButton(button, buttonText);
      }
    });
  });

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Initial hijack
  setTimeout(() => {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      const buttonText = button.textContent.trim();
      if (buttonText.includes('Refresh') || buttonText.includes('Clear')) {
        button.dataset.hijacked = 'true';
        hijackButton(button, buttonText);
      }
    });
  }, 500);

  console.log('[Dashboard Override] Button hijacking enabled');
}

// Helper function to open screenshot in modal
function openScreenshotModal(screenshot) {
  const badge = screenshot.reason && screenshot.reason.includes('dom_change')
    ? { icon: '📝', label: 'DOM Change' }
    : screenshot.reason && screenshot.reason.includes('scroll')
    ? { icon: '🖱️', label: 'Scroll' }
    : { icon: '📸', label: 'Other' };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const modalHTML = `
    <div id="screenshotModal" class="screenshot-modal-overlay" style="position: fixed; inset: 0; z-index: 50; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; padding: 1rem;">
      <div class="screenshot-modal-content" style="max-width: 72rem; width: 100%; max-height: 90vh; overflow: auto; background: white; border-radius: 0.5rem; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
        <div style="padding: 1rem; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between;">
          <div>
            <h3 style="font-size: 1.125rem; font-weight: 600;">Screenshot #${screenshot.id}</h3>
            <p style="font-size: 0.875rem; color: #6b7280;">${screenshot.title || 'Unknown'}</p>
          </div>
          <button class="close-modal-btn" style="padding: 0.5rem; border: none; background: transparent; cursor: pointer; font-size: 1.5rem; color: #6b7280;">×</button>
        </div>
        <div style="padding: 1rem;">
          <img src="${screenshot.dataUrl}" alt="Screenshot ${screenshot.id}" style="width: 100%; height: auto; border-radius: 0.375rem;" />
          <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.875rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-weight: 500;">URL:</span>
              <span style="color: #6b7280;">${screenshot.url || 'Unknown'}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-weight: 500;">Reason:</span>
              <span style="color: #6b7280;">${badge.icon} ${screenshot.reason || 'Unknown'}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-weight: 500;">Time:</span>
              <span style="color: #6b7280;">${formatDateTime(screenshot.timestamp)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Add event listeners after inserting HTML
  const modal = document.getElementById('screenshotModal');
  const closeBtn = modal.querySelector('.close-modal-btn');
  const modalContent = modal.querySelector('.screenshot-modal-content');

  // Close modal when clicking overlay
  modal.addEventListener('click', function() {
    this.remove();
  });

  // Prevent closing when clicking modal content
  modalContent.addEventListener('click', function(event) {
    event.stopPropagation();
  });

  // Close button
  closeBtn.addEventListener('click', function() {
    modal.remove();
  });
}

// ============================================================================
// SENSITIVE WORDS & WHITELIST - Data injection
// ============================================================================

const DEFAULT_SENSITIVE_WORDS = ['password', 'secret', 'token', 'api_key', 'credential', 'private'];

// Test censoring function
function injectTestCensorButton() {
  // Avoid duplicate buttons
  if (document.getElementById('test-censor-btn')) {
    return;
  }

  // Find the page header
  const headings = document.querySelectorAll('h1');
  let pageHeader = null;

  for (let h1 of headings) {
    if (h1.textContent.includes('Sensitive Words Management')) {
      pageHeader = h1;
      break;
    }
  }

  if (!pageHeader) {
    console.log('[Dashboard Override] Could not find page header for test button');
    return;
  }

  // Find the description paragraph (next sibling)
  const description = pageHeader.nextElementSibling;
  if (!description) return;

  // Create test button
  const testButton = document.createElement('button');
  testButton.id = 'test-censor-btn';
  testButton.className = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-blue-600 text-white shadow-sm hover:bg-blue-700 h-9 px-4 mt-4';
  testButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-test-tube h-4 w-4">
      <path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5V2"></path>
      <path d="M8.5 2h7"></path>
      <path d="M14.5 16h-5"></path>
    </svg>
    Test Censoring on Current Tab
  `;

  testButton.addEventListener('click', async function() {
    console.log('[Test Censor] Starting test...');

    try {
      // Get all tabs
      const tabs = await chrome.tabs.query({});

      // Find a regular tab (not extension pages)
      const regularTab = tabs.find(tab =>
        tab.url &&
        !tab.url.startsWith('chrome://') &&
        !tab.url.startsWith('chrome-extension://')
      );

      if (!regularTab) {
        alert('No regular tabs found. Please open a webpage (like Gmail) and try again.');
        return;
      }

      console.log('[Test Censor] Sending CENSOR_CONTENT to tab:', regularTab.id, regularTab.url);

      // Disable button during test
      testButton.disabled = true;
      testButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader h-4 w-4 animate-spin">
          <path d="M12 2v4"></path>
          <path d="m16.2 7.8 2.9-2.9"></path>
          <path d="M18 12h4"></path>
          <path d="m16.2 16.2 2.9 2.9"></path>
          <path d="M12 18v4"></path>
          <path d="m4.9 19.1 2.9-2.9"></path>
          <path d="M2 12h4"></path>
          <path d="m4.9 4.9 2.9 2.9"></path>
        </svg>
        Testing... (5 seconds)
      `;

      // Send CENSOR_CONTENT message
      await chrome.tabs.sendMessage(regularTab.id, { type: 'CENSOR_CONTENT' });
      console.log('[Test Censor] ✅ Censoring activated! Check tab:', regularTab.title);

      // Show alert
      alert(`✅ Censoring activated on:\n${regularTab.title}\n\nSensitive words should now be [REDACTED]. It will auto-restore in 5 seconds.`);

      // Wait 5 seconds then uncensor
      setTimeout(async () => {
        try {
          await chrome.tabs.sendMessage(regularTab.id, { type: 'UNCENSOR_CONTENT' });
          console.log('[Test Censor] ✅ Content restored!');

          // Re-enable button
          testButton.disabled = false;
          testButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-test-tube h-4 w-4">
              <path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5V2"></path>
              <path d="M8.5 2h7"></path>
              <path d="M14.5 16h-5"></path>
            </svg>
            Test Censoring on Current Tab
          `;
        } catch (err) {
          console.error('[Test Censor] Error restoring:', err);
          testButton.disabled = false;
          testButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-test-tube h-4 w-4">
              <path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5V2"></path>
              <path d="M8.5 2h7"></path>
              <path d="M14.5 16h-5"></path>
            </svg>
            Test Censoring on Current Tab
          `;
        }
      }, 5000);

    } catch (error) {
      console.error('[Test Censor] Error:', error);
      alert(`Error: ${error.message}\n\nMake sure you have a webpage open (like Gmail) and the content script is loaded.`);

      testButton.disabled = false;
      testButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-test-tube h-4 w-4">
          <path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5V2"></path>
          <path d="M8.5 2h7"></path>
          <path d="M14.5 16h-5"></path>
        </svg>
        Test Censoring on Current Tab
      `;
    }
  });

  // Insert button after description
  description.parentElement.insertBefore(testButton, description.nextSibling);
  console.log('[Dashboard Override] Test Censoring button injected');
}

function injectSensitiveWords(words) {
  console.log('[Dashboard Override] Injecting sensitive words:', words);

  setTimeout(() => {
    // Inject Test Censoring button in the header
    injectTestCensorButton();

    // Find the "Add Word" button to locate the correct section
    const allButtons = document.querySelectorAll('button');
    let addWordButton = null;

    for (let button of allButtons) {
      if (button.textContent.includes('Add Word')) {
        addWordButton = button;
        console.log('[Dashboard Override] Found Add Word button');
        break;
      }
    }

    if (!addWordButton) {
      console.error('[Dashboard Override] Could not find Add Word button');
      return;
    }

    // Walk up from the button to find the card container
    let cardContainer = addWordButton;
    for (let i = 0; i < 15; i++) {
      cardContainer = cardContainer.parentElement;
      if (!cardContainer) break;

      // Look for a container that has both the button and code elements or empty space
      const hasInput = cardContainer.querySelector('input[type="text"]');
      const spaceYDivs = cardContainer.querySelectorAll('div[class*="space-y"]');

      if (hasInput && spaceYDivs.length > 0) {
        console.log('[Dashboard Override] Found card container with', spaceYDivs.length, 'space-y divs');

        // Find the right space-y div - should be after the input and before "Reset to Default Words"
        let wordsListContainer = null;

        // Since we're already in the correct card (found via "Add Word" button),
        // just use the first space-y div that doesn't contain an input
        // The "Default Sensitive Words" section is in a different card entirely
        for (let div of spaceYDivs) {
          // Skip if it contains the input
          if (div.querySelector('input')) {
            console.log('[Dashboard Override] Skipping div with input');
            continue;
          }

          // This should be our words list!
          wordsListContainer = div;
          console.log('[Dashboard Override] Found words list container!');
          break;
        }

        if (wordsListContainer) {
          console.log('[Dashboard Override] Clearing and rebuilding with', words.length, 'words');

          // Clear and rebuild the words list
          wordsListContainer.innerHTML = '';

          if (words.length === 0) {
            wordsListContainer.innerHTML = '<p class="text-sm text-muted-foreground italic">No sensitive words configured. Using default words.</p>';
          } else {
            words.forEach((word) => {
              const wordDiv = document.createElement('div');
              wordDiv.className = 'flex items-center justify-between p-3 bg-muted rounded-md';
              wordDiv.innerHTML = `
                <code class="text-sm text-green-600 dark:text-green-400">${word}</code>
                <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 h-9 px-3" data-word="${word}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash h-4 w-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                </button>
              `;
              wordsListContainer.appendChild(wordDiv);
            });
          }

          // Update the count in the stats card
          const statsCards = document.querySelectorAll('div[class*="rounded"]');
          for (let card of statsCards) {
            const titleElement = card.querySelector('h3, p');
            if (titleElement && titleElement.textContent && titleElement.textContent.includes('Active Words')) {
              const valueElement = card.querySelector('div[class*="text-2xl"], div[class*="text-3xl"]');
              if (valueElement) {
                valueElement.textContent = words.length.toString();
              }
            }
          }

          console.log('[Dashboard Override] Sensitive words injected successfully');
          return;
        }

        console.error('[Dashboard Override] Could not find words list container in card');
        return;
      }
    }

    console.error('[Dashboard Override] Could not find card container');
  }, 200);
}

function injectWhitelist(whitelist) {
  console.log('[Dashboard Override] Injecting whitelist:', whitelist);

  setTimeout(() => {
    // Find the input fields - first is URL, second is hostname
    const inputs = document.querySelectorAll('input[type="text"]');
    if (inputs.length < 2) {
      console.error('[Dashboard Override] Could not find input fields');
      return;
    }

    const urlInput = inputs[0];
    const hostnameInput = inputs[1];

    // Find the containers for URLs and Hostnames by looking for space-y divs near each input
    let urlsContainer = null;
    let hostnamesContainer = null;

    // Find URLs container - it should be in the same parent as the URL input
    let urlParent = urlInput;
    for (let i = 0; i < 10; i++) {
      urlParent = urlParent.parentElement;
      if (!urlParent) break;

      const spaceYContainers = urlParent.querySelectorAll('div[class*="space-y"]');
      for (let container of spaceYContainers) {
        // Skip if this container has an input
        if (container.querySelector('input')) continue;

        // Check if this is within the URL section (should have the "Add URL" button nearby)
        let parent = container;
        let hasUrlButton = false;
        for (let j = 0; j < 5; j++) {
          parent = parent.parentElement;
          if (!parent) break;
          if (parent.textContent && parent.textContent.includes('Add URL')) {
            hasUrlButton = true;
            break;
          }
        }

        if (hasUrlButton) {
          urlsContainer = container;
          break;
        }
      }

      if (urlsContainer) break;
    }

    // Find Hostnames container - it should be in the same parent as the hostname input
    let hostnameParent = hostnameInput;
    for (let i = 0; i < 10; i++) {
      hostnameParent = hostnameParent.parentElement;
      if (!hostnameParent) break;

      const spaceYContainers = hostnameParent.querySelectorAll('div[class*="space-y"]');
      for (let container of spaceYContainers) {
        // Skip if this container has an input
        if (container.querySelector('input')) continue;

        // Check if this is within the Hostname section
        let parent = container;
        let hasHostnameButton = false;
        for (let j = 0; j < 5; j++) {
          parent = parent.parentElement;
          if (!parent) break;
          if (parent.textContent && parent.textContent.includes('Add Hostname')) {
            hasHostnameButton = true;
            break;
          }
        }

        if (hasHostnameButton) {
          hostnamesContainer = container;
          break;
        }
      }

      if (hostnamesContainer) break;
    }

    if (!urlsContainer || !hostnamesContainer) {
      console.error('[Dashboard Override] Could not find list containers');
      return;
    }

      // Inject URLs
      urlsContainer.innerHTML = '';
      if (whitelist.urls.length === 0) {
        urlsContainer.innerHTML = '<p class="text-sm text-muted-foreground italic">No URLs whitelisted</p>';
      } else {
        whitelist.urls.forEach((url) => {
          const urlDiv = document.createElement('div');
          urlDiv.className = 'flex items-center justify-between p-3 bg-muted rounded-md';
          urlDiv.innerHTML = `
            <code class="text-sm text-blue-600 dark:text-blue-400">${url}</code>
            <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 h-9 px-3" data-value="${url}">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash h-4 w-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
            </button>
          `;
          urlsContainer.appendChild(urlDiv);
        });
      }

      // Inject Hostnames
      hostnamesContainer.innerHTML = '';
      if (whitelist.hostnames.length === 0) {
        hostnamesContainer.innerHTML = '<p class="text-sm text-muted-foreground italic">No hostnames whitelisted</p>';
      } else {
        whitelist.hostnames.forEach((hostname) => {
          const hostnameDiv = document.createElement('div');
          hostnameDiv.className = 'flex items-center justify-between p-3 bg-muted rounded-md';
          hostnameDiv.innerHTML = `
            <code class="text-sm text-purple-600 dark:text-purple-400">${hostname}</code>
            <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 h-9 px-3" data-value="${hostname}">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash h-4 w-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
            </button>
          `;
          hostnamesContainer.appendChild(hostnameDiv);
        });
      }

    // Update stats cards
    const statsCards = document.querySelectorAll('div[class*="rounded"]');
    for (let card of statsCards) {
      const titleElement = card.querySelector('h3, p');
      if (titleElement && titleElement.textContent) {
        if (titleElement.textContent.includes('Whitelisted URLs')) {
          const valueElement = card.querySelector('div[class*="text-2xl"], div[class*="text-3xl"]');
          if (valueElement) {
            valueElement.textContent = whitelist.urls.length.toString();
          }
        } else if (titleElement.textContent.includes('Whitelisted Hostnames')) {
          const valueElement = card.querySelector('div[class*="text-2xl"], div[class*="text-3xl"]');
          if (valueElement) {
            valueElement.textContent = whitelist.hostnames.length.toString();
          }
        }
      }
    }

    console.log('[Dashboard Override] Whitelist injected successfully');
  }, 100);
}

// ============================================================================
// SENSITIVE WORDS PAGE - Button hijacking
// ============================================================================

function attachSensitiveWordsHandlers() {
  console.log('[Dashboard Override] Setting up Sensitive Words button handlers');

  // Use event delegation on document body to catch all button clicks
  document.body.addEventListener('click', async (e) => {
    const button = e.target.closest('button');
    if (!button) return;

    const buttonText = button.textContent.trim();
    console.log('[Sensitive Words] Button clicked:', buttonText);

    // Handle "Add Word" button
    if (buttonText.includes('Add Word') && window.location.pathname.includes('sensitive-words')) {
      e.preventDefault();
      e.stopImmediatePropagation();

      const input = document.querySelector('input[type="text"]');
      const value = input?.value?.trim();

      if (!value) {
        alert('Please enter a word');
        return;
      }

      console.log('[Sensitive Words] Adding word:', value);

      try {
        const result = await chrome.storage.local.get(['sensitiveWords']);
        const words = result.sensitiveWords || DEFAULT_SENSITIVE_WORDS;

        // Check if already exists
        if (words.some(w => w.toLowerCase() === value.toLowerCase())) {
          alert('This word is already in the list');
          return;
        }

        const newWords = [...words, value];
        await chrome.storage.local.set({ sensitiveWords: newWords });
        console.log('[Sensitive Words] Word added successfully');

        // Clear input and re-inject data
        if (input) input.value = '';
        injectSensitiveWords(newWords);
      } catch (error) {
        console.error('[Sensitive Words] Error adding word:', error);
        alert('Error adding word');
      }
    }

    // Handle "Reset to Default Words" button
    if (buttonText.includes('Reset') && window.location.pathname.includes('sensitive-words')) {
      e.preventDefault();
      e.stopImmediatePropagation();

      if (!confirm('Reset to default sensitive words? This will remove all custom words.')) {
        return;
      }

      console.log('[Sensitive Words] Resetting to defaults');

      try {
        await chrome.storage.local.set({ sensitiveWords: DEFAULT_SENSITIVE_WORDS });
        console.log('[Sensitive Words] Reset successful');
        injectSensitiveWords(DEFAULT_SENSITIVE_WORDS);
      } catch (error) {
        console.error('[Sensitive Words] Error resetting:', error);
        alert('Error resetting to defaults');
      }
    }

    // Handle delete buttons (trash icon)
    if (button.querySelector('svg') && window.location.pathname.includes('sensitive-words')) {
      const wordElement = button.closest('div')?.querySelector('code');
      if (wordElement) {
        e.preventDefault();
        e.stopImmediatePropagation();

        const wordToRemove = wordElement.textContent.trim();
        console.log('[Sensitive Words] Removing word:', wordToRemove);

        try {
          const result = await chrome.storage.local.get(['sensitiveWords']);
          const words = result.sensitiveWords || DEFAULT_SENSITIVE_WORDS;
          const newWords = words.filter(w => w !== wordToRemove);

          await chrome.storage.local.set({ sensitiveWords: newWords });
          console.log('[Sensitive Words] Word removed successfully');
          injectSensitiveWords(newWords);
        } catch (error) {
          console.error('[Sensitive Words] Error removing word:', error);
          alert('Error removing word');
        }
      }
    }
  }, true); // Use capture phase
}

// ============================================================================
// WHITELIST PAGE - Button hijacking
// ============================================================================

function attachWhitelistHandlers() {
  console.log('[Dashboard Override] Setting up Whitelist button handlers');

  // Use event delegation on document body to catch all button clicks
  document.body.addEventListener('click', async (e) => {
    const button = e.target.closest('button');
    if (!button) return;

    const buttonText = button.textContent.trim();
    console.log('[Whitelist] Button clicked:', buttonText);

    // Handle "Add URL" button
    if (buttonText.includes('Add URL') && window.location.pathname.includes('whitelist')) {
      e.preventDefault();
      e.stopImmediatePropagation();

      const inputs = document.querySelectorAll('input[type="text"]');
      const urlInput = inputs[0];
      const value = urlInput?.value?.trim();

      if (!value) {
        alert('Please enter a URL');
        return;
      }

      console.log('[Whitelist] Adding URL:', value);

      try {
        const result = await chrome.storage.local.get(['whitelist']);
        const whitelist = result.whitelist || { urls: [], hostnames: [] };

        if (whitelist.urls.includes(value)) {
          alert('URL already whitelisted');
          return;
        }

        whitelist.urls.push(value);
        await chrome.storage.local.set({ whitelist });
        console.log('[Whitelist] URL added successfully');

        if (urlInput) urlInput.value = '';
        injectWhitelist(whitelist);
      } catch (error) {
        console.error('[Whitelist] Error adding URL:', error);
        alert('Error adding URL');
      }
    }

    // Handle "Add Hostname" button
    if (buttonText.includes('Add Hostname') && window.location.pathname.includes('whitelist')) {
      e.preventDefault();
      e.stopImmediatePropagation();

      const inputs = document.querySelectorAll('input[type="text"]');
      const hostnameInput = inputs[1];
      const value = hostnameInput?.value?.trim();

      if (!value) {
        alert('Please enter a hostname');
        return;
      }

      console.log('[Whitelist] Adding hostname:', value);

      try {
        const result = await chrome.storage.local.get(['whitelist']);
        const whitelist = result.whitelist || { urls: [], hostnames: [] };

        if (whitelist.hostnames.includes(value)) {
          alert('Hostname already whitelisted');
          return;
        }

        whitelist.hostnames.push(value);
        await chrome.storage.local.set({ whitelist });
        console.log('[Whitelist] Hostname added successfully');

        if (hostnameInput) hostnameInput.value = '';
        injectWhitelist(whitelist);
      } catch (error) {
        console.error('[Whitelist] Error adding hostname:', error);
        alert('Error adding hostname');
      }
    }

    // Handle delete buttons (trash icon)
    if (button.querySelector('svg') && window.location.pathname.includes('whitelist')) {
      const codeElement = button.closest('div')?.querySelector('code');
      if (codeElement) {
        e.preventDefault();
        e.stopImmediatePropagation();

        const valueToRemove = codeElement.textContent.trim();
        console.log('[Whitelist] Removing:', valueToRemove);

        try {
          const result = await chrome.storage.local.get(['whitelist']);
          const whitelist = result.whitelist || { urls: [], hostnames: [] };

          // Try removing from both arrays
          whitelist.urls = whitelist.urls.filter(url => url !== valueToRemove);
          whitelist.hostnames = whitelist.hostnames.filter(hostname => hostname !== valueToRemove);

          await chrome.storage.local.set({ whitelist });
          console.log('[Whitelist] Item removed successfully');
          injectWhitelist(whitelist);
        } catch (error) {
          console.error('[Whitelist] Error removing item:', error);
          alert('Error removing item');
        }
      }
    }
  }, true); // Use capture phase
}

console.log('[Dashboard Override] Script loaded - will auto-refresh every 5 seconds');
