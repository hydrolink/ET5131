// ============================================
// Card Component — Renders various card types
// ============================================

import { el, formatDateShort, randomRotation, randomTape } from '../utils/dom.js';

/**
 * Render a journal entry card for the masonry grid
 */
export function renderJournalCard(entry) {
  const rotation = randomRotation();
  const tapePos = randomTape();

  const card = el('article', {
    className: `card ${rotation}`,
    dataset: { reveal: '', revealDelay: String(Math.floor(Math.random() * 3) * 100) },
    tabindex: '0',
    role: 'article',
    'aria-label': entry.title
  },
    // Tape decoration
    el('div', { className: `tape ${tapePos}` }),

    // Image
    el('img', {
      className: 'card-image',
      src: entry.heroImage,
      alt: entry.title,
      loading: 'lazy'
    }),

    // Body
    el('div', { className: 'card-body' },
      el('time', { className: 'card-date', datetime: entry.date }, formatDateShort(entry.date)),
      el('h3', { className: 'card-title' }, entry.title),
      el('p', { className: 'card-excerpt' }, entry.summary),
      el('div', { className: 'tag-group' },
        ...entry.tags.slice(0, 3).map(tag =>
          el('span', { className: 'tag' }, `#${tag}`)
        )
      )
    ),

    // Footer
    el('div', { className: 'card-footer' },
      el('a', {
        className: 'card-link',
        href: `#/journal/${entry.id}`,
        'aria-label': `Read ${entry.title}`
      }, 'Read more')
    )
  );

  // Navigate on card click (not just the link)
  card.addEventListener('click', (e) => {
    if (!e.target.closest('a') && !e.target.closest('.tag')) {
      window.location.hash = `/journal/${entry.id}`;
    }
  });

  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      window.location.hash = `/journal/${entry.id}`;
    }
  });

  return card;
}

/**
 * Render a gallery card (polaroid style)
 */
export function renderGalleryCard(item, index) {
  const rotation = randomRotation();
  const tapePos = randomTape();
  const orientationClass = item.orientation === 'landscape' ? 'gallery-landscape' : 'gallery-portrait';

  const card = el('div', {
    className: `gallery-item ${orientationClass} ${rotation}`,
    dataset: { reveal: '', revealDelay: String((index % 4) * 100), galleryIndex: String(index) },
    tabindex: '0',
    role: 'button',
    'aria-label': `View photo: ${item.caption || 'Gallery photo'}`
  },
    el('div', { className: 'polaroid' },
      el('div', { className: `tape ${tapePos}` }),
      el('img', {
        className: 'polaroid-image',
        src: item.thumbnail,
        alt: item.caption || 'Gallery photo',
        loading: 'lazy'
      }),
      item.caption ? el('p', { className: 'polaroid-caption' }, item.caption) : null
    )
  );

  return card;
}

/**
 * Render a video card (local video with play overlay)
 */
export function renderVideoCard(video) {
  const videoEl = el('video', {
    className: 'video-player',
    src: video.src,
    preload: 'metadata',
    playsinline: '',
    'webkit-playsinline': ''
  });

  const playBtn = el('button', {
    className: 'video-play-btn',
    'aria-label': `Play ${video.title}`,
    innerHTML: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>'
  });

  const thumbnailContainer = el('div', { className: 'video-thumbnail' },
    videoEl,
    playBtn
  );

  const card = el('div', {
    className: 'video-card',
    dataset: { reveal: '' }
  },
    thumbnailContainer,
    el('div', { className: 'video-info' },
      el('h3', { className: 'video-title' }, video.title),
      el('p', { className: 'video-description' }, video.description),
      el('div', { className: 'video-meta' },
        el('span', {}, `📅 ${formatDateShort(video.date)}`),
        el('span', {}, `⏱ ${video.duration}`)
      )
    )
  );

  playBtn.addEventListener('click', () => {
    videoEl.controls = true;
    videoEl.play();
    playBtn.classList.add('hidden');
  });

  videoEl.addEventListener('pause', () => {
    playBtn.classList.remove('hidden');
  });

  videoEl.addEventListener('ended', () => {
    videoEl.currentTime = 0;
    videoEl.controls = false;
    playBtn.classList.remove('hidden');
  });

  return card;
}

/**
 * Render a structured analysis section
 */
export function renderAnalysisSection(section) {
  const subsectionEls = section.subsections.map(sub => {
    const children = [];

    children.push(el('h3', { className: 'analysis-subheading' }, sub.heading));

    if (sub.paragraphs) {
      sub.paragraphs.forEach(p => {
        children.push(el('p', { className: 'analysis-paragraph' }, p));
      });
    }

    if (sub.bullets) {
      children.push(
        el('ul', { className: 'analysis-list' },
          ...sub.bullets.map(b => {
            const parts = b.split(': ');
            if (parts.length >= 2) {
              const li = el('li', {});
              li.innerHTML = `<strong>${parts[0]}:</strong> ${parts.slice(1).join(': ')}`;
              return li;
            }
            return el('li', {}, b);
          })
        )
      );
    }

    return el('div', { className: 'analysis-subsection' }, ...children);
  });

  return el('div', {
    className: 'analysis-section',
    dataset: { reveal: '' }
  },
    el('div', { className: 'analysis-header' },
      el('span', { className: 'analysis-icon' }, section.icon),
      el('h2', { className: 'analysis-title' }, section.title)
    ),
    ...subsectionEls
  );
}

export function renderFindingCard(finding) {
  const categoryColors = {
    'Methods': 'tag-methods',
    'Results': 'tag-results',
    'Lessons': 'tag-lessons',
    'Mistakes': 'tag-mistakes',
    'Next Steps': 'tag-next'
  };

  const colorClass = categoryColors[finding.category] || '';

  const card = el('div', {
    className: `insight-card ${finding.pinned ? 'pinned' : ''}`,
    dataset: { reveal: '' }
  },
    finding.pinned ? el('div', { className: 'pin-badge', 'aria-label': 'Pinned insight' }, '★') : null,
    el('div', { className: 'insight-icon' }, finding.icon),
    el('span', { className: `insight-category ${colorClass}` }, finding.category),
    el('h3', { className: 'insight-title' }, finding.title),
    el('p', { className: 'insight-content' }, finding.content)
  );

  return card;
}
