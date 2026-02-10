// ============================================
// DOM Utilities
// ============================================

/**
 * Create a DOM element with attributes and children
 * @param {string} tag - HTML tag name
 * @param {Object} attrs - Attributes/properties
 * @param {...(Node|string)} children - Child nodes or text
 * @returns {HTMLElement}
 */
export function el(tag, attrs = {}, ...children) {
  const element = document.createElement(tag);

  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'dataset') {
      for (const [dk, dv] of Object.entries(value)) {
        element.dataset[dk] = dv;
      }
    } else if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === 'innerHTML') {
      element.innerHTML = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } else {
      element.setAttribute(key, value);
    }
  }

  for (const child of children) {
    if (child == null) continue;
    if (typeof child === 'string' || typeof child === 'number') {
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      element.appendChild(child);
    } else if (Array.isArray(child)) {
      child.forEach(c => {
        if (c instanceof Node) element.appendChild(c);
      });
    }
  }

  return element;
}

/** Shortcut for querySelector */
export function $(selector, context = document) {
  return context.querySelector(selector);
}

/** Shortcut for querySelectorAll as Array */
export function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

/** Remove all children of an element */
export function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/** Format a date string into readable format */
export function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/** Format date short (e.g., "Sep 15, 2025") */
export function formatDateShort(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/** Format date for machine-readable */
export function formatDateISO(dateStr) {
  return dateStr; // Already ISO format
}

/** Get a random integer between min and max (inclusive) */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Get a random rotation class (rotate-1 through rotate-8) */
export function randomRotation() {
  return `rotate-${randomInt(1, 8)}`;
}

/** Get a random tape position class */
export function randomTape() {
  const positions = ['tape-top-left', 'tape-top-right', 'tape-top-center'];
  return positions[randomInt(0, positions.length - 1)];
}

/** Pick a random item from an array */
export function randomPick(arr) {
  return arr[randomInt(0, arr.length - 1)];
}
