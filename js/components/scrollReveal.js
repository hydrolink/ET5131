// ============================================
// Scroll Reveal — IntersectionObserver animations
// ============================================

let observer = null;

/**
 * Initialize scroll reveal observer
 */
export function initScrollReveal() {
  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Show everything immediately
    document.querySelectorAll('[data-reveal]').forEach(el => {
      el.classList.add('revealed');
    });
    return;
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  observeElements();
}

/**
 * Observe all [data-reveal] elements currently in the DOM
 */
export function observeElements() {
  if (!observer) {
    // If reduced motion, just reveal everything
    document.querySelectorAll('[data-reveal]:not(.revealed)').forEach(el => {
      el.classList.add('revealed');
    });
    return;
  }

  document.querySelectorAll('[data-reveal]:not(.revealed)').forEach(el => {
    observer.observe(el);
  });
}

/**
 * Cleanup observer
 */
export function destroyScrollReveal() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}
