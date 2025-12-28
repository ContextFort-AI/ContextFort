# Perplexity Link Blocker

## What it does
Blocks external navigation from Perplexity.ai chatbot when links have query parameters. This prevents the agent from opening tracking links that could leak information about your conversation.

## How it works
- Tracks which tabs are on Perplexity.ai
- Uses Chrome's Declarative Net Request API to block main frame navigations with query params
- Closes tabs immediately if Perplexity opens external links with query strings
- Shows notifications when links are blocked

## Installation

1. Open Comet browser
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" (top right toggle)
4. Click "Load unpacked"
5. Select this folder: `/Users/ashwin/agents-blocker/chromium-accessibility-test/perplexity-link-blocker`

## Testing

1. Open Perplexity.ai
2. Ask it to open a link with query parameters (e.g., "open https://example.com?tracking=123")
3. The link should be blocked and you'll see a notification

## What gets blocked

- ✅ External links WITH query params: `https://example.com?foo=bar`
- ❌ External links WITHOUT query params: `https://example.com`
- ❌ Perplexity.ai links: `https://perplexity.ai?search=anything`
