// ============================================
// Hash-based SPA Router
// ============================================

import { $, clearElement } from './utils/dom.js';
import { updateActiveNav } from './components/navbar.js';

const routes = {};
let appContainer = null;

/**
 * Register a route handler
 * @param {string} path - Route pattern (e.g., '/journal/:id')
 * @param {Function} handler - Function that returns an HTMLElement
 */
export function addRoute(path, handler) {
  routes[path] = handler;
}

/**
 * Initialize the router
 */
export function initRouter() {
  appContainer = $('#app');

  window.addEventListener('hashchange', handleRoute);

  // Handle initial route
  handleRoute();
}

/**
 * Navigate programmatically
 */
export function navigate(path) {
  window.location.hash = path;
}

/**
 * Handle route change
 */
async function handleRoute() {
  const hash = window.location.hash.slice(1) || '/';
  const { handler, params } = matchRoute(hash);

  if (!handler) {
    // 404 — show home
    window.location.hash = '/';
    return;
  }

  // Determine active page for nav
  const page = getPageFromHash(hash);
  updateActiveNav(page);

  // Render new page
  try {
    const content = await handler(params);
    if (content && appContainer) {
      clearElement(appContainer);
      appContainer.appendChild(content);

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  } catch (err) {
    console.error('Route render error:', err);
  }
}

/**
 * Match a hash path to a registered route
 */
function matchRoute(hash) {
  // Clean hash
  const path = hash.split('?')[0]; // Remove query params

  // Try exact match first
  if (routes[path]) {
    return { handler: routes[path], params: {} };
  }

  // Try parameterized routes
  for (const [pattern, handler] of Object.entries(routes)) {
    const regex = patternToRegex(pattern);
    const match = path.match(regex);
    if (match) {
      const paramNames = extractParamNames(pattern);
      const params = {};
      paramNames.forEach((name, i) => {
        params[name] = match[i + 1];
      });
      return { handler, params };
    }
  }

  return { handler: null, params: {} };
}

/**
 * Convert route pattern to regex
 */
function patternToRegex(pattern) {
  const regexStr = pattern
    .replace(/:[^/]+/g, '([^/]+)')
    .replace(/\//g, '\\/');
  return new RegExp(`^${regexStr}$`);
}

/**
 * Extract parameter names from pattern
 */
function extractParamNames(pattern) {
  const names = [];
  const regex = /:([^/]+)/g;
  let match;
  while ((match = regex.exec(pattern)) !== null) {
    names.push(match[1]);
  }
  return names;
}

/**
 * Get page name from hash for nav highlighting
 */
function getPageFromHash(hash) {
  if (hash === '/' || hash === '') return 'home';
  const segments = hash.split('/').filter(Boolean);
  return segments[0] || 'home';
}
