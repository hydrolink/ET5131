// ============================================
// Navbar Component
// ============================================

import { $ } from '../utils/dom.js';

let isMenuOpen = false;

export function initNavbar() {
  const toggle = $('#navbar-toggle');
  const menu = $('#navbar-menu');

  if (!toggle || !menu) return;

  // Hamburger toggle
  toggle.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    document.body.classList.toggle('nav-open', isMenuOpen);
    toggle.setAttribute('aria-expanded', String(isMenuOpen));
  });

  // Close on nav link click
  menu.addEventListener('click', (e) => {
    if (e.target.matches('.nav-link')) {
      closeMenu();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
      closeMenu();
      toggle.focus();
    }
  });

  // Close on click outside
  document.addEventListener('click', (e) => {
    if (isMenuOpen && !e.target.closest('.navbar-inner')) {
      closeMenu();
    }
  });
}

function closeMenu() {
  isMenuOpen = false;
  document.body.classList.remove('nav-open');
  const toggle = $('#navbar-toggle');
  if (toggle) toggle.setAttribute('aria-expanded', 'false');
}

/** Update active nav link based on current route */
export function updateActiveNav(page) {
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    const linkPage = link.dataset.page;
    if (linkPage === page) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}
