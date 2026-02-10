// ============================================
// Home Page
// ============================================

import { el, formatDateShort, randomRotation, randomTape } from '../utils/dom.js';
import { getEntries } from '../data.js';
import { observeElements } from '../components/scrollReveal.js';

export function renderHome() {
  const entries = getEntries();
  const featured = entries.slice(0, 3);
  tileIndex = 0; // reset on re-render

  const page = el('div', { className: 'page-home page-transition' },

    // Hero section
    el('section', { className: 'hero', 'aria-label': 'Welcome' },
      el('div', {
        className: 'hero-bg',
        style: { backgroundImage: 'url(https://picsum.photos/seed/nature-hero/1400/800)' }
      }),

      // Decorative doodles
      el('div', {
        className: 'hero-doodle hero-doodle-tl',
        'aria-hidden': 'true',
        innerHTML: `<svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <path d="M30 5C18 5 8 15 10 28c2 13 15 22 28 20S55 30 48 18C42 8 35 5 30 5z" stroke="currentColor" stroke-width="1.5" fill="none"/>
          <path d="M30 5c0 8-2 16-8 22" stroke="currentColor" stroke-width="1" fill="none" opacity="0.5"/>
          <path d="M30 5c5 6 10 14 8 23" stroke="currentColor" stroke-width="1" fill="none" opacity="0.5"/>
        </svg>`
      }),
      el('div', {
        className: 'hero-doodle hero-doodle-tr',
        'aria-hidden': 'true',
        innerHTML: `<svg width="50" height="50" viewBox="0 0 50 50" fill="none">
          <path d="M25 2c-5 8-8 18-4 28 4 10 14 16 22 12" stroke="currentColor" stroke-width="1.5" fill="none"/>
          <path d="M10 40c8-4 14-12 15-20" stroke="currentColor" stroke-width="1" fill="none" opacity="0.4"/>
        </svg>`
      }),
      el('div', {
        className: 'hero-doodle hero-doodle-br',
        'aria-hidden': 'true',
        innerHTML: `<svg width="70" height="70" viewBox="0 0 70 70" fill="none">
          <path d="M35 65L30 35 5 38" stroke="currentColor" stroke-width="1.2" fill="none"/>
          <path d="M35 65L40 35 65 38" stroke="currentColor" stroke-width="1.2" fill="none"/>
          <path d="M35 65L35 10" stroke="currentColor" stroke-width="1.2" fill="none"/>
          <path d="M28 20l7-10 7 10" stroke="currentColor" stroke-width="1" fill="none" opacity="0.5"/>
        </svg>`
      }),

      el('div', { className: 'hero-content' },
        el('h1', { className: 'hero-title' }, "Nature's Journal"),
        el('p', { className: 'hero-subtitle' },
          'A collection of moments in the wild — reflections, findings, and photographs from a season of learning outdoors.'
        ),
        el('div', { className: 'hero-cta' },
          el('a', { className: 'btn btn-primary btn-lg', href: '#/journal' }, 'Start Reading →')
        )
      )
    ),

    // Quick tiles
    el('section', { className: 'container', 'aria-label': 'Quick navigation' },
      el('div', { className: 'quick-tiles' },
        createQuickTile('📖', 'Reflections', '#/journal'),
        createQuickTile('🖼️', 'Gallery', '#/gallery'),
        createQuickTile('🎬', 'Videos', '#/videos'),
        createQuickTile('🔍', 'Findings', '#/findings'),
        createQuickTile('📅', 'Timeline', '#/timeline')
      )
    ),

    // Featured entries
    el('section', { className: 'container featured-section', 'aria-label': 'Featured entries' },
      el('div', { className: 'section-header', dataset: { reveal: '' } },
        el('h2', { className: 'section-title' }, 'Latest from the Field'),
        el('p', { className: 'section-subtitle' }, 'Recent reflections and discoveries')
      ),
      el('div', { className: 'featured-grid' },
        ...featured.map((entry, i) => createFeaturedCard(entry, i))
      )
    ),

    // Nature quote
    el('section', {
      className: 'container',
      style: { textAlign: 'center', marginTop: '4rem' },
      dataset: { reveal: '' }
    },
      el('blockquote', {
        style: {
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--fs-2xl)',
          color: 'var(--primary)',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.4'
        }
      }, '"In every walk with nature, one receives far more than he seeks."'),
      el('cite', {
        style: {
          display: 'block',
          marginTop: 'var(--sp-3)',
          fontSize: 'var(--fs-sm)',
          color: 'var(--text-dim)',
          fontStyle: 'normal'
        }
      }, '— John Muir')
    )
  );

  // Trigger scroll reveals after rendering
  setTimeout(() => observeElements(), 50);

  return page;
}

const REVEAL_DELAYS = ['100', '200', '300', '400', '500'];
let tileIndex = 0;

function createQuickTile(icon, label, href) {
  const delay = REVEAL_DELAYS[tileIndex % REVEAL_DELAYS.length];
  tileIndex++;
  return el('a', {
    className: 'quick-tile',
    href,
    dataset: { reveal: '', revealDelay: delay }
  },
    el('span', { className: 'quick-tile-icon', 'aria-hidden': 'true' }, icon),
    el('span', { className: 'quick-tile-label' }, label)
  );
}

function createFeaturedCard(entry, index) {
  const rotation = randomRotation();
  const tapePos = randomTape();
  const delay = REVEAL_DELAYS[index % REVEAL_DELAYS.length];

  return el('article', {
    className: `card ${rotation}`,
    dataset: { reveal: '', revealDelay: delay },
    style: { cursor: 'var(--cursor-pointer)' },
    onClick: () => { window.location.hash = `/journal/${entry.id}`; }
  },
    el('div', { className: `tape ${tapePos}` }),
    el('img', {
      className: 'card-image',
      src: entry.heroImage,
      alt: entry.title,
      loading: 'lazy'
    }),
    el('div', { className: 'card-body' },
      el('time', { className: 'card-date', datetime: entry.date }, formatDateShort(entry.date)),
      el('h3', { className: 'card-title' }, entry.title),
      el('p', { className: 'card-excerpt' }, entry.summary)
    ),
    el('div', { className: 'card-footer' },
      el('a', { className: 'card-link', href: `#/journal/${entry.id}` }, 'Read more')
    )
  );
}
