// ============================================
// Findings Page — Insight Cards
// ============================================

import { el } from '../utils/dom.js';
import { getFindings } from '../data.js';
import { renderFindingCard } from '../components/card.js';
import { observeElements } from '../components/scrollReveal.js';

export function renderFindings() {
  const findings = getFindings();
  const pinned = findings.filter(f => f.pinned);
  const all = findings;

  const page = el('div', { className: 'page-findings page-transition container' },
    el('div', { className: 'section-header' },
      el('h1', { className: 'section-title' }, 'Key Findings'),
      el('p', { className: 'section-subtitle' }, 'Insights, lessons, and discoveries from the field')
    ),

    // Pinned top 3
    pinned.length > 0 ? el('section', { className: 'pinned-section', 'aria-label': 'Pinned insights' },
      el('div', { className: 'pinned-header', dataset: { reveal: '' } },
        el('span', {}, '📌'),
        el('h3', {}, 'Top Insights')
      ),
      el('div', { className: 'pinned-grid' },
        ...pinned.map(f => renderFindingCard(f))
      )
    ) : null,

    // All findings separator
    el('div', {
      style: {
        borderTop: '1px solid var(--border)',
        margin: 'var(--sp-8) 0 var(--sp-10)',
        opacity: '0.5'
      }
    }),

    // Section header
    el('h2', {
      className: 'section-title',
      style: { fontSize: 'var(--fs-xl)', marginBottom: 'var(--sp-6)', textAlign: 'left' },
      dataset: { reveal: '' }
    }, 'All Findings'),

    // All findings grid
    el('div', { className: 'findings-grid' },
      ...all.map(f => renderFindingCard(f))
    )
  );

  setTimeout(() => observeElements(), 50);
  return page;
}
