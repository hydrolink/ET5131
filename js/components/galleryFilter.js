// ============================================
// Gallery Filter Component — Categorized filters
// ============================================

import { el, clearElement } from '../utils/dom.js';
import { debounce } from '../utils/debounce.js';

/**
 * Filter category definitions
 */
const FILTER_CATEGORIES = [
  {
    id: 'theme',
    label: 'Theme',
    options: ['sustainability', 'circular-economy', 'urban-farming', 'waste-to-value', 'food-systems', 'biodiversity', 'climate-education', 'innovation']
  },
  {
    id: 'subject',
    label: 'Subject',
    options: ['insects', 'larvae-trays', 'compost', 'feedstock', 'plants', 'greenhouse', 'terrarium', 'exhibits', 'signage', 'architecture', 'tools-equipment', 'workshop-artifacts']
  },
  {
    id: 'activity',
    label: 'Activity',
    options: ['site-visit', 'lab-demo', 'sampling', 'observation', 'tour', 'experiment', 'workshop', 'showcase', 'presentation', 'team-photo']
  },
  {
    id: 'media-type',
    label: 'Media Type',
    options: ['photo', 'video', 'poster', 'infographic', 'close-up', 'wide-shot']
  },
  {
    id: 'setting',
    label: 'Setting',
    options: ['indoor', 'outdoor', 'lab', 'classroom', 'farm', 'exhibit-hall']
  },
  {
    id: 'people',
    label: 'People',
    options: ['solo', 'group', 'speaker', 'visitors']
  }
];

/**
 * Create a categorized gallery filter bar
 * @param {Object} options
 * @param {Function} options.onFilter - Callback with (searchTerm, activeTagsByCategory)
 * @param {string} options.placeholder - Search placeholder text
 * @returns {HTMLElement}
 */
export function createGalleryFilterBar({ onFilter, placeholder = 'Search photos...' }) {
  const activeTagsByCategory = {};
  FILTER_CATEGORIES.forEach(cat => { activeTagsByCategory[cat.id] = new Set(); });
  let searchTerm = '';
  let openCategoryId = null;

  const resultsRegion = el('div', {
    className: 'results-count',
    'aria-live': 'polite',
    role: 'status'
  });

  // Search input
  const searchInput = el('input', {
    className: 'search-input',
    type: 'search',
    placeholder,
    'aria-label': placeholder
  });

  const iconWrapper = el('span', {
    className: 'search-icon',
    innerHTML: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
    'aria-hidden': 'true'
  });

  const searchContainer = el('div', { className: 'search-container' },
    iconWrapper,
    searchInput
  );

  // Clear all button
  const clearBtn = el('button', {
    className: 'filter-clear-btn',
    type: 'button',
    style: { display: 'none' }
  }, 'Clear all');
  const optionsPanelInner = el('div', { className: 'filter-options-panel-inner' });
  const optionsPanel = el('div', {
    className: 'filter-options-panel',
    id: 'gallery-filter-options'
  }, optionsPanelInner);

  const chipGroups = new Map();
  const pillButtons = new Map();
  const pillCountBadges = new Map();

  FILTER_CATEGORIES.forEach(category => {
    const chips = category.options.map(option => {
      const chip = el('button', {
        className: 'tag filter-option-chip',
        'aria-pressed': 'false',
        type: 'button'
      }, `#${option}`);

      chip.addEventListener('click', () => {
        const catTags = activeTagsByCategory[category.id];
        if (catTags.has(option)) {
          catTags.delete(option);
          chip.classList.remove('active');
          chip.setAttribute('aria-pressed', 'false');
        } else {
          catTags.add(option);
          chip.classList.add('active');
          chip.setAttribute('aria-pressed', 'true');
        }

        updateClearBtn();
        updatePillStates();
        triggerFilter();
      });

      return chip;
    });

    const chipGroup = el('div', { className: 'filter-options-tags' }, ...chips);
    chipGroups.set(category.id, chipGroup);
  });

  const categoryPills = FILTER_CATEGORIES.map(category => {
    const countBadge = el('span', {
      className: 'filter-pill-count',
      style: { display: 'none' }
    }, '0');
    pillCountBadges.set(category.id, countBadge);

    const pill = el('button', {
      className: 'filter-pill',
      type: 'button',
      'aria-expanded': 'false',
      'aria-controls': 'gallery-filter-options'
    },
    el('span', { className: 'filter-pill-label' }, category.label),
    countBadge,
    el('span', {
      className: 'filter-pill-chevron',
      'aria-hidden': 'true',
      innerHTML: '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 4.5L6 8l3.5-3.5"/></svg>'
    }));

    pill.addEventListener('click', () => {
      openCategoryId = openCategoryId === category.id ? null : category.id;
      updateAccordion();
    });

    pillButtons.set(category.id, pill);
    return pill;
  });

  const filterControls = el('div', { className: 'filter-controls' },
    el('div', { className: 'filter-category-pills' }, ...categoryPills),
    clearBtn
  );

  const bar = el('div', { className: 'gallery-filter-bar', role: 'search' },
    searchContainer,
    filterControls,
    optionsPanel,
    resultsRegion
  );

  clearBtn.addEventListener('click', () => {
    FILTER_CATEGORIES.forEach(cat => activeTagsByCategory[cat.id].clear());
    chipGroups.forEach(group => {
      group.querySelectorAll('.filter-option-chip.active').forEach(chip => {
        chip.classList.remove('active');
        chip.setAttribute('aria-pressed', 'false');
      });
    });

    searchTerm = '';
    searchInput.value = '';
    openCategoryId = null;
    updateAccordion();
    updateClearBtn();
    updatePillStates();
    triggerFilter();
  });

  function updateClearBtn() {
    const hasActiveTags = FILTER_CATEGORIES.some(cat => activeTagsByCategory[cat.id].size > 0);
    const hasActive = Boolean(searchTerm) || hasActiveTags;
    clearBtn.style.display = hasActive ? '' : 'none';
  }

  function updatePillStates() {
    FILTER_CATEGORIES.forEach(category => {
      const selectedCount = activeTagsByCategory[category.id].size;
      const pill = pillButtons.get(category.id);
      const countBadge = pillCountBadges.get(category.id);
      const isOpen = openCategoryId === category.id;

      pill.classList.toggle('open', isOpen);
      pill.classList.toggle('has-selections', selectedCount > 0);
      pill.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

      countBadge.textContent = String(selectedCount);
      countBadge.style.display = selectedCount > 0 ? '' : 'none';
    });
  }

  function updateAccordion() {
    clearElement(optionsPanelInner);

    if (!openCategoryId) {
      optionsPanel.classList.remove('open');
      updatePillStates();
      return;
    }

    const chipGroup = chipGroups.get(openCategoryId);
    if (chipGroup) {
      optionsPanelInner.appendChild(chipGroup);
      optionsPanel.classList.add('open');
    } else {
      optionsPanel.classList.remove('open');
    }

    updatePillStates();
  }

  const triggerFilter = debounce(() => {
    if (onFilter) {
      const serialized = {};
      for (const cat of FILTER_CATEGORIES) {
        serialized[cat.id] = Array.from(activeTagsByCategory[cat.id]);
      }
      onFilter(searchTerm, serialized);
    }
  }, 200);

  searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value.trim().toLowerCase();
    updateClearBtn();
    triggerFilter();
  });

  bar.updateResultsCount = (count, total) => {
    const hasFilters = searchTerm || FILTER_CATEGORIES.some(cat => activeTagsByCategory[cat.id].size > 0);
    if (hasFilters) {
      resultsRegion.textContent = `Showing ${count} of ${total} photos`;
    } else {
      resultsRegion.textContent = '';
    }
  };

  updatePillStates();

  return bar;
}

/**
 * Filter gallery items with categorized tags
 * AND across categories, OR within each category
 */
export function filterGalleryItems(items, searchTerm, activeTagsByCategory) {
  return items.filter(item => {
    // Search match
    let matchesSearch = true;
    if (searchTerm) {
      const caption = (item.caption || '').toLowerCase();
      const tags = (item.tags || []).map(t => t.toLowerCase());
      matchesSearch = caption.includes(searchTerm) || tags.some(t => t.includes(searchTerm));
    }

    // Category match: AND across categories, OR within each
    let matchesTags = true;
    for (const [categoryId, tags] of Object.entries(activeTagsByCategory)) {
      if (!tags || tags.length === 0) continue;
      const itemTags = item.tags || [];
      if (!tags.some(tag => itemTags.includes(tag))) {
        matchesTags = false;
        break;
      }
    }

    return matchesSearch && matchesTags;
  });
}

/**
 * Check if any filters are active
 */
export function hasActiveFilters(activeTagsByCategory) {
  return Object.values(activeTagsByCategory).some(tags =>
    Array.isArray(tags) ? tags.length > 0 : false
  );
}
