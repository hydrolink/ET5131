// ============================================
// Search & Filter Component
// ============================================

import { el } from '../utils/dom.js';
import { debounce } from '../utils/debounce.js';

/**
 * Create a search + tag filter bar
 * @param {Object} options
 * @param {string[]} options.tags - Available tags
 * @param {Function} options.onFilter - Callback with (searchTerm, activeTags)
 * @param {string} options.placeholder - Search placeholder text
 * @returns {HTMLElement}
 */
export function createFilterBar({ tags = [], onFilter, placeholder = 'Search entries...' }) {
  const activeTags = new Set();
  let searchTerm = '';

  const resultsRegion = el('div', {
    className: 'results-count',
    'aria-live': 'polite',
    role: 'status'
  });

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

  const tagContainer = el('div', { className: 'filter-tags' },
    el('span', { className: 'filter-label' }, 'Filter:'),
    ...tags.map(tag => {
      const chip = el('button', {
        className: 'tag',
        'aria-pressed': 'false',
        type: 'button'
      }, `#${tag}`);

      chip.addEventListener('click', () => {
        if (activeTags.has(tag)) {
          activeTags.delete(tag);
          chip.classList.remove('active');
          chip.setAttribute('aria-pressed', 'false');
        } else {
          activeTags.add(tag);
          chip.classList.add('active');
          chip.setAttribute('aria-pressed', 'true');
        }
        triggerFilter();
      });

      return chip;
    })
  );

  const bar = el('div', { className: 'filter-bar', role: 'search' },
    searchContainer,
    tagContainer,
    resultsRegion
  );

  const triggerFilter = debounce(() => {
    if (onFilter) {
      onFilter(searchTerm, Array.from(activeTags));
    }
  }, 200);

  searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value.trim().toLowerCase();
    triggerFilter();
  });

  /** Update results count display */
  bar.updateResultsCount = (count, total) => {
    if (searchTerm || activeTags.size > 0) {
      resultsRegion.textContent = `Showing ${count} of ${total} items`;
    } else {
      resultsRegion.textContent = '';
    }
  };

  /** Programmatically activate a tag by name */
  bar.activateTag = (tagName) => {
    const chips = tagContainer.querySelectorAll('.tag');
    chips.forEach(chip => {
      if (chip.textContent === `#${tagName}`) {
        activeTags.add(tagName);
        chip.classList.add('active');
        chip.setAttribute('aria-pressed', 'true');
      }
    });
    triggerFilter();
  };

  return bar;
}

/**
 * Filter entries based on search term and active tags
 */
export function filterItems(items, searchTerm, activeTags, searchFields = ['title', 'summary', 'tags']) {
  return items.filter(item => {
    // Search match
    let matchesSearch = true;
    if (searchTerm) {
      matchesSearch = searchFields.some(field => {
        const value = item[field];
        if (Array.isArray(value)) {
          return value.some(v => v.toLowerCase().includes(searchTerm));
        }
        return typeof value === 'string' && value.toLowerCase().includes(searchTerm);
      });
    }

    // Tag match (OR logic)
    let matchesTags = true;
    if (activeTags.length > 0) {
      const itemTags = item.tags || [];
      matchesTags = activeTags.some(tag => itemTags.includes(tag));
    }

    return matchesSearch && matchesTags;
  });
}
