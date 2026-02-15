// ============================================
// Gallery Page — Masonry grid + Lightbox
// ============================================

import { el, clearElement } from '../utils/dom.js';
import { getGallery } from '../data.js';
import { renderGalleryCard } from '../components/card.js';
import { createGalleryFilterBar, filterGalleryItems, hasActiveFilters } from '../components/galleryFilter.js';
import { openLightbox } from '../components/lightbox.js';
import { observeElements } from '../components/scrollReveal.js';

export function renderGallery() {
  const gallery = getGallery();

  const grid = el('div', { className: 'gallery-masonry', 'aria-label': 'Photo gallery' });

  const anyItemHasTags = gallery.some(item => item.tags && item.tags.length > 0);

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

      card.addEventListener('click', () => {
        const images = filteredItems.map(g => ({
          src: g.src,
          alt: g.caption || 'Gallery photo',
          caption: g.caption
        }));
        openLightbox(images, index);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const images = filteredItems.map(g => ({
            src: g.src,
            alt: g.caption || 'Gallery photo',
            caption: g.caption
          }));
          openLightbox(images, index);
        }
      });

      grid.appendChild(card);
    });

    setTimeout(() => observeElements(), 50);
  }

  const filterBar = createGalleryFilterBar({
    placeholder: 'Search photos...',
    onFilter: (searchTerm, activeTagsByCategory) => {
      let filtered;
      if (!anyItemHasTags && hasActiveFilters(activeTagsByCategory)) {
        // No items are tagged yet — show all, filtered only by search
        filtered = searchTerm
          ? filterGalleryItems(gallery, searchTerm, {})
          : gallery;
      } else {
        filtered = filterGalleryItems(gallery, searchTerm, activeTagsByCategory);
      }
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
