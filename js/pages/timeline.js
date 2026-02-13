// ============================================
// Timeline Page
// ============================================

import { el, formatDate } from '../utils/dom.js';
import { getTimeline } from '../data.js';
import { observeElements } from '../components/scrollReveal.js';

/**
 * Helper: safe icon fallback
 */
function safeIcon(icon) {
  return icon || '📍';
}

export function renderTimeline() {
  const milestones = getTimeline();
  // if getTimeline returns an object { milestones: [...] }, normalize:
  const items = Array.isArray(milestones) ? milestones : (milestones && milestones.milestones) || [];

  // Group by year-month (YYYY-MM)
  const groups = {};
  items.forEach(m => {
    // ensure date exists
    const d = new Date(m.date + 'T00:00:00');
    if (Number.isNaN(d.getTime())) return; // skip malformed
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    if (!groups[key]) groups[key] = { label, items: [] };
    groups[key].items.push(m);
  });

  // Sort group keys chronologically
  const sortedKeys = Object.keys(groups).sort((a, b) => {
    return a.localeCompare(b);
  });

  const timelineContent = [];
  let nodeCounter = 0;

  // Start marker
  timelineContent.push(
    el('div', { className: 'timeline-start' },
      el('span', {}, '🌱 Journey Begins')
    )
  );

  sortedKeys.forEach(key => {
    const group = groups[key];

    // sort items in group by date ascending
    group.items.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Group container (label + nodes)
    const groupNode = el('section', { className: 'timeline-group', 'aria-label': group.label },
      el('div', { className: 'timeline-group-label' },
        el('span', {}, group.label)
      )
    );

    // Nodes
    group.items.forEach(milestone => {
      nodeCounter++;
      const side = nodeCounter % 2 === 1 ? 'timeline-node--left' : 'timeline-node--right';
      const node = el('article', {
        className: `timeline-node ${side}`,
        dataset: { reveal: '' },
      },
        el('div', { className: 'timeline-dot', 'aria-hidden': 'true' }),
        el('div', { className: 'timeline-card' },
          el('div', { className: 'timeline-icon', 'aria-label': milestone.title }, safeIcon(milestone.icon)),
          el('time', { className: 'timeline-date', datetime: milestone.date },
            formatDate(milestone.date)
          ),
          el('h3', { className: 'timeline-title' }, milestone.title),
          el('p', { className: 'timeline-description' }, milestone.description),
          milestone.entryId ?
            el('a', {
              className: 'timeline-link',
              href: `#/journal/${milestone.entryId}`,
              title: `Open journal entry: ${milestone.title}`
            }, 'Read Journal Entry') : null
        )
      );

      groupNode.appendChild(node);
    });

    timelineContent.push(groupNode);
  });

  // End marker
  timelineContent.push(
    el('div', { className: 'timeline-end' },
      el('span', {}, '📖 Journal Complete')
    )
  );

  const page = el('div', { className: 'page-timeline page-transition container' },
    el('div', { className: 'section-header' },
      el('h1', { className: 'section-title' }, 'Learning Timeline'),
      el('p', { className: 'section-subtitle' }, 'Moments, experiments, and lessons from BugBoom')
    ),
    el('div', { className: 'timeline-container' },
      ...timelineContent
    )
  );

  setTimeout(() => observeElements(), 50);
  return page;
}
