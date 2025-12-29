// Sensitive words management script
console.log('[Sensitive Words] Script loading...');

const DEFAULT_WORDS = ['password', 'secret', 'token', 'api_key', 'credential', 'private'];

// Load and display current sensitive words
async function loadSensitiveWords() {
  try {
    const result = await chrome.storage.local.get(['sensitiveWords']);
    const words = result.sensitiveWords || DEFAULT_WORDS;

    console.log('[Sensitive Words] Loaded:', words);

    displayWords(words);
  } catch (error) {
    console.error('[Sensitive Words] Error loading:', error);
  }
}

// Display words list
function displayWords(words) {
  const container = document.getElementById('wordList');

  if (words.length === 0) {
    container.innerHTML = '<p class="empty-message">No sensitive words configured. Using default words.</p>';
    return;
  }

  container.innerHTML = words.map((word, index) => `
    <div class="list-item">
      <code>${escapeHtml(word)}</code>
      <button class="remove-btn" data-index="${index}">Remove</button>
    </div>
  `).join('');

  // Add event listeners to remove buttons
  container.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', handleRemove);
  });
}

// Add word to sensitive words list
async function addWord() {
  try {
    const input = document.getElementById('wordInput');
    const word = input.value.trim();

    if (!word) {
      alert('Please enter a word');
      return;
    }

    // Get current words
    const result = await chrome.storage.local.get(['sensitiveWords']);
    const words = result.sensitiveWords || DEFAULT_WORDS;

    // Check if already exists (case insensitive)
    if (words.some(w => w.toLowerCase() === word.toLowerCase())) {
      alert('This word is already in the list');
      return;
    }

    // Add to list
    words.push(word);
    console.log('[Sensitive Words] Added word:', word);

    // Save to storage
    await chrome.storage.local.set({ sensitiveWords: words });

    // Clear input and reload
    input.value = '';
    loadSensitiveWords();

    console.log('[Sensitive Words] Saved successfully');
  } catch (error) {
    console.error('[Sensitive Words] Error adding:', error);
    alert('Error adding word');
  }
}

// Remove word from list
async function handleRemove(event) {
  try {
    const index = parseInt(event.target.dataset.index);

    // Get current words
    const result = await chrome.storage.local.get(['sensitiveWords']);
    const words = result.sensitiveWords || DEFAULT_WORDS;

    // Remove from list
    const removed = words.splice(index, 1);
    console.log('[Sensitive Words] Removed word:', removed[0]);

    // Save to storage
    await chrome.storage.local.set({ sensitiveWords: words });

    // Reload
    loadSensitiveWords();

    console.log('[Sensitive Words] Removed successfully');
  } catch (error) {
    console.error('[Sensitive Words] Error removing:', error);
    alert('Error removing word');
  }
}

// Reset to default words
async function resetToDefaults() {
  if (!confirm('Reset to default sensitive words? This will remove all custom words.')) {
    return;
  }

  try {
    console.log('[Sensitive Words] Resetting to defaults:', DEFAULT_WORDS);

    // Save default words
    await chrome.storage.local.set({ sensitiveWords: DEFAULT_WORDS });

    // Reload
    loadSensitiveWords();

    console.log('[Sensitive Words] Reset successfully');
  } catch (error) {
    console.error('[Sensitive Words] Error resetting:', error);
    alert('Error resetting to defaults');
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Setup event listeners
document.addEventListener('DOMContentLoaded', () => {
  console.log('[Sensitive Words] DOM loaded, setting up...');

  // Load initial data
  loadSensitiveWords();

  // Add button listener
  document.getElementById('addWordBtn').addEventListener('click', addWord);

  // Reset button listener
  document.getElementById('resetBtn').addEventListener('click', resetToDefaults);

  // Enter key support
  document.getElementById('wordInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addWord();
  });

  console.log('[Sensitive Words] Setup complete');
});
