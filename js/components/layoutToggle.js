// ============================================
// Layout Toggle — Scrapbook vs Clean view
// ============================================

import { $ } from '../utils/dom.js';

const STORAGE_KEY = 'natures-journal-scrapbook-mode';

/**
 * Initialize the layout toggle
 */
export function initLayoutToggle() {
  const btn = $('#layout-toggle');
  if (!btn) return;

  // Load preference
  const stored = localStorage.getItem(STORAGE_KEY);
  const isScrapbook = stored !== 'false'; // default: true

  document.body.classList.toggle('scrapbook-mode', isScrapbook);
  btn.classList.toggle('active', isScrapbook);
  btn.title = isScrapbook ? 'Switch to clean view' : 'Switch to scrapbook view';

  btn.addEventListener('click', () => {
    const current = document.body.classList.contains('scrapbook-mode');
    const newState = !current;

    document.body.classList.toggle('scrapbook-mode', newState);
    btn.classList.toggle('active', newState);
    btn.title = newState ? 'Switch to clean view' : 'Switch to scrapbook view';

    localStorage.setItem(STORAGE_KEY, String(newState));
  });
}
