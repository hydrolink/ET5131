// ============================================
// Timeline Page
// ============================================

import { el, formatDate } from '../utils/dom.js';
import { getTimeline } from '../data.js';
import { observeElements } from '../components/scrollReveal.js';

export function renderTimeline() {
  const milestones = getTimeline();

  // Group by year-month
  const groups = {};
  milestones.forEach(m => {
    const d = new Date(m.date + 'T00:00:00');
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    if (!groups[key]) groups[key] = { label, items: [] };
    groups[key].items.push(m);
  });

  const timelineContent = [];
  let nodeCounter = 0;

  // Start marker
  timelineContent.push(
    el('div', { className: 'timeline-start' },
      el('span', {}, '🌱 Journey Begins')
    )
  );

  Object.keys(groups).sort().forEach(key => {
    const group = groups[key];

    // Month/Year label
    timelineContent.push(
      el('div', { className: 'timeline-group-label' },
        el('span', {}, group.label)
      )
    );

    // Nodes
    group.items.forEach(milestone => {
      nodeCounter++;
      const side = nodeCounter % 2 === 1 ? 'timeline-node--left' : 'timeline-node--right';
      const node = el('div', {
        className: `timeline-node ${side}`,
        dataset: { reveal: '' }
      },
        el('div', { className: 'timeline-dot' }),
        el('div', { className: 'timeline-card' },
          el('div', { className: 'timeline-icon' }, milestone.icon),
          el('time', { className: 'timeline-date', datetime: milestone.date },
            formatDate(milestone.date)
          ),
          el('h3', { className: 'timeline-title' }, milestone.title),
          el('p', { className: 'timeline-description' }, milestone.description),
          milestone.entryId ?
            el('a', {
              className: 'timeline-link',
              href: `#/journal/${milestone.entryId}`
            }, 'Read Journal Entry') : null
        )
      );

      timelineContent.push(node);
    });
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
      el('p', { className: 'section-subtitle' }, 'A chronological journey through a season of discovery')
    ),
    el('div', { className: 'timeline-container' },
      ...timelineContent
    )
  );

  setTimeout(() => observeElements(), 50);
  return page;
}
