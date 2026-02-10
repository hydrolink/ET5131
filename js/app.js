// ============================================
// App Entry Point
// Nature's Journal — Scrapbook Learning Journal
// ============================================

import { loadAllData } from './data.js';
import { addRoute, initRouter } from './router.js';
import { initNavbar } from './components/navbar.js';
import { initLightbox } from './components/lightbox.js';
import { initLayoutToggle } from './components/layoutToggle.js';
import { initScrollReveal } from './components/scrollReveal.js';

// Page renderers
import { renderHome } from './pages/home.js';
import { renderJournalList, renderEntryDetail } from './pages/journal.js';
import { renderFindings } from './pages/findings.js';
import { renderGallery } from './pages/gallery.js';
import { renderVideos } from './pages/videos.js';
import { renderTimeline } from './pages/timeline.js';

function initCursorState() {
  const setOpen = () => document.body.classList.add('cursor-open');
  const setClose = () => document.body.classList.remove('cursor-open');

  window.addEventListener('mousedown', setOpen);
  window.addEventListener('mouseup', setClose);
  window.addEventListener('blur', setClose);
  window.addEventListener('dragend', setClose);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) setClose();
  });
}

/**
 * Bootstrap the application
 */
async function init() {
  // 1. Load all data
  await loadAllData();

  // 2. Initialize global behavior + components
  initCursorState();
  initNavbar();
  initLightbox();
  initLayoutToggle();
  initScrollReveal();

  // 3. Register routes
  addRoute('/', () => renderHome());
  addRoute('/journal', () => renderJournalList());
  addRoute('/journal/:id', (params) => renderEntryDetail(params.id));
  addRoute('/findings', () => renderFindings());
  addRoute('/gallery', () => renderGallery());
  addRoute('/videos', () => renderVideos());
  addRoute('/timeline', () => renderTimeline());

  // 4. Start router
  initRouter();
}

// Go!
init().catch(err => {
  console.error('Failed to initialize app:', err);
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🌿</div>
        <p class="empty-state-text">Something went wrong loading the journal. Please try refreshing the page.</p>
        <p style="color: var(--text-dim); font-size: 0.875rem; margin-top: 1rem;">
          Make sure you're running this from a local server (e.g., <code>npx serve .</code>) for ES module support.
        </p>
      </div>
    `;
  }
});
