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
  setInterval(() => loadDataAndInject(false), 5000);
});

// Detect which page we're on
function getPageType() {
  const path = window.location.pathname;
  if (path.includes('human-requests')) return 'human';
  if (path.includes('bot-requests')) return 'bot';
  if (path.includes('post-requests')) return 'post';
  if (path.includes('click-detection')) return 'click-detection';
  if (path.includes('downloads')) return 'downloads';
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
      // Blocked Requests: ONLY BOT requests with user input data triggered by button clicks
      // (Human requests with input data go to Human Requests page)
      filteredRequests = allRequests.filter(req =>
        req.is_bot === true &&
        req.has_click_correlation === true &&
        req.matched_fields && req.matched_fields.length > 0
      );
      console.log('[Dashboard Override] Found', filteredRequests.length, 'blocked BOT requests with user input');
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
    tableRows = '<tr><td colspan="7" class="p-8 text-center text-muted-foreground">No requests detected yet.</td></tr>';
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

        return `
              <tr class="border-b transition-colors hover:bg-muted/50">
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
                  <button class="inline-flex items-center justify-center rounded-md text-sm font-medium h-8 w-8 opacity-0 hover:opacity-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-red-500"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
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
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[80px]">Actions</th>
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

console.log('[Dashboard Override] Script loaded - will auto-refresh every 5 seconds');
