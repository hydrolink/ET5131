// ============================================
// Data Loader — Fetch and cache JSON seed data
// ============================================

let entries = null;
let gallery = null;
let backstory = null;
let findings = null;
let videos = null;
let timeline = null;

/**
 * Load all JSON data files
 */
export async function loadAllData() {
  try {
    const [entriesRes, galleryRes, backstoryRes, findingsRes, videosRes, timelineRes] = await Promise.all([
      fetch('data/entries.json'),
      fetch('data/gallery.json'),
      fetch('data/backstory.json'),
      fetch('data/findings.json'),
      fetch('data/videos.json'),
      fetch('data/timeline.json')
    ]);

    entries = await entriesRes.json();
    gallery = await galleryRes.json();
    backstory = await backstoryRes.json();
    findings = await findingsRes.json();
    videos = await videosRes.json();
    timeline = await timelineRes.json();

    // Sort entries by date descending
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Sort timeline by date ascending
    timeline.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Sort gallery by date descending
    gallery.sort((a, b) => new Date(b.date) - new Date(a.date));

  } catch (err) {
    console.error('Failed to load data:', err);
    // Provide empty arrays as fallback
    entries = entries || [];
    gallery = gallery || [];
    backstory = backstory || [];
    findings = findings || [];
    videos = videos || [];
    timeline = timeline || [];
  }
}

/** Get all journal entries */
export function getEntries() {
  return entries || [];
}

/** Get a single entry by ID */
export function getEntryById(id) {
  return (entries || []).find(e => e.id === id) || null;
}

/** Get entry index */
export function getEntryIndex(id) {
  return (entries || []).findIndex(e => e.id === id);
}

/** Get all gallery items */
export function getGallery() {
  return gallery || [];
}

/** Get all backstory items */
export function getBackstory() {
  return backstory || [];
}

/** Get all findings */
export function getFindings() {
  return findings || [];
}

/** Get all videos */
export function getVideos() {
  return videos || [];
}

/** Get all timeline milestones */
export function getTimeline() {
  return timeline || [];
}

/** Get all unique tags from entries */
export function getEntryTags() {
  const tags = new Set();
  (entries || []).forEach(e => e.tags.forEach(t => tags.add(t)));
  return Array.from(tags).sort();
}

/** Get all unique tags from gallery */
export function getGalleryTags() {
  const tags = new Set();
  (gallery || []).forEach(g => g.tags.forEach(t => tags.add(t)));
  return Array.from(tags).sort();
}

/** Get all finding categories */
export function getFindingCategories() {
  const cats = new Set();
  (findings || []).forEach(f => cats.add(f.category));
  return Array.from(cats);
}
