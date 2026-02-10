// ============================================
// Lightbox Component — Fullscreen image viewer
// ============================================

import { $ } from '../utils/dom.js';

let currentImages = [];
let currentIndex = 0;
let previousFocus = null;

const lightboxEl = () => $('#lightbox');
const imageEl = () => $('.lightbox-image');
const captionEl = () => $('.lightbox-caption');
const counterEl = () => $('.lightbox-counter');

/**
 * Open lightbox with an array of images
 * @param {Array<{src: string, alt: string, caption: string}>} images
 * @param {number} startIndex
 */
export function openLightbox(images, startIndex = 0) {
  currentImages = images;
  currentIndex = startIndex;
  previousFocus = document.activeElement;

  const lb = lightboxEl();
  if (!lb) return;

  lb.removeAttribute('hidden');
  // Force reflow before adding class for transition
  lb.offsetHeight;
  lb.classList.add('active');

  document.body.style.overflow = 'hidden';
  showImage();

  // Focus the close button
  setTimeout(() => {
    const closeBtn = $('.lightbox-close');
    if (closeBtn) closeBtn.focus();
  }, 100);
}

export function closeLightbox() {
  const lb = lightboxEl();
  if (!lb) return;

  lb.classList.remove('active');
  document.body.style.overflow = '';

  setTimeout(() => {
    lb.setAttribute('hidden', '');
  }, 300);

  // Restore focus
  if (previousFocus) {
    previousFocus.focus();
    previousFocus = null;
  }
}

function showImage() {
  const img = imageEl();
  const cap = captionEl();
  const cnt = counterEl();

  if (!img || !currentImages[currentIndex]) return;

  const item = currentImages[currentIndex];
  img.src = item.src;
  img.alt = item.alt || item.caption || '';
  if (cap) cap.textContent = item.caption || '';
  if (cnt) cnt.textContent = `${currentIndex + 1} / ${currentImages.length}`;

  // Preload adjacent images
  preloadAdjacent();
}

function preloadAdjacent() {
  const preload = (idx) => {
    if (idx >= 0 && idx < currentImages.length) {
      const img = new Image();
      img.src = currentImages[idx].src;
    }
  };
  preload(currentIndex - 1);
  preload(currentIndex + 1);
}

function nextImage() {
  currentIndex = (currentIndex + 1) % currentImages.length;
  showImage();
}

function prevImage() {
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  showImage();
}

/**
 * Initialize lightbox event listeners (call once)
 */
export function initLightbox() {
  const lb = lightboxEl();
  if (!lb) return;

  // Close button
  const closeBtn = $('.lightbox-close');
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  // Backdrop click
  const backdrop = $('.lightbox-backdrop');
  if (backdrop) backdrop.addEventListener('click', closeLightbox);

  // Navigation
  const prevBtn = $('.lightbox-prev');
  const nextBtn = $('.lightbox-next');
  if (prevBtn) prevBtn.addEventListener('click', prevImage);
  if (nextBtn) nextBtn.addEventListener('click', nextImage);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('active')) return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        prevImage();
        break;
      case 'ArrowRight':
        nextImage();
        break;
    }
  });

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  lb.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lb.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const delta = touchEndX - touchStartX;
    if (Math.abs(delta) > 50) {
      if (delta > 0) prevImage();
      else nextImage();
    }
  }, { passive: true });
}
