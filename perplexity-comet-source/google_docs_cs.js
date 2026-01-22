const script = document.createElement('script');
script.src = chrome.runtime.getURL('google_docs_web.js');
script.type = 'module';
document.documentElement.appendChild(script);
