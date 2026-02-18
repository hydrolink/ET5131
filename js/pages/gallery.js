// ============================================
// Gallery Page — Tabbed Masonry grid + Lightbox
// ============================================

import { el, clearElement } from '../utils/dom.js';
import { getGallery, getBackstory } from '../data.js';
import { renderGalleryCard } from '../components/card.js';
import { createGalleryFilterBar, filterGalleryItems, hasActiveFilters } from '../components/galleryFilter.js';
import { openLightbox } from '../components/lightbox.js';
import { observeElements } from '../components/scrollReveal.js';

export function renderGallery() {
  const gallery = getGallery();
  const backstory = getBackstory();

  let activeTab = 'site-visit';
  let filterBar = null;
  let grid = null;
  let contentArea = null;

  function buildGrid(items) {
    const newGrid = el('div', { className: 'gallery-masonry', 'aria-label': 'Photo gallery' });

    if (items.length === 0) {
      newGrid.appendChild(
        el('div', { className: 'empty-state' },
          el('div', { className: 'empty-state-icon' }, '📷'),
          el('p', { className: 'empty-state-text' }, 'No photos match your filter.')
        )
      );
      return newGrid;
    }

    items.forEach((item, index) => {
      const card = renderGalleryCard(item, index);

      card.addEventListener('click', () => {
        const images = items.map(g => ({
          src: g.src,
          alt: g.caption || 'Gallery photo',
          caption: g.caption
        }));
        openLightbox(images, index);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const images = items.map(g => ({
            src: g.src,
            alt: g.caption || 'Gallery photo',
            caption: g.caption
          }));
          openLightbox(images, index);
        }
      });

      newGrid.appendChild(card);
    });

    return newGrid;
  }

  function renderSiteVisitTab() {
    clearElement(contentArea);

    const anyItemHasTags = gallery.some(item => item.tags && item.tags.length > 0);

    grid = buildGrid(gallery);

    filterBar = createGalleryFilterBar({
      placeholder: 'Search photos...',
      onFilter: (searchTerm, activeTagsByCategory) => {
        let filtered;
        if (!anyItemHasTags && hasActiveFilters(activeTagsByCategory)) {
          filtered = searchTerm
            ? filterGalleryItems(gallery, searchTerm, {})
            : gallery;
        } else {
          filtered = filterGalleryItems(gallery, searchTerm, activeTagsByCategory);
        }
        clearElement(grid);
        const newGrid = buildGrid(filtered);
        grid.replaceWith(newGrid);
        grid = newGrid;
        filterBar.updateResultsCount(filtered.length, gallery.length);
        setTimeout(() => observeElements(), 50);
      }
    });

    contentArea.appendChild(filterBar);
    contentArea.appendChild(grid);
    setTimeout(() => observeElements(), 50);
  }

  function renderBackstoryTab() {
    clearElement(contentArea);
    grid = buildGrid(backstory);
    contentArea.appendChild(grid);
    setTimeout(() => observeElements(), 50);
  }

  function switchTab(tab) {
    if (tab === activeTab) return;
    activeTab = tab;

    // Update tab button states
    tabSiteVisit.classList.toggle('gallery-tab-active', tab === 'site-visit');
    tabBackstory.classList.toggle('gallery-tab-active', tab === 'backstory');
    tabSiteVisit.setAttribute('aria-selected', String(tab === 'site-visit'));
    tabBackstory.setAttribute('aria-selected', String(tab === 'backstory'));

    if (tab === 'site-visit') {
      renderSiteVisitTab();
    } else {
      renderBackstoryTab();
    }
  }

  // Tab buttons
  const tabSiteVisit = el('button', {
    className: 'gallery-tab gallery-tab-active',
    role: 'tab',
    'aria-selected': 'true',
    'aria-controls': 'gallery-content'
  }, 'Site Visit');

  const tabBackstory = el('button', {
    className: 'gallery-tab',
    role: 'tab',
    'aria-selected': 'false',
    'aria-controls': 'gallery-content'
  }, 'Backstory');

  tabSiteVisit.addEventListener('click', () => switchTab('site-visit'));
  tabBackstory.addEventListener('click', () => switchTab('backstory'));

  const tabBar = el('div', { className: 'gallery-tabs', role: 'tablist', 'aria-label': 'Gallery sections' },
    tabSiteVisit,
    tabBackstory
  );

  contentArea = el('div', { className: 'gallery-content', id: 'gallery-content', role: 'tabpanel' });

  const page = el('div', { className: 'page-gallery page-transition container' },
    el('div', { className: 'section-header' },
      el('h1', { className: 'section-title' }, 'Field Gallery'),
      el('p', { className: 'section-subtitle' }, 'Captured moments from the wild')
    ),
    tabBar,
    contentArea
  );

  // Render initial tab
  renderSiteVisitTab();

  return page;
}
