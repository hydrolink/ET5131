// ============================================
// Findings Page — Insight Cards
// ============================================

import { el, clearElement } from '../utils/dom.js';
import { getFindings, getAnalysis, getFindingCategories } from '../data.js';
import { renderFindingCard, renderAnalysisSection } from '../components/card.js';
import { observeElements } from '../components/scrollReveal.js';

export function renderFindings() {
  const findings = getFindings();
  const pinned = findings.filter(f => f.pinned);
  const nonPinned = findings.filter(f => !f.pinned);
  const categories = ['All', ...getFindingCategories()];

  // --- Pinned grid (mutable for filtering) ---
  const pinnedGridEl = el('div', { className: 'pinned-grid' },
    ...pinned.map(f => renderFindingCard(f))
  );

  const pinnedSection = pinned.length > 0 ? el('section', {
    className: 'pinned-section',
    'aria-label': 'Pinned insights'
  },
    el('div', { className: 'pinned-header', dataset: { reveal: '' } },
      el('span', {}, '★'),
      el('h3', {}, 'Top Insights')
    ),
    pinnedGridEl
  ) : null;

  // --- Filter tabs ---
  const tabButtons = categories.map(cat => {
    const btn = el('button', {
      className: `gallery-tab ${cat === 'All' ? 'gallery-tab-active' : ''}`,
      role: 'tab',
      'aria-selected': String(cat === 'All')
    }, cat);
    btn.addEventListener('click', () => switchCategory(cat));
    return btn;
  });

  const tabBar = el('div', {
    className: 'gallery-tabs findings-tabs',
    role: 'tablist',
    'aria-label': 'Filter findings by category'
  }, ...tabButtons);

  // --- Findings grid (mutable for filtering) ---
  const findingsGridEl = el('div', { className: 'findings-grid' },
    ...nonPinned.map(f => renderFindingCard(f))
  );

  // --- Filter logic ---
  function switchCategory(cat) {
    // Update tab active states
    tabButtons.forEach((btn, i) => {
      const isActive = categories[i] === cat;
      btn.classList.toggle('gallery-tab-active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    });

    // Filter pinned
    const filteredPinned = cat === 'All'
      ? pinned
      : pinned.filter(f => f.category === cat);

    clearElement(pinnedGridEl);
    filteredPinned.forEach(f => pinnedGridEl.appendChild(renderFindingCard(f)));
    if (pinnedSection) {
      pinnedSection.style.display = filteredPinned.length > 0 ? '' : 'none';
    }

    // Filter non-pinned
    const filtered = cat === 'All'
      ? nonPinned
      : nonPinned.filter(f => f.category === cat);

    clearElement(findingsGridEl);
    if (filtered.length === 0 && filteredPinned.length === 0) {
      findingsGridEl.appendChild(
        el('p', {
          style: { color: 'var(--text-muted)', fontStyle: 'italic', padding: 'var(--sp-6) 0' }
        }, `No findings in the "${cat}" category.`)
      );
    } else {
      filtered.forEach(f => findingsGridEl.appendChild(renderFindingCard(f)));
    }

    setTimeout(() => observeElements(), 50);
  }

  // --- Assemble page ---
  const page = el('div', { className: 'page-findings page-transition container' },
    el('div', { className: 'section-header' },
      el('h1', { className: 'section-title' }, 'Key Findings'),
      el('p', { className: 'section-subtitle' }, 'Insights, lessons, and discoveries from the field')
    ),

    // Pinned section
    pinnedSection,

    // Separator
    el('div', {
      style: {
        borderTop: '1px solid var(--border)',
        margin: 'var(--sp-8) 0 var(--sp-6)',
        opacity: '0.5'
      }
    }),

    // Filter tabs
    tabBar,

    // All findings grid (non-pinned, filtered)
    findingsGridEl,

    // Analysis separator
    el('div', {
      style: {
        borderTop: '2px solid var(--primary)',
        margin: 'var(--sp-12) 0 var(--sp-10)',
        opacity: '0.4'
      }
    }),

    // Entrepreneurial Analysis header
    el('div', { className: 'section-header', dataset: { reveal: '' } },
      el('h2', { className: 'section-title' }, 'Entrepreneurial Analysis'),
    ),

    // Analysis sections
    ...getAnalysis().map(section => renderAnalysisSection(section))
  );

  setTimeout(() => observeElements(), 50);
  return page;
}
