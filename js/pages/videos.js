// ============================================
// Videos Page
// ============================================

import { el } from '../utils/dom.js';
import { getVideos } from '../data.js';
import { renderVideoCard } from '../components/card.js';
import { observeElements } from '../components/scrollReveal.js';

export function renderVideos() {
  const videos = getVideos();

  const page = el('div', { className: 'page-videos page-transition container' },
    el('div', { className: 'section-header' },
      el('h1', { className: 'section-title' }, 'Field Videos'),
      el('p', { className: 'section-subtitle' }, 'Clips from our visit to BugBoom — interviews, observations, and behind-the-scenes moments')
    ),
    el('div', { className: 'videos-grid' },
      ...videos.map(video => renderVideoCard(video))
    )
  );

  setTimeout(() => observeElements(), 50);
  return page;
}
