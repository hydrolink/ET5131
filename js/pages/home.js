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
        style: { backgroundImage: 'url(/assets/photos/20260207_vidacity_wefie.jpg)' }
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
        el('h1', { className: 'hero-title' }, "BugBoom x ET5131"),
        el('p', { className: 'hero-subtitle' },
          'This journal follows our visit to BugBoom — a student startup turning food waste into fertiliser using black soldier fly larvae. Here, we share what we learned, what surprised us, and how it changed the way we think about entrepreneurship and sustainability.'
        ),
        el('div', { className: 'hero-cta' },
          el('a', { className: 'btn btn-primary btn-lg', href: '#/journal' }, 'Start Reading →')
        )
      )
    ),
    // Quick tiles
    el('section', { className: 'container', 'aria-label': 'Quick navigation' },
      el('div', { className: 'quick-tiles' },
        createQuickTile('reflections', 'Reflections', '#/journal'),
        createQuickTile('gallery', 'Gallery', '#/gallery'),
        createQuickTile('videos', 'Videos', '#/videos'),
        createQuickTile('findings', 'Findings', '#/findings'),
        createQuickTile('timeline', 'Timeline', '#/timeline')
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

const QUICK_TILE_ICONS = {
  reflections: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v18H6.5A2.5 2.5 0 0 0 4 23z"/><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v18h4.5A2.5 2.5 0 0 1 20 23z"/></svg>',
  gallery: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="M21 16l-5.5-5.5L7 19"/></svg>',
  videos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M10 9l5 3-5 3z"/></svg>',
  findings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  timeline: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 9h18"/><path d="M8 13h3M13 13h3M8 17h3"/></svg>'
};
function createQuickTile(iconId, label, href) {
  const delay = REVEAL_DELAYS[tileIndex % REVEAL_DELAYS.length];
  tileIndex++;
  const iconMarkup = QUICK_TILE_ICONS[iconId] || QUICK_TILE_ICONS.reflections;
  return el('a', {
    className: 'quick-tile',
    href,
    dataset: { reveal: '', revealDelay: delay }
  },
    el('span', { className: 'quick-tile-icon', 'aria-hidden': 'true', innerHTML: iconMarkup }),
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

