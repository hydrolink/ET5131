# 🌿 Nature's Journal — Scrapbook Learning Journal

A cozy, immersive **scrapbook-style learning journal** built as a pure frontend website. Browse reflections, findings, photos, and videos in a nature-themed digital field journal that feels tactile, layered, and personal.

## Quick Start

**No build step required.** Simply open `index.html` in a modern browser.

For best results with ES modules, use a local dev server:

```bash
# Option 1: npx serve
npx serve .

# Option 2: Python
python -m http.server 8000

# Option 3: VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

Then visit `http://localhost:8000` (or whichever port is assigned).

## Tech Stack

- **HTML5** + **CSS3** + **Vanilla JavaScript** (ES Modules)
- No frameworks, no build tools, no backend
- Content stored as local JSON seed data
- Responsive (mobile-first) and accessible (ARIA, keyboard nav)

## Color Palette — Jungle Mist

| Token          | Hex       | Usage                  |
|----------------|-----------|------------------------|
| Background     | `#31463F` | Page background        |
| Surface/Nav    | `#2D3A36` | Navbar, footer, inputs |
| Card           | `#3A4A45` | Card backgrounds       |
| Border/Divider | `#556762` | Borders, separators    |
| Primary (Gold) | `#C5B495` | Logo, buttons, accents |
| Primary Hover  | `#D4C7AD` | Hover states           |
| Text           | `#F4F1E8` | Headings, body text    |
| Muted Text     | `#CFC8B8` | Secondary text, captions |

## Features

- 📖 **Journal / Reflections** — Browse, search, and filter entries by tag
- 🔍 **Findings** — Insight cards with pinned top-3 highlights
- 🖼️ **Gallery** — Masonry image grid with lightbox viewer
- 🎬 **Videos** — Responsive embedded video cards
- 📅 **Timeline** — Chronological journey of learning milestones
- 🎨 **Scrapbook Toggle** — Switch between clean and scrapbook views
- ♿ **Accessible** — Keyboard navigation, ARIA labels, reduced motion support

## File Structure

```
├── index.html              # Single-page app shell
├── css/
│   ├── variables.css       # Design tokens & CSS custom properties
│   ├── reset.css           # Modern CSS reset
│   ├── layout.css          # Global layout, nav, footer
│   ├── scrapbook.css       # Torn paper, tape, clips, stamps
│   ├── components.css      # Cards, buttons, tags, inputs
│   ├── pages.css           # Page-specific styles
│   ├── timeline.css        # Timeline layout
│   ├── lightbox.css        # Image viewer overlay
│   └── responsive.css      # Breakpoint overrides
├── js/
│   ├── app.js              # Entry point
│   ├── router.js           # Hash-based SPA router
│   ├── data.js             # JSON data loader
│   ├── pages/              # Page renderers
│   └── components/         # Reusable UI components
├── data/                   # JSON seed content
│   ├── entries.json        # 8 journal entries
│   ├── gallery.json        # 12 gallery items
│   ├── findings.json       # 6 insight cards
│   ├── videos.json         # 4 video entries
│   └── timeline.json       # 10 milestones
└── assets/                 # SVG decorations & icons
```

## Browser Support

All modern browsers (Chrome 90+, Firefox 90+, Safari 15+, Edge 90+).
