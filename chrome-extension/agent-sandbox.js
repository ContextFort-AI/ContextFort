// ============================================================================
// AGENT SANDBOX - Storage Isolation for Agent Tabs
// ============================================================================
// This script runs in the MAIN world at document_start on ALL pages.
// It only activates if the sandbox flag is set in sessionStorage.
//
// Purpose: Make agent tabs start "blank" without inheriting human's sessions
// - Virtualizes localStorage → empty in-memory storage
// - Disables IndexedDB → prevents token/data leakage
// - Blocks Service Worker registration → prevents sticky state
// ============================================================================

(function() {
  'use strict';

  const SANDBOX_FLAG = '__contextfort_agent_sandbox__';

  // Only activate if flag is set (agent tabs only)
  if (sessionStorage.getItem(SANDBOX_FLAG) !== 'true') {
    return;
  }

  // ==========================================================================
  // 1) VIRTUALIZE LOCALSTORAGE → IN-MEMORY (starts "blank")
  // ==========================================================================
  // Why: localStorage is shared across ALL tabs for same origin.
  // If human is logged into bank.com, agent would see the same tokens.
  // By replacing window.localStorage with an empty virtual storage:
  // - Agent sees empty localStorage (starts "blank")
  // - Human's real localStorage is untouched (stays logged in elsewhere)
  // ==========================================================================

  const virtualStorage = new Map();

  const fakeLocalStorage = {
    getItem(key) {
      return virtualStorage.has(String(key)) ? virtualStorage.get(String(key)) : null;
    },
    setItem(key, value) {
      virtualStorage.set(String(key), String(value));
    },
    removeItem(key) {
      virtualStorage.delete(String(key));
    },
    clear() {
      virtualStorage.clear();
    },
    key(index) {
      const keys = [...virtualStorage.keys()];
      return index >= 0 && index < keys.length ? keys[index] : null;
    },
    get length() {
      return virtualStorage.size;
    }
  };

  // Proxy to handle bracket notation access: localStorage['key'] and for...in
  const localStorageProxy = new Proxy(fakeLocalStorage, {
    get(target, prop) {
      if (prop in target) {
        const value = target[prop];
        return typeof value === 'function' ? value.bind(target) : value;
      }
      return target.getItem(prop);
    },
    set(target, prop, value) {
      target.setItem(prop, value);
      return true;
    },
    deleteProperty(target, prop) {
      target.removeItem(prop);
      return true;
    },
    ownKeys() {
      return [...virtualStorage.keys()];
    },
    has(target, prop) {
      return virtualStorage.has(String(prop)) || prop in target;
    },
    getOwnPropertyDescriptor(target, prop) {
      if (virtualStorage.has(String(prop))) {
        return {
          configurable: true,
          enumerable: true,
          writable: true,
          value: virtualStorage.get(String(prop))
        };
      }
      if (prop in target) {
        return Object.getOwnPropertyDescriptor(target, prop);
      }
      return undefined;
    }
  });

  try {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageProxy,
      writable: false,
      configurable: false
    });
  } catch (e) {
    console.error('[ContextFort] Failed to virtualize localStorage:', e);
  }

  // ==========================================================================
  // 2) DISABLE INDEXEDDB
  // ==========================================================================
  // Why: Modern apps store tokens and cached data in IndexedDB.
  // This is another path for session leakage.
  // By returning null, apps that check `if (window.indexedDB)` fail gracefully.
  // ==========================================================================

  try {
    Object.defineProperty(window, 'indexedDB', {
      get() { return null; },
      configurable: false
    });
  } catch (e) {
    console.error('[ContextFort] Failed to disable indexedDB:', e);
  }

  // Block the IDB constructors to prevent any workarounds
  const idbConstructors = [
    'IDBFactory',
    'IDBDatabase',
    'IDBTransaction',
    'IDBRequest',
    'IDBOpenDBRequest',
    'IDBObjectStore',
    'IDBIndex',
    'IDBCursor',
    'IDBCursorWithValue',
    'IDBKeyRange',
    'IDBVersionChangeEvent'
  ];

  for (const name of idbConstructors) {
    try {
      Object.defineProperty(window, name, {
        value: undefined,
        writable: false,
        configurable: false
      });
    } catch (e) {
      // Some may not exist, ignore
    }
  }

  // ==========================================================================
  // 3) BLOCK SERVICE WORKER REGISTRATION
  // ==========================================================================
  // Why: Service workers can:
  // - Cache responses offline (may contain sensitive data)
  // - Intercept requests (can inject auth headers)
  // - Persist behavior across reloads
  // Blocking them makes agent sessions more stateless.
  // ==========================================================================

  if (navigator.serviceWorker) {
    try {
      // Block new registrations
      navigator.serviceWorker.register = function() {
        console.warn('[ContextFort] Service worker registration blocked in agent mode');
        return Promise.reject(new DOMException(
          'Service worker registration is disabled in agent mode',
          'SecurityError'
        ));
      };

      // Hide existing registrations from the page
      navigator.serviceWorker.getRegistration = function() {
        return Promise.resolve(undefined);
      };

      navigator.serviceWorker.getRegistrations = function() {
        return Promise.resolve([]);
      };

      // Block the ready promise from resolving with a real registration
      Object.defineProperty(navigator.serviceWorker, 'ready', {
        get() {
          return new Promise(() => {}); // Never resolves
        },
        configurable: false
      });

      // Make controller appear as null (no active service worker)
      Object.defineProperty(navigator.serviceWorker, 'controller', {
        get() { return null; },
        configurable: false
      });
    } catch (e) {
      console.error('[ContextFort] Failed to block service workers:', e);
    }
  }

  // ==========================================================================
  // SANDBOX ACTIVE
  // ==========================================================================
  console.log('[ContextFort] Agent sandbox active:', {
    localStorage: 'virtualized (empty)',
    indexedDB: 'disabled',
    serviceWorker: 'blocked'
  });

})();
