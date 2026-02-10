// ============================================
// Gallery Page — Masonry grid + Lightbox
// ============================================

import { el, clearElement } from '../utils/dom.js';
import { getGallery, getGalleryTags } from '../data.js';
import { renderGalleryCard } from '../components/card.js';
import { createFilterBar, filterItems } from '../components/searchFilter.js';
import { openLightbox } from '../components/lightbox.js';
import { observeElements } from '../components/scrollReveal.js';

export function renderGallery() {
  const gallery = getGallery();
  const tags = getGalleryTags();

  const grid = el('div', { className: 'gallery-masonry', 'aria-label': 'Photo gallery' });

  function renderItems(filteredItems) {
    clearElement(grid);

    if (filteredItems.length === 0) {
      grid.appendChild(
        el('div', { className: 'empty-state' },
          el('div', { className: 'empty-state-icon' }, '📷'),
          el('p', { className: 'empty-state-text' }, 'No photos match your filter.')
        )
      );
      return;
    }

    filteredItems.forEach((item, index) => {
      const card = renderGalleryCard(item, index);

      // Open lightbox on click
      card.addEventListener('click', () => {
        const images = filteredItems.map(g => ({
          src: g.src,
          alt: g.caption,
          caption: g.caption
        }));
        openLightbox(images, index);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const images = filteredItems.map(g => ({
            src: g.src,
            alt: g.caption,
            caption: g.caption
          }));
          openLightbox(images, index);
        }
      });

      grid.appendChild(card);
    });

    setTimeout(() => observeElements(), 50);
  }

  const filterBar = createFilterBar({
    tags,
    placeholder: 'Search photos...',
    onFilter: (searchTerm, activeTags) => {
      const filtered = filterItems(gallery, searchTerm, activeTags, ['caption', 'tags']);
      renderItems(filtered);
      filterBar.updateResultsCount(filtered.length, gallery.length);
    }
  });

  renderItems(gallery);

  const page = el('div', { className: 'page-gallery page-transition container' },
    el('div', { className: 'section-header' },
      el('h1', { className: 'section-title' }, 'Field Gallery'),
      el('p', { className: 'section-subtitle' }, 'Captured moments from the wild')
    ),
    filterBar,
    grid
  );

  return page;
}
