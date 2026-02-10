// ============================================
// Journal Page — List + Entry Detail
// ============================================

import { el, clearElement, formatDate, formatDateShort, randomRotation } from '../utils/dom.js';
import { getEntries, getEntryById, getEntryIndex, getEntryTags } from '../data.js';
import { renderJournalCard } from '../components/card.js';
import { createFilterBar, filterItems } from '../components/searchFilter.js';
import { openLightbox } from '../components/lightbox.js';
import { observeElements } from '../components/scrollReveal.js';

/**
 * Render journal list view
 */
export function renderJournalList() {
  const entries = getEntries();
  const tags = getEntryTags();

  const grid = el('div', { className: 'journal-grid', 'aria-label': 'Journal entries' });

  function renderCards(filteredEntries) {
    clearElement(grid);
    if (filteredEntries.length === 0) {
      grid.appendChild(
        el('div', { className: 'empty-state' },
          el('div', { className: 'empty-state-icon' }, '🌿'),
          el('p', { className: 'empty-state-text' }, 'No entries match your search. Try different keywords or tags.')
        )
      );
    } else {
      filteredEntries.forEach(entry => {
        grid.appendChild(renderJournalCard(entry));
      });
    }
    setTimeout(() => observeElements(), 50);
  }

  const filterBar = createFilterBar({
    tags,
    placeholder: 'Search journal entries...',
    onFilter: (searchTerm, activeTags) => {
      const filtered = filterItems(entries, searchTerm, activeTags, ['title', 'summary', 'tags']);
      renderCards(filtered);
      filterBar.updateResultsCount(filtered.length, entries.length);
    }
  });

  // Initial render
  renderCards(entries);

  // Pre-activate tag from URL query param (e.g. #/journal?tag=hiking)
  const hashParts = window.location.hash.split('?');
  if (hashParts[1]) {
    const params = new URLSearchParams(hashParts[1]);
    const preTag = params.get('tag');
    if (preTag && tags.includes(preTag)) {
      filterBar.activateTag(preTag);
    }
  }

  const page = el('div', { className: 'page-journal page-transition container' },
    el('div', { className: 'section-header' },
      el('h1', { className: 'section-title' }, 'Field Journal'),
      el('p', { className: 'section-subtitle' }, 'Reflections and observations from the field')
    ),
    filterBar,
    grid
  );

  return page;
}

/**
 * Render a single journal entry detail
 */
export function renderEntryDetail(entryId) {
  const entry = getEntryById(entryId);

  if (!entry) {
    return el('div', { className: 'page-transition container' },
      el('div', { className: 'empty-state' },
        el('div', { className: 'empty-state-icon' }, '🔍'),
        el('p', { className: 'empty-state-text' }, 'Entry not found.'),
        el('a', { className: 'btn btn-secondary', href: '#/journal', style: { marginTop: '1rem' } }, '← Back to Journal')
      )
    );
  }

  const entries = getEntries();
  const currentIndex = getEntryIndex(entryId);

  // Build content blocks
  const contentBlocks = entry.content.map((block, i) => {
    if (block.type === 'text') {
      return el('p', {}, block.value);
    } else if (block.type === 'image') {
      const rotation = randomRotation();
      const wrapper = el('figure', { className: `content-photo-wrapper ${rotation}`, style: { '--rotate': `${(Math.random() * 4 - 2).toFixed(1)}deg` } },
        el('img', {
          className: 'content-image',
          src: block.src,
          alt: block.alt || '',
          loading: 'lazy',
          style: { cursor: 'var(--cursor-pointer)', width: '100%' }
        }),
        block.caption ? el('figcaption', { className: 'image-caption' }, block.caption) : null
      );

      // Open lightbox on image click
      const allImages = entry.content
        .filter(b => b.type === 'image')
        .map(b => ({ src: b.src, alt: b.alt, caption: b.caption }));
      const imgIndex = entry.content.slice(0, i + 1).filter(b => b.type === 'image').length - 1;

      wrapper.querySelector('img').addEventListener('click', () => {
        openLightbox(allImages, imgIndex);
      });

      return wrapper;
    }
    return null;
  }).filter(Boolean);

  // Previous / Next entries
  const prevEntry = currentIndex < entries.length - 1 ? entries[currentIndex + 1] : null;
  const nextEntry = currentIndex > 0 ? entries[currentIndex - 1] : null;

  const page = el('div', { className: 'page-entry-detail page-transition container' },
    el('div', { className: 'entry-detail' },

      // Back link
      el('a', { className: 'entry-back', href: '#/journal' }, 'Back to Journal'),

      // Header
      el('header', { className: 'entry-header' },
        el('time', { className: 'entry-date', datetime: entry.date }, formatDate(entry.date)),
        el('h1', { className: 'entry-title' }, entry.title),
        el('div', { className: 'tag-group', style: { marginTop: 'var(--sp-3)' } },
          ...entry.tags.map(tag =>
            el('a', { className: 'tag', href: `#/journal?tag=${tag}` }, `#${tag}`)
          )
        )
      ),

      // Hero image
      el('img', {
        className: 'entry-hero-image',
        src: entry.heroImage,
        alt: entry.title,
        style: { cursor: 'var(--cursor-pointer)' }
      }),

      // Content
      el('div', { className: 'entry-content' }, ...contentBlocks),

      // Key Takeaways
      entry.keyTakeaways && entry.keyTakeaways.length > 0 ?
        el('div', { className: 'entry-takeaways sticky-note', style: { '--rotate': '-0.5deg' } },
          el('h3', { className: 'sticky-note-title' }, '🌿 Key Takeaways'),
          el('ul', { className: 'takeaway-list' },
            ...entry.keyTakeaways.map(t => el('li', {}, t))
          )
        ) : null,

      // Entry navigation
      el('nav', { className: 'entry-nav', 'aria-label': 'Entry navigation' },
        prevEntry ?
          el('a', { className: 'entry-nav-link entry-nav-prev', href: `#/journal/${prevEntry.id}` },
            el('span', { className: 'entry-nav-label' }, '← Previous'),
            el('span', { className: 'entry-nav-title' }, prevEntry.title)
          ) : el('span'),
        nextEntry ?
          el('a', { className: 'entry-nav-link entry-nav-next', href: `#/journal/${nextEntry.id}` },
            el('span', { className: 'entry-nav-label' }, 'Next →'),
            el('span', { className: 'entry-nav-title' }, nextEntry.title)
          ) : el('span')
      )
    )
  );

  // Hero image lightbox
  const heroImg = page.querySelector('.entry-hero-image');
  if (heroImg) {
    const allImages = [
      { src: entry.heroImage, alt: entry.title, caption: entry.title },
      ...entry.content.filter(b => b.type === 'image').map(b => ({ src: b.src, alt: b.alt, caption: b.caption }))
    ];
    heroImg.addEventListener('click', () => openLightbox(allImages, 0));
  }

  return page;
}
